'use client';

import { AuthBrandPanel } from '@/components/organisms/AuthBrandPanel';
import { AuthNav } from '@/components/organisms/AuthNav';
import { AuthPreviewCard } from '@/components/organisms/AuthPreviewCard';
import { RegisterForm } from '@/components/organisms/RegisterForm';
import { AuthTemplate } from '@/components/templates/AuthTemplate';
import { AUTH_PREVIEW } from '@/content/auth';
import { REGISTER_NAV, REGISTER_STEP_CONTENT } from '@/content/register';
import { useRegisterForm } from '@/features/auth/use-register-form';

/**
 * Pantalla de registro: une la lógica (`useRegisterForm`) con la plantilla de acceso. Es el único
 * lugar que conoce las dos cosas; el panel de marca cambia según el paso.
 */
export function RegisterScreen({ redirectTo }: Readonly<{ redirectTo: string }>) {
  const form = useRegisterForm({ redirectTo });

  return (
    <AuthTemplate
      nav={<AuthNav {...REGISTER_NAV} />}
      panel={
        <AuthBrandPanel {...REGISTER_STEP_CONTENT[form.step].panel}>
          <AuthPreviewCard {...AUTH_PREVIEW} />
        </AuthBrandPanel>
      }
    >
      <RegisterForm form={form} />
    </AuthTemplate>
  );
}
