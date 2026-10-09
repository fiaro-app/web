import type { Metadata } from 'next';
import { AuthBrandPanel } from '@/components/organisms/AuthBrandPanel';
import { AuthNav } from '@/components/organisms/AuthNav';
import { AuthPreviewCard } from '@/components/organisms/AuthPreviewCard';
import { PasswordRecoveryForm } from '@/components/organisms/PasswordRecoveryForm';
import { AuthTemplate } from '@/components/templates/AuthTemplate';
import { AUTH_PREVIEW } from '@/content/auth';
import { RECOVERY_CONTENT } from '@/content/password';

export const metadata: Metadata = {
  title: 'Recuperar contraseña',
  description: 'Recupera el acceso a tu panel de Fiaro con un código.',
  // Pantalla de acceso: no aporta nada en los buscadores.
  robots: { index: false, follow: false },
};

/** Recuperar la contraseña (pantalla pública: se llega desde «¿Olvidaste tu contraseña?»). */
export default function PasswordRecoveryPage() {
  return (
    <AuthTemplate
      nav={<AuthNav {...RECOVERY_CONTENT.nav} />}
      panel={
        <AuthBrandPanel {...RECOVERY_CONTENT.panel}>
          <AuthPreviewCard {...AUTH_PREVIEW} />
        </AuthBrandPanel>
      }
    >
      <PasswordRecoveryForm />
    </AuthTemplate>
  );
}
