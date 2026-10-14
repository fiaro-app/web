import { render } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('next/script', () => ({ default: () => null }));

const turnstile = { render: vi.fn(() => 'widget-1'), remove: vi.fn() };

async function loadWidget(siteKey: string) {
  vi.resetModules();
  vi.stubEnv('NEXT_PUBLIC_CLOUDFLARE_TURNSTILE_SITE_KEY', siteKey);
  return import('./TurnstileWidget');
}

beforeEach(() => {
  vi.clearAllMocks();
  window.turnstile = turnstile;
});

afterEach(() => {
  vi.unstubAllEnvs();
  delete window.turnstile;
});

describe('TurnstileWidget', () => {
  it('renders nothing and is disabled without a site key', async () => {
    const { TurnstileWidget, turnstileEnabled } = await loadWidget('');
    const { container } = render(<TurnstileWidget action="lead" resetKey={0} onToken={vi.fn()} onError={vi.fn()} />);

    expect(turnstileEnabled).toBe(false);
    expect(container).toBeEmptyDOMElement();
    expect(turnstile.render).not.toHaveBeenCalled();
  });

  it('draws the widget with the site key and action, and reports tokens and errors', async () => {
    const { TurnstileWidget } = await loadWidget('1x00000000000000000000AA');
    const onToken = vi.fn();
    const onError = vi.fn();
    render(<TurnstileWidget action="register" resetKey={0} onToken={onToken} onError={onError} />);

    expect(turnstile.render).toHaveBeenCalledOnce();
    const [, options] = turnstile.render.mock.calls[0] as unknown as [HTMLElement, Record<string, (value?: string) => void>];
    expect(options).toMatchObject({ sitekey: '1x00000000000000000000AA', action: 'register' });

    options.callback!('tok');
    options['expired-callback']!();
    options['error-callback']!();
    expect(onToken.mock.calls).toEqual([['tok'], [null], [null]]);
    expect(onError).toHaveBeenCalledOnce();
  });

  it('asks for a new challenge when resetKey changes and cleans up on unmount', async () => {
    const { TurnstileWidget } = await loadWidget('1x00000000000000000000AA');
    const props = { action: 'lead' as const, onToken: vi.fn(), onError: vi.fn() };
    const { rerender, unmount } = render(<TurnstileWidget {...props} resetKey={0} />);

    rerender(<TurnstileWidget {...props} resetKey={1} />);
    expect(turnstile.remove).toHaveBeenCalledWith('widget-1');
    expect(turnstile.render).toHaveBeenCalledTimes(2);

    unmount();
    expect(turnstile.remove).toHaveBeenCalledTimes(2);
  });
});
