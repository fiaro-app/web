/**
 * Cookie de sesión de la API (better-auth, prefijo `fiaro`). Con HTTPS el navegador la guarda con
 * el prefijo `__Secure-`, por eso se aceptan los dos nombres. La web solo comprueba que exista
 * (chequeo optimista en `proxy.ts`); quién tiene sesión de verdad lo decide siempre la API.
 */
export const SESSION_COOKIE_NAMES = ['fiaro.session_token', '__Secure-fiaro.session_token'] as const;
