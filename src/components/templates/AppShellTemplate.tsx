import type { ReactNode } from 'react';
import { MobileNav } from '@/components/organisms/MobileNav';

export interface AppShellTemplateProps {
  readonly sidebar: ReactNode;
  readonly children: ReactNode;
}

/**
 * Esqueleto del panel privado. En escritorio (`lg`): barra lateral fija a la izquierda y el
 * contenido a la derecha. En pantallas angostas: cabecera con botón de menú y la misma barra
 * lateral dentro de un menú deslizable. Sin datos.
 */
export function AppShellTemplate({ sidebar, children }: Readonly<AppShellTemplateProps>) {
  return (
    <div className="flex min-h-screen flex-col bg-background lg:flex-row">
      <div className="hidden lg:flex">{sidebar}</div>
      <MobileNav>{sidebar}</MobileNav>
      <main className="flex min-w-0 flex-1 flex-col gap-7 p-5 sm:p-8">{children}</main>
    </div>
  );
}
