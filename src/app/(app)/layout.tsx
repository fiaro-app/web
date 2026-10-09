import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { SignOutButton } from '@/components/molecules/SignOutButton';
import { TopBar } from '@/components/organisms/TopBar';
import { PRIVATE_NAV_ITEMS } from '@/content/app-nav';
import { requireUser } from '@/features/auth/session.server';

// Todo el panel es privado: nada de esto debe indexarse.
export const metadata: Metadata = { robots: { index: false, follow: false } };

/**
 * Esqueleto del panel privado. Valida la sesión **en el servidor** (el `proxy` solo mira la
 * cookie): sin sesión válida manda a iniciar sesión antes de pintar nada.
 */
export default async function AppLayout({ children }: Readonly<{ children: ReactNode }>) {
  const user = await requireUser();

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <TopBar navItems={PRIVATE_NAV_ITEMS} userName={user.name} actions={<SignOutButton />} />
      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-6 py-10 lg:px-8">{children}</main>
    </div>
  );
}
