import { LANDING_ROUTES } from '@/content/landing';
import type { RegisterStep } from '@/features/auth/register-schemas';

/** Texto del registro: vive aquí para que los componentes no lo contengan. */
export const REGISTER_NAV = {
  prompt: '¿Ya tienes cuenta?',
  linkLabel: 'Inicia sesión',
  linkHref: LANDING_ROUTES.login,
} as const;

export const REGISTER_STEP_LABELS = ['Cuenta', 'Empresa'] as const;

/** Mensaje del panel de marca y título del formulario de cada paso. */
export const REGISTER_STEP_CONTENT: Record<
  RegisterStep,
  {
    readonly panel: { readonly eyebrow: string; readonly title: string; readonly description: string };
    readonly title: string;
    readonly subtitle: string;
    readonly submitLabel: string;
  }
> = {
  account: {
    panel: {
      eyebrow: 'Paso 1 de 2',
      title: 'Crea tu cuenta en Fiaro',
      description:
        'Esto crea tu acceso de administrador — desde aquí gestionarás tu financiera, tus cobradores y tus clientes.',
    },
    title: 'Tus datos personales',
    subtitle: 'Empecemos por conocerte.',
    submitLabel: 'Continuar',
  },
  company: {
    panel: {
      eyebrow: 'Paso 2 de 2',
      title: 'Registra tu financiera',
      description:
        'Así identificarás tu negocio dentro de Fiaro — el nombre que verán tus cobradores y clientes.',
    },
    title: 'Datos de tu financiera',
    subtitle: 'El logo y el resto de datos los editas después desde Configuración.',
    submitLabel: 'Crear cuenta',
  },
};
