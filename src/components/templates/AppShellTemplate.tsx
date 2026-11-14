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
 * lateral dentro de un menú deslizable. En un listado (`StickyToolbar`), desde `md` mide justo la pantalla:
 * la tabla se encoge y la paginación queda a la vista. Sin datos.
 */
export function AppShellTemplate({ sidebar, banner, children }: Readonly<AppShellTemplateProps>) {
  return (
    <div className="flex min-h-dvh flex-col bg-background md:has-[[data-list-toolbar]]:h-dvh lg:flex-row">
      {/* Fija a la altura de la pantalla: la barra lateral siempre queda visible aunque la página haga scroll. */}
      <div className="hidden lg:sticky lg:top-0 lg:flex lg:h-screen lg:self-start">{sidebar}</div>
      <MobileNav>{sidebar}</MobileNav>
      <main id="contenido" tabIndex={-1} className="focus:outline-none flex min-w-0 flex-1 flex-col gap-7 p-5 sm:p-8">
        {banner}
        {children}
      </main>
    </div>
  );
}
