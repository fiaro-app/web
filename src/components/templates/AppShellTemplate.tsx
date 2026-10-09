import type { ReactNode } from 'react';
import { MobileNav } from '@/components/organisms/MobileNav';

export interface AppShellTemplateProps {
  readonly sidebar: ReactNode;
  /** Aviso opcional arriba del contenido (p. ej. el plan por vencer). */
  readonly banner?: ReactNode;
  readonly children: ReactNode;
}

/**
 * Esqueleto del panel privado. En escritorio (`lg`): barra lateral fija a la izquierda y el
 * contenido a la derecha. En pantallas angostas: cabecera con botón de menú y la misma barra
 * lateral dentro de un menú deslizable. Sin datos.
 */
export function AppShellTemplate({ sidebar, banner, children }: Readonly<AppShellTemplateProps>) {
  return (
    <div className="flex min-h-screen flex-col bg-background lg:flex-row">
      <div className="hidden lg:flex">{sidebar}</div>
      <MobileNav>{sidebar}</MobileNav>
      <main id="contenido" tabIndex={-1} className="focus:outline-none flex min-w-0 flex-1 flex-col gap-7 p-5 sm:p-8">
        {banner}
        {children}
      </main>
    </div>
  );
}
