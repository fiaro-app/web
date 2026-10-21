import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ApiRequestError } from '@/lib/api';
import { useImport } from './use-import';

const { runImport } = vi.hoisted(() => ({ runImport: vi.fn() }));
vi.mock('@/features/imports/import-api', () => ({ runImport }));
const { readSheet } = vi.hoisted(() => ({ readSheet: vi.fn() }));
vi.mock('read-excel-file/browser', () => ({ readSheet }));

const HEADER = 'Cédula,Nombre,Ocupación,Celular,Dirección\n';
const csv = (...lines: string[]) => new File([HEADER + lines.join('\n')], 'hoja.csv', { type: 'text/csv' });
const result = (row: number, status: string, message?: string) => ({ row, status, client: 'NEW', loan: false, issues: message ? [{ field: 'phone', message }] : [] });

beforeEach(() => {
  vi.clearAllMocks();
});

describe('useImport', () => {
  it('reads a csv, reviews it with dryRun and leaves the result ready to confirm', async () => {
    runImport.mockResolvedValue({ dryRun: true, rows: [result(1, 'READY'), result(2, 'INVALID', 'Celular inválido')] });
    const { result: hook } = renderHook(() => useImport());

    await act(() => hook.current.choose(csv('1,Ana,,3001112222,', '2,Luis,,123,')));

    expect(runImport).toHaveBeenCalledWith(expect.any(Array), true);
    expect(hook.current.state).toMatchObject({ phase: 'review', items: [{ sheetRow: 2, status: 'READY' }, { sheetRow: 3, status: 'INVALID', problems: ['Celular inválido'] }] });
  });

  it('confirming sends without dryRun and ends in done', async () => {
    runImport.mockResolvedValueOnce({ rows: [result(1, 'READY')] }).mockResolvedValueOnce({ rows: [result(1, 'IMPORTED')] });
    const { result: hook } = renderHook(() => useImport());
    await act(() => hook.current.choose(csv('1,Ana,,3001112222,')));

    await act(() => hook.current.confirm());

    expect(runImport).toHaveBeenLastCalledWith(expect.any(Array), false);
    expect(hook.current.state).toMatchObject({ phase: 'done', items: [{ status: 'IMPORTED' }] });
  });

  it('splits long sheets into chunks of 200 and numbers rows across them', async () => {
    runImport.mockImplementation((rows: unknown[]) => Promise.resolve({ rows: rows.map((_, i) => result(i + 1, 'READY')) }));
    const lines = Array.from({ length: 250 }, (_, i) => `${i + 1},Ana,,3001112222,`);
    const { result: hook } = renderHook(() => useImport());

    await act(() => hook.current.choose(csv(...lines)));

    expect(runImport.mock.calls.map((call) => (call[0] as unknown[]).length)).toEqual([200, 50]);
    const items = hook.current.state.phase === 'review' ? hook.current.state.items : [];
    expect(items).toHaveLength(250);
    expect(items.at(-1)?.sheetRow).toBe(251);
  });

  it('keeps rows with a half-written loan out of the request', async () => {
    runImport.mockResolvedValue({ rows: [result(1, 'READY')] });
    const file = new File([`${HEADER.trim()},Cuotas que faltan,Valor de la cuota,Frecuencia,Próxima cuota\n1,Ana,,3001112222,,5,,,\n2,Luis,,3001112223,,,,,`], 'h.csv');
    const { result: hook } = renderHook(() => useImport());

    await act(() => hook.current.choose(file));

    expect((runImport.mock.calls[0]?.[0] as unknown[]).length).toBe(1);
    expect(hook.current.state).toMatchObject({ phase: 'review', items: [{ sheetRow: 2, status: 'INVALID' }, { sheetRow: 3, status: 'READY' }] });
  });

  it('reads an xlsx with the library', async () => {
    readSheet.mockResolvedValue([['Cédula', 'Nombre', 'Celular'], ['1', 'Ana', '3001112222']]);
    runImport.mockResolvedValue({ rows: [result(1, 'READY')] });
    const { result: hook } = renderHook(() => useImport());

    await act(() => hook.current.choose(new File(['x'], 'hoja.xlsx')));

    expect(hook.current.state.phase).toBe('review');
  });

  it.each([
    ['a pdf', new File(['x'], 'hoja.pdf'), 'no es un .xlsx'],
    ['an empty sheet', new File([HEADER], 'hoja.csv'), 'no tiene filas'],
    ['missing columns', new File(['Nombre\nAna'], 'hoja.csv'), 'Faltan estas columnas'],
  ])('goes back to the start with a message for %s', async (_name, file, message) => {
    const { result: hook } = renderHook(() => useImport());

    await act(() => hook.current.choose(file));

    expect(hook.current.state).toMatchObject({ phase: 'idle', error: expect.stringContaining(message) });
    expect(runImport).not.toHaveBeenCalled();
  });

  it('says the file is unreadable when the library throws', async () => {
    readSheet.mockRejectedValue(new Error('zip'));
    const { result: hook } = renderHook(() => useImport());

    await act(() => hook.current.choose(new File(['x'], 'hoja.xlsx')));

    expect(hook.current.state).toMatchObject({ phase: 'idle', error: expect.stringContaining('No pudimos leer') });
  });

  it('shows the API message when the plan or role is denied, and a generic one on network failure', async () => {
    const { result: hook } = renderHook(() => useImport());
    runImport.mockRejectedValueOnce(new ApiRequestError({ statusCode: 403, code: 'PLAN_FEATURE_UNAVAILABLE', message: 'Tu plan no incluye importar.' }));
    await act(() => hook.current.choose(csv('1,Ana,,3001112222,')));
    expect(hook.current.state).toMatchObject({ phase: 'idle', error: 'Tu plan no incluye importar.' });

    runImport.mockRejectedValueOnce(new TypeError('network'));
    await act(() => hook.current.choose(csv('1,Ana,,3001112222,')));
    expect(hook.current.state).toMatchObject({ phase: 'idle', error: expect.stringContaining('conexión') });
  });

  it('a chunk that fails after others were created marks the rest as failed instead of losing the result', async () => {
    runImport
      .mockImplementationOnce((rows: unknown[]) => Promise.resolve({ rows: rows.map((_, i) => result(i + 1, 'READY')) }))
      .mockImplementationOnce((rows: unknown[]) => Promise.resolve({ rows: rows.map((_, i) => result(i + 1, 'READY')) }))
      .mockImplementationOnce((rows: unknown[]) => Promise.resolve({ rows: rows.map((_, i) => result(i + 1, 'IMPORTED')) }))
      .mockRejectedValueOnce(new TypeError('network'));
    const lines = Array.from({ length: 250 }, (_, i) => `${i + 1},Ana,,3001112222,`);
    const { result: hook } = renderHook(() => useImport());
    await act(() => hook.current.choose(csv(...lines)));

    await act(() => hook.current.confirm());

    const items = hook.current.state.phase === 'done' ? hook.current.state.items : [];
    expect(items.filter((item) => item.status === 'IMPORTED')).toHaveLength(200);
    expect(items.filter((item) => item.status === 'FAILED')).toHaveLength(50);
  });

  it('reset goes back to the start and confirm without a review does nothing', async () => {
    const { result: hook } = renderHook(() => useImport());

    await act(() => hook.current.confirm());
    expect(hook.current.state.phase).toBe('idle');

    runImport.mockResolvedValue({ rows: [result(1, 'READY')] });
    await act(() => hook.current.choose(csv('1,Ana,,3001112222,')));
    act(() => hook.current.reset());
    expect(hook.current.state).toEqual({ phase: 'idle', error: null });
  });
});
