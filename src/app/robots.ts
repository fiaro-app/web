import type { MetadataRoute } from 'next';
import { SITE } from '@/lib/site';

/**
 * Qué pueden rastrear los buscadores: la portada y poco más. La API y el panel privado quedan
 * fuera (las pantallas de acceso se excluyen con `noindex` en su metadata, no aquí, para que el
 * buscador pueda leer esa instrucción).
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/', disallow: ['/api/', '/resumen'] },
    sitemap: `${SITE.url}/sitemap.xml`,
    host: SITE.url,
  };
}
