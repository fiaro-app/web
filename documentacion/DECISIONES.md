# Registro de decisiones de la web

Cada decisión tiene un ID (`W-nn`) para citarla desde código y PRs. Si una se revierte, se tacha y
se agrega la nueva.

| ID | Decisión | Por qué |
|---|---|---|
| W-01 | Atomic Design (átomos → moléculas → organismos → templates) con las pantallas en `app/` | Piezas reutilizables que solo cambian por parámetros |
| W-02 | Tokens del diseño de Penpot en `globals.css`; el color de marca por defecto es el anil de Fiaro y `useThemeStore` lo cambia en ejecución | Un solo lugar para el tema; el Lender podrá cambiar su color |
| W-03 | Sin modo oscuro | El diseño solo define tema claro |
| W-04 | Lógica en `features/` (hooks y funciones puras), vistas en `components/`, textos en `content/` | Probar la lógica sin navegador y cambiar el diseño sin tocarla |
| W-05 | Las llamadas del navegador van a `/api/*` y Next las reenvía a la API (`rewrites`) | Cookie de sesión de primera parte, sin CORS ni cookies de terceros; `proxy.ts` puede leerla |
| W-06 | `callEndpoint` sobre `defineEndpoint` de `@fiaro-app/contracts`, y la respuesta se valida con el schema | Un solo punto de acceso a la API; si el contrato se desfasa, falla al instante y no en pantalla |
| W-07 | La interfaz reacciona al `code` del error, nunca a su texto | El texto cambia por idioma; el código es estable |
| W-08 | Login por celular + contraseña (el mockup pedía correo y se corrigió) | La API (D-07) no usa correo para iniciar sesión |
| W-09 | Registro en dos pasos (cuenta y negocio), sin paso de plan ni logo | La API no recibe plan ni logo al registrarse; el logo se sube con sesión |
| W-10 | Sesión en dos capas: `proxy.ts` (optimista) y `requireUser` (autoritativa) | El proxy es rápido pero no decide; la API es quien sabe si la sesión vale |
| W-11 | Rutas protegidas por defecto; solo las de una lista pública se abren sin sesión | Una ruta olvidada queda cerrada, no abierta |
| W-12 | CSP sin nonce (con `'unsafe-inline'` para los scripts de Next) y todo lo demás cerrado | El nonce volvería dinámicas las páginas públicas y la landing dejaría de ser estática |
| W-13 | Los endpoints de auth y registro se declaran en la web mientras `contracts` no los publique | `contracts` 0.6.0 solo trae `system`; deben migrar al paquete |
| W-14 | La política de contraseña (8–128) se replica en `password-policy.ts` | Hoy no viaja en el contrato; debe migrar con W-13 |
| W-15 | CI instala `contracts` con el `GITHUB_TOKEN` (`packages: read`) | Sin secretos nuevos; el paquete da acceso de lectura al repo |
| W-16 | Dependabot solo para las GitHub Actions | Las dependencias npm incluyen un paquete privado que Dependabot no puede leer sin un token propio |
| W-17 | El Resumen no lleva filtros de periodo y muestra "Efectividad de hoy"; no hay botón "Revisar" en los cuadres | La API entrega solo el día de hoy; "Revisar" llega con el módulo Cuadres |
| W-18 | Los endpoints de colaboradores (invitar, roles, desactivar, restablecer) se declaran en la web | Mismo plan de migración que W-13: `contracts` 0.6.0 solo publica los schemas base |
| W-19 | La tabla de Cobradores muestra nombre, teléfono, cartera y estado; sin cédula ni efectividad | `QUERY /memberships` no devuelve esos datos; la efectividad por cobrador vendrá de estadísticas |
| W-20 | La contraseña temporal del cobrador se muestra una sola vez en la confirmación y no se guarda en ningún lado | La API la entrega en claro solo en la respuesta; el diseño decía que llegaba por correo y se corrigió |
| W-21 | La página de la lista viaja en `?pagina=` y se valida en el servidor (`parsePageParam`) | La URL es compartible y cualquier valor inválido cae en la página 1 |

## Pendientes conocidos

- Migrar a `@fiaro-app/contracts`: endpoints de auth/registro y política de contraseña (W-13, W-14).
- Editar y desactivar cobradores desde la UI (los endpoints ya están declarados).
- Recuperar contraseña (la API ya tiene `request-password-reset` y `reset-password`).
- Cambio de contraseña obligatorio (`mustChangePassword`) para cuentas con contraseña temporal.
- Subir el logo del prestamista desde Configuración (`POST /lender/logo-upload-url`).
