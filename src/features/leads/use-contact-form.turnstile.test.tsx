import { act, renderHook } from '@testing-library/react';
import type { ChangeEvent, FormEvent } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { sendLead } from './leads-api';
import { useContactForm } from './use-contact-form';

vi.mock('@/components/molecules/TurnstileWidget', () => ({ turnstileEnabled: true }));
vi.mock('./leads-api', () => ({ sendLead: vi.fn() }));
const send = vi.mocked(sendLead);

const typed = (value: string) => ({ target: { value } }) as ChangeEvent<HTMLInputElement>;
const submitEvent = () =>
  ({ preventDefault: vi.fn(), currentTarget: document.createElement('form') }) as unknown as FormEvent<HTMLFormElement>;

function setup() {
  const { result } = renderHook(() => useContactForm());
  act(() => result.current.setField('name')(typed('Ana Pérez')));
  act(() => result.current.setField('phone')(typed('300 123 4567')));
  act(() => result.current.setField('message')(typed('Tengo 3 cobradores y quiero probar.')));
  return result;
}

beforeEach(() => {
  vi.clearAllMocks();
  send.mockResolvedValue({ received: true });
});

describe('useContactForm with Turnstile on', () => {
  it('asks to finish the bot check before sending', async () => {
    const result = setup();

    await act(() => result.current.submit(submitEvent()));

    expect(result.current.formError).toBe('Completa la verificación de seguridad para continuar.');
    expect(send).not.toHaveBeenCalled();
  });

  it('sends the token and asks for a new challenge afterwards', async () => {
    const result = setup();
    act(() => result.current.setTurnstileToken('tok'));
    const before = result.current.turnstileResetKey;

    await act(() => result.current.submit(submitEvent()));

    expect(send).toHaveBeenCalledWith(expect.objectContaining({ turnstileToken: 'tok' }));
    expect(result.current.turnstileResetKey).toBe(before + 1);
  });

  it('explains when the widget fails to load', () => {
    const result = setup();

    act(() => result.current.turnstileError());

    expect(result.current.formError).toMatch(/verificación de seguridad/);
  });
});
