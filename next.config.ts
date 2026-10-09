import type { NextConfig } from 'next';
import { resolveApiUrl } from './src/lib/api-url';
import { NO_STORE_HEADER, NO_STORE_SOURCES, buildSecurityHeaders, parseStorageOrigin } from './src/lib/security-headers';

/**
 * Origen de la API. Las llamadas del navegador van a `/api/*` de esta misma web y Next las
 * reenvía allí: la cookie de sesión queda como cookie de primera parte (sin CORS ni cookies de
 * terceros) y `proxy.ts` puede leerla. El origen de la web debe estar en `CORS_ORIGINS` de la API
 * (better-auth comprueba la cabecera `Origin`).
 */
const API_URL = resolveApiUrl();

const securityHeaders = buildSecurityHeaders({
  isDevelopment: process.env.NODE_ENV !== 'production',
  storageOrigin: parseStorageOrigin(process.env.STORAGE_ORIGIN),
});

const nextConfig: NextConfig = {
  // No anunciar la tecnología del servidor.
  poweredByHeader: false,
  async rewrites() {
    return [{ source: '/api/:path*', destination: `${API_URL}/:path*` }];
  },
  async headers() {
    return [
      { source: '/:path*', headers: [...securityHeaders] },
      ...NO_STORE_SOURCES.map((source) => ({ source, headers: [NO_STORE_HEADER] })),
    ];
  },
};

export default nextConfig;
