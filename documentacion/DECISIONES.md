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
| W-22 | "Editar cobrador" es una pantalla de gestión: cambiar cartera, restablecer contraseña y desactivar | La API no permite editar nombre, cédula ni celular de un colaborador; solo roles/cartera y estado |
| W-23 | El cambio de cartera reenvía los roles que ya tenía la persona | `PATCH /memberships/:id/roles` reemplaza todos los roles; mandar solo `COLLECTOR` quitaría otros |
| W-24 | El detalle de un cobrador se busca en el listado (`getCollector`) | No existe `GET /memberships/:id`; si se publica, se cambia solo esa función |
| W-25 | Los endpoints de clientes se declaran en la web (respuesta = `ClientSchema` sin `updatedAt`) | Mismo plan de migración que W-13: `contracts` publica el schema pero no los endpoints |
| W-26 | El teléfono del cliente acepta celular o fijo (`PhoneSchema`); el de las cuentas sigue siendo celular | Un cliente puede tener solo un fijo; la API lo permite |
| W-27 | La edición de cliente manda a la API solo los campos que cambiaron (`toClientChanges`) | `PATCH` deja intacto lo ausente y rechaza un cuerpo vacío |
| W-28 | La búsqueda de clientes es un formulario GET (`?q=`) validado en el servidor | Funciona sin JavaScript, la URL es compartible y la entrada se acota (`parseSearchParam`) |
| W-29 | Los endpoints de préstamos se declaran en la web (respuesta = `LoanSchema`) | Mismo plan de migración que W-13 |
| W-30 | El total a pagar se sugiere (cuotas × valor) hasta que la persona lo edita; después se respeta lo pactado | Fiaro no calcula intereses y la API respeta `totalPayable` |
| W-31 | "Hoy" y las fechas de cierre se leen en hora de Colombia (`America/Bogota`), no en UTC ni en la zona del navegador | A las 9 pm hora local el día UTC ya cambió y la fecha saldría corrida |
| W-32 | El filtro de estado de préstamos es una URL (`?estado=`) con enlaces `FilterPillLink`, validado en el servidor | Compartible, sin JS y un valor inválido equivale a "todos" |
| W-33 | Los nombres de cliente del listado salen de la página más grande de clientes (100); si no se pueden traer, se muestra "Cliente no disponible" | La API no devuelve el nombre dentro del préstamo; no se rompe la pantalla por eso |
| W-34 | Un préstamo solo se anula mientras está activo, con confirmación; el error `LOAN_NOT_CANCELABLE` se explica | La API rechaza anular uno que ya recibió pagos |
| W-35 | Los endpoints de cuadres (leer, listar, aprobar, rechazar) se declaran en la web; el envío queda fuera | El cobrador envía el cuadre desde la app móvil; la web solo lo revisa |
| W-36 | El botón "Revisar" del Resumen lleva a `/cuadres/[id]` (reemplaza la omisión de W-17) | Ya existe el módulo Cuadres |
| W-37 | Aprobar y rechazar comparten un comentario opcional; un comentario vacío no se envía | La API lo trata como `reviewNote` ausente y el rechazo no exige motivo |
| W-38 | `businessDateOf` (hora de Colombia) vive en `lib/dates` y lo usan préstamos y cuadres | Un instante a las 9 pm hora local ya es el día siguiente en UTC |
| W-39 | La diferencia de un cuadre y el lookup de nombres de cobradores se comparten entre Resumen y Cuadres | Una sola regla para el tono (falta = grana, sobra = ámbar) y una sola consulta |
| W-40 | "Notificaciones" se agrega a la barra lateral entre Cuadres y Estadísticas | Es una pantalla propia en la web; el orden del diseño no la incluía y debe verificarse contra Penpot |
| W-41 | Las notificaciones son de la persona (todos sus negocios), no de un negocio; no hay estado "sin acceso" | `QUERY /notifications` filtra por el usuario de la sesión |
| W-42 | Cada notificación lleva a su entidad solo si el id tiene forma de UUID y la pantalla existe (`notificationHref`); las de suscripción no llevan a ninguna parte | El id viene de la API y termina en una ruta; no se arma una dirección con un valor raro |
| W-43 | El filtro "no leídas" es una URL (`?filtro=no-leidas`) y las no leídas se marcan con texto ("Sin leer") y título en negrita, no solo con color | Compartible, sin JS y accesible |

## Pendientes conocidos

- Migrar a `@fiaro-app/contracts`: endpoints de auth/registro y política de contraseña (W-13, W-14).
- Préstamos: registrar pagos y ver el calendario de cuotas (módulo de cobros pendiente).
- Notificaciones: contador de no leídas en la barra lateral y notificaciones push (tokens de dispositivo).
- Recuperar contraseña (la API ya tiene `request-password-reset` y `reset-password`).
- Cambio de contraseña obligatorio (`mustChangePassword`) para cuentas con contraseña temporal.
- Subir el logo del prestamista desde Configuración (`POST /lender/logo-upload-url`).
