import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { SignOutButton } from '@/components/molecules/SignOutButton';
import { AuthBrandPanel } from '@/components/organisms/AuthBrandPanel';
import { AuthNav } from '@/components/organisms/AuthNav';
import { AuthPreviewCard } from '@/components/organisms/AuthPreviewCard';
import { ContactEmailGate } from '@/components/organisms/ContactEmailGate';
import { AuthTemplate } from '@/components/templates/AuthTemplate';
import { AUTH_PREVIEW } from '@/content/auth';
import { VERIFY_EMAIL_CONTENT } from '@/content/verify-email';
import { DEFAULT_AUTHENTICATED_PATH } from '@/features/auth/route-guard';
import { requireUser } from '@/features/auth/session.server';

export const metadata: Metadata = {
  title: 'Verificar correo',
  robots: { index: false, follow: false },
};

/**
 * Agregar y verificar el correo de contacto, obligatorio para la dueña. Con el correo ya
 * verificado no hay nada que hacer aquí y se le manda a su panel.
 */
export default async function VerifyEmailPage() {
  const user = await requireUser();
  if (user.contactEmailVerified === true) redirect(DEFAULT_AUTHENTICATED_PATH);

  return (
    <AuthTemplate
      nav={<AuthNav end={<SignOutButton />} />}
      panel={
        <AuthBrandPanel {...VERIFY_EMAIL_CONTENT.panel}>
          <AuthPreviewCard {...AUTH_PREVIEW} />
        </AuthBrandPanel>
      }
    >
      <ContactEmailGate fullName={user.name} phoneNumber={user.phoneNumber} contactEmail={user.contactEmail} />
    </AuthTemplate>
  );
}
