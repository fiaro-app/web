import type { ReactNode } from 'react';

export interface AuthTemplateProps {
  readonly nav: ReactNode;
  /** Mitad de marca; en pantallas angostas se oculta y queda solo el formulario. */
  readonly panel: ReactNode;
  /** El formulario, centrado en la otra mitad. */
  readonly children: ReactNode;
}

/** Esqueleto de Login y Registro: barra superior y pantalla dividida (marca | formulario). Sin datos. */
export function AuthTemplate({ nav, panel, children }: Readonly<AuthTemplateProps>) {
  return (
    <div className="flex min-h-dvh flex-col bg-surface">
      {nav}
      <div className="grid flex-1 lg:grid-cols-2">
        <aside className="hidden lg:block">{panel}</aside>
        <main id="contenido" tabIndex={-1} className="focus:outline-none flex items-center justify-center px-6 py-12">
          <div className="w-full max-w-95">{children}</div>
        </main>
      </div>
    </div>
  );
}
