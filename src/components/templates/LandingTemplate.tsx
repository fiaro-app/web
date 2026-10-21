import type { ReactNode } from 'react';

export interface LandingTemplateProps {
  readonly nav: ReactNode;
  readonly footer: ReactNode;
  /** Las secciones, en el orden en que se apilan. */
  readonly children: ReactNode;
}

/** El esqueleto de la landing: barra superior, secciones apiladas en `<main>` y pie. Sin datos. */
export function LandingTemplate({ nav, footer, children }: Readonly<LandingTemplateProps>) {
  return (
    <div className="flex min-h-full flex-col bg-background">
      {/* Fija arriba: el menú sigue a la vista al bajar por la página. */}
      <div className="sticky top-0 z-40">{nav}</div>
      <main id="contenido" tabIndex={-1} className="focus:outline-none flex flex-1 flex-col">{children}</main>
      {footer}
    </div>
  );
}
