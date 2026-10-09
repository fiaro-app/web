import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { SignOutButton } from '@/components/molecules/SignOutButton';
import { AuthBrandPanel } from '@/components/organisms/AuthBrandPanel';
import { AuthNav } from '@/components/organisms/AuthNav';
import { AuthPreviewCard } from '@/components/organisms/AuthPreviewCard';
import { ChangePasswordForm } from '@/components/organisms/ChangePasswordForm';
import { AuthTemplate } from '@/components/templates/AuthTemplate';
import { AUTH_PREVIEW } from '@/content/auth';
import { CHANGE_PASSWORD_CONTENT } from '@/content/password';
import { DEFAULT_AUTHENTICATED_PATH } from '@/features/auth/route-guard';
import { requireUser } from '@/features/auth/session.server';

export const metadata: Metadata = {
  title: 'Cambiar contraseña',
  robots: { index: false, follow: false },
};

/**
 * Cambio obligatorio de la contraseña temporal. Solo es para quien entró con una: si la persona
 * ya la cambió, no hay nada que hacer aquí y se le manda a su panel.
 */
export default async function ChangePasswordPage() {
  const user = await requireUser();
  if (!user.mustChangePassword) redirect(DEFAULT_AUTHENTICATED_PATH);

  return (
    <AuthTemplate
      nav={<AuthNav end={<SignOutButton />} />}
      panel={
        <AuthBrandPanel {...CHANGE_PASSWORD_CONTENT.panel}>
          <AuthPreviewCard {...AUTH_PREVIEW} />
        </AuthBrandPanel>
      }
    >
      <ChangePasswordForm redirectTo={DEFAULT_AUTHENTICATED_PATH} />
    </AuthTemplate>
  );
}
