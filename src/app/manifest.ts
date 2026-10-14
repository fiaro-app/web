import type { MetadataRoute } from 'next';
import { SITE } from '@/lib/site';

/** Manifest de la web (instalable y con los colores de marca en el navegador móvil). */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SITE.title,
    short_name: SITE.name,
    description: SITE.description,
    lang: SITE.language,
    start_url: '/',
    display: 'standalone',
    theme_color: SITE.themeColor,
    background_color: SITE.backgroundColor,
    icons: [{ src: '/icon', sizes: '512x512', type: 'image/png', purpose: 'any' }],
  };
}
