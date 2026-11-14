import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import type { ReactNode } from 'react';
import { SubscriptionBanner } from '@/components/molecules/SubscriptionBanner';
import { OnboardingTutorial } from '@/components/organisms/OnboardingTutorial';
import { AppSidebar } from '@/components/organisms/AppSidebar';
import { AppShellTemplate } from '@/components/templates/AppShellTemplate';
import { visibleNavItems } from '@/content/app-nav';
import { COLLECTOR_LABEL } from '@/features/app-shell/role-label';
import { brandThemeStyle } from '@/features/app-shell/brand-theme';
import { getShellContext } from '@/features/app-shell/get-shell-context.server';
import { CHANGE_PASSWORD_PATH } from '@/features/auth/route-guard';
import { requireUser } from '@/features/auth/session.server';
import { getSubscription } from '@/features/subscription/get-subscription.server';

// Todo el panel es privado: nada de esto debe indexarse.
export const metadata: Metadata = { robots: { index: false, follow: false } };

/**
 * Esqueleto del panel privado. Valida la sesión **en el servidor** (el `proxy` solo mira la
 * cookie): sin sesión válida manda a iniciar sesión antes de pintar nada, y con una contraseña
 * temporal manda a cambiarla.
 */
export default async function AppLayout({ children }: Readonly<{ children: ReactNode }>) {
  const user = await requireUser();
  // Quien entró con una contraseña temporal debe cambiarla antes de usar el panel (la API también lo exige).
  if (user.mustChangePassword) redirect(CHANGE_PASSWORD_PATH);
  const [{ businessName, brandColor, roleLabel, unreadNotifications }, subscription] = await Promise.all([
    getShellContext(),
    getSubscription(),
  ]);

  return (
    // `contents`: el contenedor solo lleva las variables de color de marca, sin alterar el diseño.
    <div className="contents" style={brandThemeStyle(brandColor)}>
      <AppShellTemplate
        banner={subscription?.notice ? <SubscriptionBanner notice={subscription.notice} /> : undefined}
        sidebar={
          <AppSidebar businessName={businessName} userName={user.name} roleLabel={roleLabel} unreadNotifications={unreadNotifications} />
        }
      >
        {children}
      </AppShellTemplate>
      <OnboardingTutorial userId={user.id} navHrefs={visibleNavItems(roleLabel === COLLECTOR_LABEL).filter((item) => item.available).map((item) => item.href)} />
    </div>
  );
}
