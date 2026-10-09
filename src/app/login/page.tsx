import type { Metadata } from 'next';
import { AuthBrandPanel } from '@/components/organisms/AuthBrandPanel';
import { AuthNav } from '@/components/organisms/AuthNav';
import { AuthPreviewCard } from '@/components/organisms/AuthPreviewCard';
import { LoginForm } from '@/components/organisms/LoginForm';
import { AuthTemplate } from '@/components/templates/AuthTemplate';
import { AUTH_PREVIEW, LOGIN_CONTENT } from '@/content/auth';
import { DEFAULT_AUTHENTICATED_PATH, sanitizeNextPath } from '@/features/auth/route-guard';

export const metadata: Metadata = {
  title: 'Iniciar sesión',
  description: 'Ingresa a tu panel de Fiaro para ver tu cartera, la mora y el cuadre del día.',
  // Pantalla de acceso: no aporta nada en los buscadores.
  robots: { index: false, follow: false },
};

/** Inicio de sesión (`Screen / Web / Login`). */
export default async function LoginPage({ searchParams }: PageProps<'/login'>) {
  const { next } = await searchParams;
  const redirectTo = sanitizeNextPath(typeof next === 'string' ? next : null) ?? DEFAULT_AUTHENTICATED_PATH;

  return (
    <AuthTemplate
      nav={<AuthNav {...LOGIN_CONTENT.nav} />}
      panel={
        <AuthBrandPanel {...LOGIN_CONTENT.panel}>
          <AuthPreviewCard {...AUTH_PREVIEW} />
        </AuthBrandPanel>
      }
    >
      <LoginForm redirectTo={redirectTo} forgotPasswordHref={LOGIN_CONTENT.forgotPasswordHref} />
    </AuthTemplate>
  );
}
