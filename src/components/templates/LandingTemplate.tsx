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
    <div className="flex min-h-full flex-col bg-surface">
      {nav}
      <main className="flex flex-1 flex-col">{children}</main>
      {footer}
    </div>
  );
}
