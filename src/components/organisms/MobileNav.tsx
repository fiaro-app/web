'use client';

import type { ReactNode } from 'react';
import { IconButton } from '@/components/atoms/IconButton';
import { useMobileMenu } from '@/features/app-shell/use-mobile-menu';

export interface MobileNavProps {
  /** La barra lateral completa: va dentro del menú deslizable. */
  readonly children: ReactNode;
  readonly brandName?: string;
}

const MENU_ID = 'menu-principal';

/**
 * Cabecera y menú deslizable del panel en pantallas angostas (`Mobile / Menú`): marca y botón de
 * menú arriba; la barra lateral se abre desde la izquierda sobre una cortina. En escritorio no se
 * ve (`lg:hidden`) y la barra lateral va fija.
 */
export function MobileNav({ children, brandName = 'Fiaro' }: Readonly<MobileNavProps>) {
  const { isOpen, open, close } = useMobileMenu();

  return (
    <div className="lg:hidden">
      <header className="flex h-16 items-center justify-between border-b border-foreground/8 bg-surface px-5">
        <span className="font-display text-[22px] font-bold text-primary">{brandName}</span>
        <IconButton
          label="Abrir menú"
          aria-expanded={isOpen}
          aria-controls={MENU_ID}
          onClick={open}
          icon={<span aria-hidden="true" className="text-2xl leading-none">☰</span>}
          className="border-0"
        />
      </header>

      {isOpen && (
        <div className="fixed inset-0 z-40 flex" role="dialog" aria-modal="true" aria-label="Menú principal" id={MENU_ID}>
          <div className="flex h-full max-w-[85vw] flex-col overflow-y-auto bg-surface">
            <div className="flex justify-end px-3 pt-3">
              <IconButton label="Cerrar menú" onClick={close} icon={<span aria-hidden="true">✕</span>} className="border-0" />
            </div>
            {children}
          </div>
          <button type="button" aria-label="Cerrar menú" tabIndex={-1} onClick={close} className="flex-1 bg-foreground/50" />
        </div>
      )}
    </div>
  );
}
