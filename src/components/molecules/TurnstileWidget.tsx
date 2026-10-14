'use client';

import Script from 'next/script';
import { useCallback, useEffect, useRef } from 'react';

const TURNSTILE_SCRIPT = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
const SITE_KEY = process.env.NEXT_PUBLIC_CLOUDFLARE_TURNSTILE_SITE_KEY;

interface TurnstileOptions {
  readonly sitekey: string;
  readonly action: string;
  readonly callback: (token: string) => void;
  readonly 'expired-callback': () => void;
  readonly 'error-callback': () => void;
}

interface TurnstileApi {
  render(container: HTMLElement, options: TurnstileOptions): string;
  remove(widgetId: string): void;
}

declare global {
  // `var` es la única forma de tipar una global de `globalThis` (la que inyecta el script de Cloudflare).
  var turnstile: TurnstileApi | undefined;
}

export const turnstileEnabled = Boolean(SITE_KEY);

export interface TurnstileWidgetProps {
  /** Acción estable que el backend valida contra la respuesta de Siteverify. */
  readonly action: 'lead' | 'register' | 'password-reset';
  /** Fuerza un desafío nuevo después de un envío: los tokens son de un solo uso. */
  readonly resetKey: number;
  readonly onToken: (token: string | null) => void;
  readonly onError: () => void;
}

/** Widget de Cloudflare Turnstile para un formulario público. No renderiza nada sin site key. */
export function TurnstileWidget({ action, resetKey, onToken, onError }: Readonly<TurnstileWidgetProps>) {
  const container = useRef<HTMLDivElement>(null);
  const widgetId = useRef<string | null>(null);

  const render = useCallback(() => {
    if (!SITE_KEY || !container.current || !globalThis.turnstile || widgetId.current) return;
    widgetId.current = globalThis.turnstile.render(container.current, {
      sitekey: SITE_KEY,
      action,
      callback: (token) => onToken(token),
      'expired-callback': () => onToken(null),
      'error-callback': () => {
        onToken(null);
        onError();
      },
    });
  }, [action, onError, onToken]);

  useEffect(() => {
    render();
    return () => {
      if (widgetId.current && globalThis.turnstile) globalThis.turnstile.remove(widgetId.current);
      widgetId.current = null;
    };
  }, [render, resetKey]);

  if (!SITE_KEY) return null;

  return (
    <>
      <div ref={container} aria-label="Verificación de seguridad" />
      <Script id="cloudflare-turnstile" src={TURNSTILE_SCRIPT} strategy="afterInteractive" onReady={render} />
    </>
  );
}
