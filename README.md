# Fiaro — Web

Panel web para Owners y Lenders de Fiaro: gestión de cartera, cobradores y clientes, con visibilidad de mora en tiempo real y efectividad de cobro por cobrador. Consume la [API de Fiaro](https://github.com/fiaro-app/api).

Repo privado. Software propietario — ver [LICENSE](./LICENSE).

## Stack

Next.js 16 (App Router) · TypeScript · Tailwind CSS 4 · pnpm · Vercel

> Este proyecto corre sobre una versión de Next.js más reciente que la del entrenamiento de cualquier LLM que lo edite — antes de escribir código, revisar `node_modules/next/dist/docs/` para convenciones/breaking changes (ver `AGENTS.md`).

## Requisitos

- Node 24
- pnpm 11 (`corepack enable` si no lo tienes activado)

## Empezar

```bash
pnpm install
pnpm dev
```

Abre [http://localhost:3000](http://localhost:3000).

## Scripts

| Comando | Qué hace |
|---|---|
| `pnpm dev` | Servidor de desarrollo |
| `pnpm lint` | ESLint |
| `pnpm typecheck` | Genera tipos de rutas (`next typegen`) + `tsc --noEmit` |
| `pnpm test` | Tests (Vitest + Testing Library) |
| `pnpm build` | Build de producción |
| `pnpm docs` | Genera documentación (TypeDoc) de `src/lib` en `docs/` |

El pipeline de CI (`.github/workflows/ci.yml`) corre lint → typecheck → test → build → docs → análisis de Sonar en cada PR y en cada push a `dev`.

## Estructura

```
src/
  app/      # Rutas (App Router) — cada archivo es una pantalla, layout.tsx define el shell
  lib/       # Utilidades puras, testeadas con Vitest
```

## Ramas y flujo de trabajo

- `dev` es la rama de integración y la rama por defecto — todo PR apunta aquí.
- `main` es producción — se actualiza vía PR desde `dev` cuando está estable.
- Merge siempre por squash; la rama de origen se borra automáticamente al mergear.
- Sin protección de rama activa (equipo de una persona por ahora).
- Sin despliegue configurado todavía (Vercel se conecta cuando el proyecto esté listo para eso).

## Repos relacionados

| Repo | Contenido |
|---|---|
| [fiaro-app/api](https://github.com/fiaro-app/api) | Backend (NestJS) |
| [fiaro-app/mobile](https://github.com/fiaro-app/mobile) | App del Collector (Expo) |
| [fiaro-app/contracts](https://github.com/fiaro-app/contracts) | Schemas de Zod compartidos (`@fiaro-app/contracts`) |
