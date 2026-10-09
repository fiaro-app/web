import type { ReactNode } from 'react';

export interface AppShellTemplateProps {
  readonly sidebar: ReactNode;
  readonly children: ReactNode;
}

/** Esqueleto del panel privado: barra lateral fija a la izquierda y el contenido a la derecha. Sin datos. */
export function AppShellTemplate({ sidebar, children }: Readonly<AppShellTemplateProps>) {
  return (
    <div className="flex min-h-screen bg-background">
      {sidebar}
      <main className="flex min-w-0 flex-1 flex-col gap-7 p-8">{children}</main>
    </div>
  );
}
