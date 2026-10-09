import type { MetadataRoute } from 'next';
import { SITE } from '@/lib/site';

/** Solo las páginas públicas e indexables; las de acceso y el panel no entran. */
export default function sitemap(): MetadataRoute.Sitemap {
  return [{ url: SITE.url, changeFrequency: 'monthly', priority: 1 }];
}
