import type { Metadata } from 'next';
import { RegisterScreen } from '@/components/organisms/RegisterScreen';
import { DEFAULT_AUTHENTICATED_PATH } from '@/features/auth/route-guard';

export const metadata: Metadata = {
  title: 'Crear cuenta',
  description: 'Crea tu cuenta en Fiaro y registra tu financiera en minutos.',
  // El formulario no aporta nada en buscadores; la puerta de entrada pública es la landing.
  robots: { index: false, follow: false },
};

/** Registro de un dueño y su financiera (`Screen / Web / Registro`). */
export default function RegisterPage() {
  return <RegisterScreen redirectTo={DEFAULT_AUTHENTICATED_PATH} />;
}
