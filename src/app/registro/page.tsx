import type { Metadata } from 'next';
import { RegisterScreen } from '@/components/organisms/RegisterScreen';
import { DEFAULT_AUTHENTICATED_PATH } from '@/features/auth/route-guard';

export const metadata: Metadata = {
  title: 'Crear cuenta',
  description: 'Crea tu cuenta en Fiaro y registra tu financiera en minutos.',
  robots: { index: true, follow: true },
  alternates: { canonical: '/registro' },
  openGraph: {
    title: 'Crear cuenta · Fiaro',
    description: 'Crea tu cuenta en Fiaro y registra tu financiera en minutos.',
    url: '/registro',
  },
};

/** Registro de un dueño y su financiera (`Screen / Web / Registro`). */
export default function RegisterPage() {
  return <RegisterScreen redirectTo={DEFAULT_AUTHENTICATED_PATH} />;
}
