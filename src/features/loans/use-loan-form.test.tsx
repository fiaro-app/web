import { act, renderHook } from '@testing-library/react';
import type { ChangeEvent, FormEvent } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ApiRequestError } from '@/lib/api';
import { assignCollector, createLoan } from './loans-api';
import { useLoanForm } from './use-loan-form';

const replace = vi.fn();
const refresh = vi.fn();
vi.mock('next/navigation', () => ({ useRouter: () => ({ replace, refresh }) }));
vi.mock('./loans-api', () => ({ createLoan: vi.fn(), assignCollector: vi.fn() }));
const create = vi.mocked(createLoan);
const assign = vi.mocked(assignCollector);

const change = (value: string) => ({ target: { value } }) as ChangeEvent<HTMLInputElement>;
const submitEvent = () => ({ preventDefault: vi.fn() }) as unknown as FormEvent<HTMLFormElement>;
const CLIENT_ID = '0192f0a4-7c3e-7000-8000-000000000001';

type Hook = ReturnType<typeof renderHook<ReturnType<typeof useLoanForm>, unknown>>['result'];

function fill(result: Hook) {
  act(() => result.current.setText('clientId')(change(CLIENT_ID)));
  act(() => result.current.setAmount('principalAmount')(500_000));
  act(() => result.current.setText('installmentCount')(change('20')));
  act(() => result.current.setAmount('installmentValue')(30_000));
  act(() => result.current.setText('frequency')(change('DAILY')));
}

beforeEach(() => {
  vi.clearAllMocks();
  create.mockResolvedValue({ id: 'new-loan' } as never);
  assign.mockResolvedValue({} as never);
});

const setup = () => renderHook(() => useLoanForm()).result;

describe('useLoanForm', () => {
  it('starts with today as the start date', () => {
    expect(setup().current.values.startDate).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  it('suggests the total from installments × value', () => {
    const result = setup();
    fill(result);
    expect(result.current.values.totalPayable).toBe(600_000);
  });

  it('stops suggesting once the total was edited by hand', () => {
    const result = setup();
    fill(result);
    act(() => result.current.setTotalPayable(650_000));
    act(() => result.current.setAmount('installmentValue')(40_000));
    expect(result.current.values.totalPayable).toBe(650_000);
  });

  it('validates before calling the API', async () => {
    const result = setup();
    await act(() => result.current.submit(submitEvent()));
    expect(result.current.fieldErrors.clientId).toBe('Elige el cliente.');
    expect(result.current.formError).toMatch(/Revisa los campos/);
    expect(create).not.toHaveBeenCalled();
  });

  it('creates the loan and goes back to the list', async () => {
    const result = setup();
    fill(result);
    await act(() => result.current.submit(submitEvent()));
    expect(create).toHaveBeenCalledWith(
      expect.objectContaining({ clientId: CLIENT_ID, installmentCount: 20, totalPayable: 600_000, frequency: 'DAILY' }),
    );
    expect(replace).toHaveBeenCalledWith('/prestamos');
    expect(refresh).toHaveBeenCalled();
  });

  it('shows a form-level error when the API refuses', async () => {
    create.mockRejectedValue(new ApiRequestError({ statusCode: 403, code: 'FORBIDDEN', message: 'x' }));
    const result = setup();
    fill(result);
    await act(() => result.current.submit(submitEvent()));
    expect(result.current.formError).toBe('No tienes permiso para administrar préstamos.');
    expect(result.current.isSubmitting).toBe(false);
    expect(replace).not.toHaveBeenCalled();
  });

  it('places server validation issues on their field and clears them on edit', async () => {
    create.mockRejectedValue(
      new ApiRequestError({ statusCode: 400, code: 'VALIDATION_FAILED', message: 'x', issues: [{ path: ['startDate'], message: 'Fecha inválida' }] }),
    );
    const result = setup();
    fill(result);
    await act(() => result.current.submit(submitEvent()));
    expect(result.current.fieldErrors.startDate).toBe('Fecha inválida');
    act(() => result.current.setText('startDate')(change('2026-10-02')));
    expect(result.current.fieldErrors.startDate).toBeUndefined();
  });

  it('does not send the collector in the loan body and assigns it after creating', async () => {
    const result = setup();
    fill(result);
    act(() => result.current.setText('collectorId')(change('0192f0a4-7c3e-7000-8000-0000000000aa')));
    await act(() => result.current.submit(submitEvent()));
    expect(create.mock.calls[0]?.[0]).not.toHaveProperty('collectorId');
    expect(assign).toHaveBeenCalledWith('new-loan', '0192f0a4-7c3e-7000-8000-0000000000aa');
    expect(replace).toHaveBeenCalledWith('/prestamos');
  });

  it('does not try to assign when no collector was chosen', async () => {
    const result = setup();
    fill(result);
    await act(() => result.current.submit(submitEvent()));
    expect(assign).not.toHaveBeenCalled();
  });

  it('warns when the loan was created but the collector could not be assigned, and blocks a second loan', async () => {
    assign.mockRejectedValue(new ApiRequestError({ statusCode: 403, code: 'FORBIDDEN', message: 'x' }));
    const result = setup();
    fill(result);
    act(() => result.current.setText('collectorId')(change('0192f0a4-7c3e-7000-8000-0000000000aa')));
    await act(() => result.current.submit(submitEvent()));
    expect(result.current.createdLoanId).toBe('new-loan');
    expect(result.current.formError).toMatch(/El préstamo se creó/);
    expect(replace).not.toHaveBeenCalled();
    await act(() => result.current.submit(submitEvent()));
    expect(create).toHaveBeenCalledTimes(1);
  });
});
