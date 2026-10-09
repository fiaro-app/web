# Fiaro — Web

Panel web para Owners y Lenders de Fiaro: gestión de cartera, cobradores y clientes, con visibilidad de mora en tiempo real y efectividad de cobro por cobrador. Consume la [API de Fiaro](https://github.com/fiaro-app/api).

Repo privado. Software propietario — ver [LICENSE](./LICENSE).

Documento de dominio y producto (entidades, multi-tenancy, suscripciones, roadmap): [api/PRODUCT.md](https://github.com/fiaro-app/api/blob/dev/PRODUCT.md).

## Stack

Next.js 16 (App Router) · TypeScript · Tailwind CSS 4 · pnpm · Vercel

> Este proyecto corre sobre una versión de Next.js más reciente que la del entrenamiento de cualquier LLM que lo edite — antes de escribir código, revisar `node_modules/next/dist/docs/` para convenciones/breaking changes (ver `AGENTS.md`).

## Requisitos

- Node 24
- pnpm 11 (`corepack enable` si no lo tienes activado)

## Contratos (`@fiaro-app/contracts`)

Los schemas y tipos compartidos con la API viven en un paquete privado de GitHub Packages. El
`.npmrc` del repo ya apunta al registro; para instalarlo en local hace falta un token **classic**
con el permiso `read:packages` ([crear uno](https://github.com/settings/tokens/new?scopes=read:packages&description=fiaro-packages-read)),
guardado en tu `~/.npmrc` global (nunca en el repo):

```ini
//npm.pkg.github.com/:_authToken=TU_TOKEN
```

En CI no hace falta ningún secreto: el `GITHUB_TOKEN` del workflow descarga el paquete, siempre
que [el paquete](https://github.com/orgs/fiaro-app/packages/npm/contracts/settings) le dé acceso
de lectura a este repo (*Manage Actions access*).

## Empezar

```bash
pnpm install
pnpm dev
```

Abre [http://localhost:3001](http://localhost:3001) (el puerto que espera `CORS_ORIGINS` de la API).

Copia `.env.example` a `.env.local` y ajusta `API_URL` (origen de la API) y `NEXT_PUBLIC_SITE_URL` (URL pública de la web). Para iniciar sesión y registrarte en local, la API debe estar corriendo y tener `http://localhost:3001` en su `CORS_ORIGINS`.

## Scripts

| Comando | Qué hace |
|---|---|
| `pnpm dev` | Servidor de desarrollo (puerto 3001) |
| `pnpm lint` | ESLint |
| `pnpm typecheck` | Genera tipos de rutas (`next typegen`) + `tsc --noEmit` |
| `pnpm test` | Tests (Vitest + Testing Library) |
| `pnpm build` | Build de producción |
| `pnpm docs` | Genera documentación de la API del código (TypeDoc) de `src/lib` y `src/features` en `docs/` |

> **Probar el build de producción en local (`pnpm build && pnpm start`)**: la política de seguridad incluye `upgrade-insecure-requests` solo fuera de desarrollo, así que sobre `http://localhost` el navegador intenta una vez `https` y muestra `ERR_SSL_PROTOCOL_ERROR` en la consola. Es esperado y no ocurre detrás de HTTPS; la navegación sigue funcionando.

El pipeline de CI (`.github/workflows/ci.yml`) corre lint → typecheck → test → build → docs → análisis de Sonar en cada PR y en cada push a `dev`.

## Estructura

```
src/
  app/              # Rutas (App Router): páginas finas, solo metadata y composición
  components/       # Solo presentación (Atomic Design): atoms · molecules · organisms · templates
  features/         # Lógica por módulo: endpoints, schemas, hooks (use-*), mensajes de error
  content/          # Textos y datos estáticos de pantalla, tipados
  lib/              # Utilidades puras: cliente de la API, formularios, SEO, seguridad
  stores/           # Estado global con Zustand (tema del Lender)
  proxy.ts          # Chequeo optimista de sesión
documentacion/      # Arquitectura, guía para agregar un módulo y registro de decisiones
```

**Lógica y diseño van separados:** un componente solo pinta; lo que decide, valida o llama a la API
vive en un hook de `features/`. Los colores salen de variables CSS (`globals.css`, `@theme inline` de
Tailwind 4) en vez de clases fijas: así `useThemeStore` puede cambiar el color de marca del Lender
en tiempo de ejecución sin tocar ningún componente.

Lee [documentacion/ARQUITECTURA.md](./documentacion/ARQUITECTURA.md) antes de agregar código y
[documentacion/AGREGAR-UN-MODULO.md](./documentacion/AGREGAR-UN-MODULO.md) para sumar un módulo.

## Ramas y flujo de trabajo

- `dev` es la rama de integración y la rama por defecto — todo PR apunta aquí.
- `main` es producción — se actualiza vía PR desde `dev` cuando está estable.
- **PR de funcionalidad** (rama → `dev`): merge por **squash**, un commit por PR.
- **PR de release** (`dev` → `main`): **merge commit**. Así `main` y `dev` comparten historia y el siguiente release no tiene conflictos; con squash, `main` quedaría con un commit que `dev` no tiene.
- La rama de origen se borra automáticamente al mergear (`dev` nunca, porque es la rama por defecto).
- Sin protección de rama activa (equipo de una persona por ahora).
- Sin despliegue configurado todavía (Vercel se conecta cuando el proyecto esté listo para eso).

## Repos relacionados

| Repo | Contenido |
|---|---|
| [fiaro-app/api](https://github.com/fiaro-app/api) | Backend (NestJS) |
| [fiaro-app/mobile](https://github.com/fiaro-app/mobile) | App del Collector (Expo) |
| [fiaro-app/contracts](https://github.com/fiaro-app/contracts) | Schemas de Zod compartidos (`@fiaro-app/contracts`) |
