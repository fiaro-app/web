import { LANDING_ROUTES } from '@/content/landing';

/** Texto de las pantallas de acceso (Login y Registro): vive aquí para que los componentes no lo contengan. */
export const AUTH_PREVIEW = {
  kpis: [
    { label: 'Cartera', value: '$18.4M' },
    { label: 'Cobrado', value: '$3.2M', valueClassName: 'text-success' },
    { label: 'Mora', value: '18%', valueClassName: 'text-destructive' },
  ],
  activity: 'Alejo Zuleta cerró su ruta',
} as const;

export const LOGIN_CONTENT = {
  nav: { prompt: '¿No tienes cuenta?', linkLabel: 'Regístrate gratis', linkHref: LANDING_ROUTES.signup },
  panel: {
    eyebrow: 'Bienvenido de nuevo',
    title: 'Tu cartera, siempre bajo control',
    description:
      'Inicia sesión para ver la mora, el cuadre del día y la efectividad de tus cobradores en tiempo real.',
  },
  forgotPasswordHref: '/recuperar-contrasena',
} as const;
