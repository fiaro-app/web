/** Datos del sitio que comparten los metadatos, el sitemap, el manifest y los datos estructurados. */

const DEFAULT_SITE_URL = 'http://localhost:3001';

/**
 * Origen público de la web (`https://fiaro.co`), sin barra final. Sale de `NEXT_PUBLIC_SITE_URL`;
 * en producción debe estar definido para que los enlaces canónicos, el sitemap y las imágenes
 * sociales apunten al dominio real.
 *
 * @throws Si el valor no es una URL válida.
 */
export function resolveSiteUrl(value: string | undefined = process.env.NEXT_PUBLIC_SITE_URL): string {
  // Vacío cuenta como «sin configurar» (p. ej. `NEXT_PUBLIC_SITE_URL=` en el .env).
  return new URL(value === undefined || value === '' ? DEFAULT_SITE_URL : value).origin;
}

export const SITE = {
  name: 'Fiaro',
  /** Título de la portada y de las redes sociales. */
  title: 'Fiaro — Control de cartera para prestamistas',
  description:
    'Fiaro le da a cada prestamista visibilidad sobre su cartera: mora en tiempo real, efectividad por cobrador y el cuadre del día, sin depender de un cuaderno ni de una hoja de Excel.',
  locale: 'es_CO',
  language: 'es',
  /** Color de marca (anil): barra del navegador y del manifest. */
  themeColor: '#3b3382',
  backgroundColor: '#f6f5fb',
  get url() {
    return resolveSiteUrl();
  },
} as const;
