import type { NextConfig } from 'next';

/**
 * Origen de la API. Las llamadas del navegador van a `/api/*` de esta misma web y Next las
 * reenvía allí: la cookie de sesión queda como cookie de primera parte (sin CORS ni cookies de
 * terceros) y `proxy.ts` puede leerla. El origen de la web debe estar en `CORS_ORIGINS` de la API
 * (better-auth comprueba la cabecera `Origin`).
 */
const API_URL = new URL(process.env.API_URL ?? 'http://localhost:3000').origin;

const nextConfig: NextConfig = {
  async rewrites() {
    return [{ source: '/api/:path*', destination: `${API_URL}/:path*` }];
  },
};

export default nextConfig;
