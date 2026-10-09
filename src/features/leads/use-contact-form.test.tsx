import { act, renderHook } from '@testing-library/react';
import type { ChangeEvent, FormEvent } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ApiRequestError } from '@/lib/api';
import { sendLead } from './leads-api';
import { useContactForm } from './use-contact-form';

vi.mock('./leads-api', () => ({ sendLead: vi.fn() }));
const send = vi.mocked(sendLead);

const typed = (value: string) => ({ target: { value } }) as ChangeEvent<HTMLInputElement>;
const submitEvent = () => ({ preventDefault: vi.fn() }) as unknown as FormEvent<HTMLFormElement>;

function fill(
  result: { current: ReturnType<typeof useContactForm> },
  values: Partial<Record<'name' | 'phone' | 'email' | 'message', string>>,
) {
  for (const [field, value] of Object.entries(values)) {
    act(() => result.current.setField(field as 'name')(typed(value)));
  }
}

beforeEach(() => {
  vi.clearAllMocks();
  send.mockResolvedValue({ received: true });
});

describe('useContactForm', () => {
  it('validates before calling the API and shows the error under the field', async () => {
    const { result } = renderHook(() => useContactForm());

    await act(() => result.current.submit(submitEvent()));

    expect(result.current.fieldErrors.name).toBe('Escribe tu nombre.');
    expect(send).not.toHaveBeenCalled();
  });

  it('asks for a phone or an email when neither is given', async () => {
    const { result } = renderHook(() => useContactForm());
    fill(result, { name: 'Ana', message: 'Quiero probar Fiaro con mis cobradores.' });

    await act(() => result.current.submit(submitEvent()));

    expect(result.current.fieldErrors.phone).toMatch(/celular o tu correo/);
    expect(send).not.toHaveBeenCalled();
  });

  it('sends only what was filled in and marks the message as sent', async () => {
    const { result } = renderHook(() => useContactForm());
    fill(result, { name: 'Ana', phone: '300 123 4567', message: 'Quiero probar Fiaro con mis cobradores.' });

    await act(() => result.current.submit(submitEvent()));

    expect(send).toHaveBeenCalledWith({ name: 'Ana', phone: '+573001234567', message: 'Quiero probar Fiaro con mis cobradores.' });
    expect(result.current.isSent).toBe(true);
    expect(result.current.isSubmitting).toBe(false);
  });

  it('tells the person to wait when the hourly limit is reached', async () => {
    send.mockRejectedValue(new ApiRequestError({ statusCode: 429, code: 'RATE_LIMITED', message: 'x', retryAfterSeconds: 1800 }));
    const { result } = renderHook(() => useContactForm());
    fill(result, { name: 'Ana', email: 'ana@ejemplo.co', message: 'Quiero probar Fiaro con mis cobradores.' });

    await act(() => result.current.submit(submitEvent()));

    expect(result.current.formError).toMatch(/30 minutos/);
    expect(result.current.isSent).toBe(false);
  });
});
