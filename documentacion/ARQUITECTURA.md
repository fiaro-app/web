# Arquitectura de la web

Panel web de Fiaro (Next.js 16, App Router, Tailwind 4). Este documento explica **cómo está
organizado el código y por qué**, para que cualquiera pueda añadir un módulo sin romper las reglas.

## 1. Principios

1. **Lógica y diseño separados.** Un componente solo pinta; lo que decide, valida o llama a la API
   vive en un hook o en una función pura. Así la lógica se prueba sin navegador y el diseño cambia
   sin tocar la lógica.
2. **Archivos pequeños.** Un archivo hace una cosa. Si crece (≈150 líneas) se parte.
3. **El texto no vive en los componentes.** Los textos de pantalla están en `src/content/`.
4. **La API manda.** Si el diseño y la API no coinciden, se sigue a la API y se corrige el mockup.
5. **Los contratos se importan, no se copian.** Schemas, tipos y mensajes salen de
   `@fiaro-app/contracts`; lo que aún no está allí se declara con sus mismos primitivos y queda
   documentado para migrarlo.
6. **Solo Tailwind.** Sin `style` inline ni CSS suelto; los colores, radios y tipografías son los
   tokens de `globals.css` (`@theme inline`).

## 2. Mapa de carpetas

```
src/
  app/                  Rutas. Páginas finas: metadata + composición. Nada de lógica.
    (app)/              Panel privado: el layout exige sesión en el servidor.
    login/ registro/    Pantallas de acceso.
    robots.ts sitemap.ts manifest.ts icon.tsx opengraph-image.tsx not-found.tsx   SEO
    design-system/      Catálogo de componentes (solo desarrollo; 404 en producción).
  components/           Solo presentación (Atomic Design).
    atoms/ molecules/ organisms/ templates/
  features/<módulo>/    Lógica de un módulo: endpoints, schemas, hooks (use-*), mensajes de error.
  content/              Textos y datos estáticos de pantalla, tipados.
  lib/                  Utilidades puras y transversales: cliente de la API, formularios, SEO, seguridad…
  stores/               Estado global (Zustand): tema del Lender.
  proxy.ts              Chequeo optimista de sesión antes de servir una página.
```

Regla de dependencia (de afuera hacia adentro, nunca al revés):

```
app → components → (features, content, lib)
                    features → lib
```

`lib` no importa de `features` ni de `components`. Los componentes **no** hablan con la API: lo hacen
los hooks de `features`.

## 3. Comunicación con la API

```
Navegador ──/api/*──▶ Next (rewrites) ──▶ API de Fiaro
```

- `next.config.ts` reenvía `/api/*` al origen de `API_URL`. El navegador solo habla con el origen
  de la web: la cookie de sesión es de primera parte (sin CORS ni cookies de terceros) y
  `proxy.ts` puede leerla. El origen de la web debe estar en `CORS_ORIGINS` de la API (better-auth
  comprueba `Origin`).
- `callEndpoint` (`src/lib/api`) es **el único punto** de llamada. Recibe un endpoint declarado con
  `defineEndpoint` (de contracts), arma la ruta, manda `Accept-Language` y `API-Version`, valida la
  respuesta con el schema del contrato y convierte cualquier fallo en `ApiRequestError` con
  `code`, `issues` y `retryAfterSeconds`. La interfaz reacciona al **código**, nunca al texto.
- Los componentes de servidor llaman con `baseUrl` absoluto y reenvían la cookie (`headers`).

## 4. Autenticación

- Login por **celular + contraseña** (decisión D-07 de la API). La sesión es una cookie
  (`fiaro.session_token`, `__Secure-` en HTTPS) que pone la API.
- **Dos capas de comprobación**:
  1. `proxy.ts` + `route-guard.ts`: optimista, solo mira que la cookie exista. Protegido por
     defecto: solo las rutas de la lista pública se abren sin sesión. `?next=` solo acepta rutas
     internas (sin redirección abierta).
  2. `getCurrentUser` / `requireUser` (`session.server.ts`): **autoritativa**, reenvía la cookie a la
     API. Se memoiza por petición. Una falla de la API no se confunde con "sin sesión".
- Registro (`POST /register`) no abre sesión: tras crear la cuenta se inicia sesión con las mismas
  credenciales; si eso falla, se manda a `/login`.

## 5. Formularios

Cada formulario son tres piezas:

| Pieza | Dónde | Responsabilidad |
|---|---|---|
| Schema | `features/<módulo>/*-schemas.ts` | Reglas con los primitivos del contrato y mensajes en español |
| Hook | `features/<módulo>/use-*-form.ts` | Valores, validación, llamada a la API, errores, redirección |
| Vista | `components/organisms/*Form.tsx` | Pinta lo que devuelve el hook |

Los errores de la API se traducen en `error-messages.ts` (por código) y `issueFieldErrors` (los
`issues` de `VALIDATION_FAILED` se muestran en su campo). La API siempre valida de nuevo: la
validación de la web es para responder rápido, no para confiar.

## 6. SEO

- `SITE` (`lib/site.ts`) centraliza nombre, idioma, colores y la URL pública
  (`NEXT_PUBLIC_SITE_URL`). El layout define `metadataBase`, plantilla de título, Open Graph y Twitter.
- `robots`, `sitemap` y `manifest` salen de `app/`. Solo las páginas públicas entran al sitemap.
- Las pantallas de acceso y el panel llevan `noindex`; el 404 también.
- La landing publica datos estructurados (JSON-LD `Organization` y `SoftwareApplication` con los
  planes con precio), serializados para que un texto no pueda cerrar la etiqueta `<script>`.
- Una sola `h1` por página, secciones etiquetadas y anclas (`#producto`, `#precios`…).

## 7. Seguridad

- Cabeceras en `lib/security-headers.ts` (aplicadas por `next.config.ts`): CSP (sin `eval` en
  producción, `connect-src 'self'`, `frame-ancestors 'none'`), HSTS, `nosniff`, `X-Frame-Options`,
  `Referrer-Policy`, `COOP` y `Permissions-Policy`. La CSP no usa nonce a propósito (mantiene
  estáticas las páginas públicas).
- Rutas con datos personales: `Cache-Control: private, no-store`.
- Sin secretos en el repo: solo `.env.example`. Nada sensible va en variables `NEXT_PUBLIC_*`.
- Entradas externas siempre validadas: respuestas de la API (schema del contrato), `next` (solo
  rutas internas), JSON-LD (escapado).
- Dependencias: Dependabot vigila las acciones de GitHub; las de npm se actualizan a mano (el paquete privado `contracts` exige un token; ver `DECISIONES.md`).

## 8. Pruebas y calidad

- Vitest + Testing Library. Cada hook, función pura y componente tiene su test; la API se simula
  con `fetch` o con `vi.mock` de la capa `auth-api`.
- CI: lint → typecheck → tests con cobertura → build → docs (TypeDoc) → SonarCloud.
- Cobertura excluida a propósito: catálogo `/design-system` y los generadores de imagen
  (`icon.tsx`, `opengraph-image.tsx`).

Ver también: [Cómo agregar un módulo](./AGREGAR-UN-MODULO.md) y [Decisiones](./DECISIONES.md).
