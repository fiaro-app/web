import { act, renderHook } from '@testing-library/react';
import type { ChangeEvent, SubmitEvent } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ApiRequestError } from '@/lib/api';
import { deletePortfolio, renamePortfolio } from './lender-api';
import { usePortfolioActions } from './use-portfolio-actions';

const refresh = vi.fn();
vi.mock('next/navigation', () => ({ useRouter: () => ({ refresh }) }));
vi.mock('./lender-api', () => ({ renamePortfolio: vi.fn(), deletePortfolio: vi.fn() }));

const rename = vi.mocked(renamePortfolio);
const remove = vi.mocked(deletePortfolio);
const PORTFOLIO = { id: 'p2', name: 'Zona Norte' };
const submitEvent = { preventDefault: vi.fn() } as unknown as SubmitEvent<HTMLFormElement>;
const typed = (value: string) => ({ target: { value } }) as ChangeEvent<HTMLInputElement>;
const conflict = new ApiRequestError({ statusCode: 409, code: 'CONFLICT', message: 'x' });

beforeEach(() => {
  vi.clearAllMocks();
  rename.mockResolvedValue({} as never);
  remove.mockResolvedValue(undefined);
});

describe('usePortfolioActions — rename', () => {
  it('renames, leaves the edit mode and refreshes the page', async () => {
    const { result } = renderHook(() => usePortfolioActions(PORTFOLIO));

    act(() => result.current.startEditing());
    act(() => result.current.changeName(typed('  Zona Sur ')));
    await act(() => result.current.submitRename(submitEvent));

    expect(rename).toHaveBeenCalledWith('p2', 'Zona Sur');
    expect(result.current.isEditing).toBe(false);
    expect(refresh).toHaveBeenCalledTimes(1);
  });

  it('validates the name before calling the API', async () => {
    const { result } = renderHook(() => usePortfolioActions(PORTFOLIO));

    act(() => result.current.startEditing());
    act(() => result.current.changeName(typed('   ')));
    await act(() => result.current.submitRename(submitEvent));

    expect(result.current.fieldError).toBe('Escribe el nombre de la cartera.');
    expect(rename).not.toHaveBeenCalled();
    expect(result.current.isEditing).toBe(true);
  });

  it('does nothing when the name did not change', async () => {
    const { result } = renderHook(() => usePortfolioActions(PORTFOLIO));

    act(() => result.current.startEditing());
    await act(() => result.current.submitRename(submitEvent));

    expect(rename).not.toHaveBeenCalled();
    expect(result.current.isEditing).toBe(false);
  });

  it('says the name is taken and stays editing', async () => {
    rename.mockRejectedValue(conflict);
    const { result } = renderHook(() => usePortfolioActions(PORTFOLIO));

    act(() => result.current.startEditing());
    act(() => result.current.changeName(typed('General')));
    await act(() => result.current.submitRename(submitEvent));

    expect(result.current.error).toBe('Ya tienes una cartera con ese nombre.');
    expect(result.current.isEditing).toBe(true);
    expect(result.current.isBusy).toBe(false);
    expect(refresh).not.toHaveBeenCalled();
  });

  it('cancels the edit', () => {
    const { result } = renderHook(() => usePortfolioActions(PORTFOLIO));

    act(() => result.current.startEditing());
    act(() => result.current.cancelEditing());

    expect(result.current.isEditing).toBe(false);
  });
});

describe('usePortfolioActions — delete', () => {
  it('asks to confirm, deletes and refreshes the page', async () => {
    const { result } = renderHook(() => usePortfolioActions(PORTFOLIO));

    act(() => result.current.askDelete());
    expect(result.current.isConfirmingDelete).toBe(true);
    await act(() => result.current.confirmDelete());

    expect(remove).toHaveBeenCalledWith('p2');
    expect(result.current.isConfirmingDelete).toBe(false);
    expect(refresh).toHaveBeenCalledTimes(1);
  });

  it('explains why it cannot be deleted (default portfolio or active collectors)', async () => {
    remove.mockRejectedValue(conflict);
    const { result } = renderHook(() => usePortfolioActions(PORTFOLIO));

    act(() => result.current.askDelete());
    await act(() => result.current.confirmDelete());

    expect(result.current.error).toMatch(/cobradores activos/);
    expect(result.current.isConfirmingDelete).toBe(false);
    expect(refresh).not.toHaveBeenCalled();
  });

  it('can be dismissed without deleting', () => {
    const { result } = renderHook(() => usePortfolioActions(PORTFOLIO));

    act(() => result.current.askDelete());
    act(() => result.current.cancelDelete());

    expect(result.current.isConfirmingDelete).toBe(false);
    expect(remove).not.toHaveBeenCalled();
  });
});
