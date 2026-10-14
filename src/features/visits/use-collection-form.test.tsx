import { act, renderHook } from '@testing-library/react';
import type { SubmitEvent } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ApiRequestError } from '@/lib/api';
import { useCollectionForm } from './use-collection-form';
import { createVisit } from './visits-api';

const refresh = vi.fn();
vi.mock('next/navigation', () => ({ useRouter: () => ({ refresh }) }));
vi.mock('./visits-api', () => ({ createVisit: vi.fn() }));

const create = vi.mocked(createVisit);
const submitEvent = () => ({ preventDefault: vi.fn() }) as unknown as SubmitEvent<HTMLFormElement>;
const api = (statusCode: number, code: string) => new ApiRequestError({ statusCode, code, message: 'x' });
const setup = () => renderHook(() => useCollectionForm({ loanId: 'l1', installmentValue: 30_000 })).result;

beforeEach(() => {
  vi.clearAllMocks();
  create.mockResolvedValue({} as never);
});

describe('useCollectionForm', () => {
  it('proposes the installment value as a cash payment', () => {
    const result = setup();
    expect(result.current).toMatchObject({ outcome: 'PAID', amount: 30_000, method: 'CASH' });
    expect(result.current.confirmation.title).toBe('¿Registrar este pago?');
    expect(result.current.confirmation.description).toContain('$30.000');
  });

  it('registers the payment with a version 7 id, the time of the visit and the chosen method', async () => {
    const result = setup();
    act(() => result.current.setAmount(25_000));
    act(() => result.current.setMethod('NEQUI'));
    await act(() => result.current.submit(submitEvent()));

    expect(create).toHaveBeenCalledWith('l1', {
      id: expect.stringMatching(/^[0-9a-f]{8}-[0-9a-f]{4}-7[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/),
      outcome: 'PAID',
      occurredAt: expect.stringMatching(/Z$/),
      payment: { amount: 25_000, method: 'NEQUI' },
    });
    expect(result.current.notice).toBe('Cobro registrado.');
    expect(refresh).toHaveBeenCalled();
  });

  it('asks for the amount when the client paid', async () => {
    const result = setup();
    act(() => result.current.setAmount(null));
    await act(() => result.current.submit(submitEvent()));

    expect(result.current.fieldErrors.amount).toBe('Escribe el monto recibido.');
    expect(create).not.toHaveBeenCalled();
  });

  it('asks for the promised date on a reschedule and sends no payment', async () => {
    const result = setup();
    act(() => result.current.chooseOutcome('RESCHEDULED'));
    await act(() => result.current.submit(submitEvent()));
    expect(result.current.fieldErrors.promisedDate).toBe('Elige la fecha en que prometió pagar.');

    act(() => result.current.setPromisedDate('2026-10-20'));
    await act(() => result.current.submit(submitEvent()));
    expect(create).toHaveBeenCalledWith('l1', expect.objectContaining({ outcome: 'RESCHEDULED', promisedDate: '2026-10-20' }));
    expect(create.mock.calls[0]?.[1]).not.toHaveProperty('payment');
  });

  it('registers a visit without payment when nobody was found or they refused', async () => {
    const result = setup();
    act(() => result.current.chooseOutcome('NOT_FOUND'));
    await act(() => result.current.submit(submitEvent()));

    const body = create.mock.calls[0]?.[1];
    expect(body).toMatchObject({ outcome: 'NOT_FOUND' });
    expect(body).not.toHaveProperty('payment');
    expect(body).not.toHaveProperty('promisedDate');
    expect(result.current.confirmation.title).toBe('¿Registrar la visita?');
  });

  it('keeps the same id when retrying after a failure and takes a new one after a success', async () => {
    const result = setup();
    create.mockRejectedValueOnce(api(503, 'MAINTENANCE'));
    await act(() => result.current.submit(submitEvent()));
    await act(() => result.current.submit(submitEvent()));
    expect(create.mock.calls[0]?.[1].id).toBe(create.mock.calls[1]?.[1].id);

    await act(() => result.current.submit(submitEvent()));
    expect(create.mock.calls[2]?.[1].id).not.toBe(create.mock.calls[1]?.[1].id);
  });

  it.each([
    ['FORBIDDEN', /no está asignado a ti hoy/],
    ['NOT_FOUND', /No encontramos el préstamo/],
    ['VALIDATION_FAILED', /no combinan/],
  ])('explains a %s error', async (code, message) => {
    create.mockRejectedValueOnce(api(400, code));
    const result = setup();
    await act(() => result.current.submit(submitEvent()));

    expect(result.current.formError).toMatch(message);
    expect(refresh).not.toHaveBeenCalled();
  });
});
