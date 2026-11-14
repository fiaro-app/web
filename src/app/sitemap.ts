import { LEGAL_DOCUMENTS } from '@/content/legal';
import type { MetadataRoute } from 'next';
import { SITE } from '@/lib/site';

/** Solo las páginas públicas e indexables del sitio. */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: SITE.url, lastModified: now, changeFrequency: 'weekly', priority: 1 },
    { url: `${SITE.url}/contacto`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${SITE.url}/registro`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${SITE.url}/login`, lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    ...LEGAL_DOCUMENTS.map((document) => ({
      url: `${SITE.url}${document.path}`,
      lastModified: now,
      changeFrequency: 'yearly' as const,
      priority: 0.3,
    })),
  ];
}
