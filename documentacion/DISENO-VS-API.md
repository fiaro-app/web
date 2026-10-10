# Diseño (Penpot) frente a la API

Cuando el mockup y la API no coinciden, **manda la API** y se corrige el mockup. Este documento lista,
pantalla por pantalla, lo que el diseño muestra, lo que la web implementa y qué falta ajustar en Penpot
(página «4 · Web · Lender»). Última revisión de los mockups: 9 de octubre de 2026.

Estados de la columna **Penpot**: ✅ ya corregido · ⏳ por corregir · 🆕 no existe el mockup.

## Acceso

| Pantalla | El mockup muestra | La web implementa (API) | Penpot |
|---|---|---|---|
| Login | — | Celular + contraseña (`POST /auth/sign-in/phone-number`) | ✅ |
| Registro | Pasos de cuenta, empresa y plan | Cuenta y empresa; no hay plan ni logo al registrarse (`POST /register`) | ✅ |
| Recuperar contraseña | — | Tableros «Recuperar contraseña — Celular» y «— Código». Celular → código de 6 dígitos y contraseña nueva → aviso final | ✅ |
| Cambio de contraseña obligatorio | — | Tablero «Cambio de contraseña obligatorio». Pantalla propia tras entrar con contraseña temporal | ✅ |

## Panel

| Pantalla | El mockup muestra | La web implementa (API) | Penpot |
|---|---|---|---|
| Barra lateral | 7 opciones (sin Notificaciones) | 8: se agrega **Notificaciones** entre Cuadres y Estadísticas | ✅ |
| Resumen | Sin filtros de periodo; «Efectividad de hoy» | Igual; botón «Revisar» lleva al cuadre | ✅ |
| Cobradores (lista) | Nombre, cédula, teléfono, cartera, estado, **efectividad** | Sin cédula ni efectividad: `QUERY /memberships` no las devuelve; enlace «Gestionar» | ✅ |
| Registrar cobrador | Contraseña temporal «enviada por correo» | La API la entrega en la respuesta: se muestra **una sola vez** en la confirmación | ✅ |
| Gestionar cobrador (antes «Editar cobrador») | Editar nombre, cédula y teléfono | Solo cambiar cartera, restablecer contraseña y desactivar; la API no edita los datos personales | ✅ |
| Clientes (lista) | Columnas **saldo** y **mora** | Sin esas columnas (exigirían una consulta por cliente); los préstamos y su saldo están en la ficha | ✅ |
| Registrar cliente | 2 pasos (cliente → préstamo) y comprobación de cédula existente | Formularios separados; una cédula repetida se marca en el campo (`CLIENT_NATIONAL_ID_TAKEN`). La comprobación previa se descarta: la API ya la valida al crear. El mockup quedó en un solo formulario | ✅ |
| Préstamos (lista) | Cliente, **cobrador**, valor, cuotas «14/24», saldo, estado; búsqueda por cliente o cobrador | Cliente, monto, cuotas, pagadas, saldo, inicio, estado; filtro por estado. Sin cobrador (solo en el detalle) ni búsqueda; el mockup ya refleja esto | ✅ |
| Nuevo préstamo | Cobrador obligatorio; «valor de cuota» calculado automáticamente | Cobrador **opcional**; Fiaro no calcula intereses: se escriben monto, cuotas, valor de cuota y total (el total se sugiere) | ✅ |
| Préstamo creado | Pantalla de confirmación | Se vuelve a la lista (el tablero se marcó «Fuera de alcance» en Penpot) | ✅ |
| Cuadres (lista) | Filtros de estado y mes, búsqueda por cobrador | Filtro por estado; sin mes ni búsqueda | ✅ |
| Detalle de cuadre | Montos por medio de pago, **historial de visitas**, nota, aprobar/rechazar | Montos por medio de pago, notas y revisión con comentario; el historial de visitas es por préstamo, no por cuadre | ✅ |
| Ficha del cliente | — | Datos del cliente, sus préstamos y acciones (nuevo préstamo, editar). Tablero «Ficha del cliente» | ✅ |
| Detalle de préstamo | — | Resumen, estado, cobrador asignado, asignar cobrador y anular. Tablero «Detalle de préstamo» | ✅ |
| Historial de cobros | — | Tablero «Detalle de préstamo — Historial de cobros»: visitas con fecha, resultado, cobrado y medio, y «Revertir pago» con motivo. La web agrega las columnas cobrador y esperado | ✅ |
| Notificaciones | «Marcar todas como leídas» | «Marcar todas como leídas» marca las no leídas de la página una por una (la API no tiene «todas»). Filtro «No leídas» | ✅ |
| Estadísticas | Tendencias (↑ 4 %), **efectividad general**, periodo «Este mes» | 3 indicadores sin tendencias; periodo con fechas desde/hasta; exportar PDF | ✅ |
| Mi cuenta | Pestaña «Seguridad» dentro de Configuración (sin detalle) | Pantalla propia `/cuenta` (tablero «Mi cuenta»): datos de la persona, correo verificable, contraseña, sesiones y desactivar. Se entra desde el perfil de la barra lateral | ✅ |
| Configuración | Pestañas General / Facturación / Seguridad; logo, nombre y **correo de contacto** | Nombre, días sin cobro y carteras. Logo con subida directa (necesita `STORAGE_ORIGIN`), sin pestañas ni correo (el correo es de la persona, no del negocio) | ✅ |

## Estados, diálogos y propuestas (Penpot)

Tableros nuevos en la página «4 · Web · Lender». Los estados vacíos son **grandes** (ocupan todo el área de contenido, con un círculo de 160px), no un recuadro pequeño:

| Grupo | Tableros | En la web |
|---|---|---|
| Estados | `Estado — …`: Cobradores vacío, Clientes vacío, Clientes sin resultados, Préstamos vacío, Préstamos sin resultados, Cuadres vacío, Notificaciones vacío, Estadísticas sin datos, Sin acceso, No encontrado, Error de carga, Cargando lista | ✅ `EmptyState` (grande), `ErrorState`, `loading.tsx` con `ListSkeleton` (W-63) |
| Diálogos | `Diálogo — …`: Restablecer contraseña, Contraseña temporal nueva, Desactivar cobrador, Anular préstamo | ✅ ya existían en la web |
| Propuestas | `Cobros del día`, `Calendario de cuotas` y `Notificaciones — Marcar todas` (marcadas «Propuesta, la API aún no lo tiene»); `Configuración — Logo` (marcada «falta el host de almacenamiento») | Las tres primeras **ya están implementadas** con los endpoints D-103 a D-115: `/cobros`, calendario de cuotas en el detalle del préstamo y «Marcar todas» con `POST /notifications/read-all`; ⏳ quitar la etiqueta «Propuesta» de esos tableros. El logo sigue necesitando `STORAGE_ORIGIN`. Sin mockup todavía (🆕): `Contactar ventas` (`/contacto`), `Tu plan`, `Color de marca`, sesiones activas, filtros de Cuadres y tendencias de Estadísticas |

## Responsive (Penpot)

Móvil de 390px (cabecera con menú; las tablas pasan a tarjetas; acciones principales a ancho completo) y tableta de 820px (cabecera con menú y tablas compactas):

- Móvil: `Mobile / Menú`, `Resumen`, `Cobradores`, `Clientes`, `Préstamos`, `Cuadres`, `Detalle de cuadre` (barra fija de aprobar/rechazar), `Notificaciones`, `Estadísticas`, `Configuración`, `Login`, `Registro — Cuenta`, `Registrar cobrador`, `Estado — Clientes vacío`, `Diálogo — Desactivar cobrador` (hoja inferior).
- Tableta: `Tablet / Resumen`, `Cobradores`, `Préstamos`, `Detalle de cuadre`.
- Pendiente de implementar en la web: menú móvil/drawer, tablas → tarjetas y barra fija del detalle de cuadre.

## Qué hacer en Penpot

1. ✅ (hecho) Agregar «Notificaciones» a la barra lateral de todas las pantallas del panel.
2. ✅ (hecho) Cobradores: quitar cédula y efectividad de la tabla, cambiar «Editar» por «Gestionar», y rediseñar «Editar cobrador» como pantalla de gestión.
3. ✅ (hecho) Registrar cobrador: mostrar la contraseña temporal en la confirmación (una sola vez), no «enviada por correo».
4. ✅ (hecho) Clientes y Préstamos: columnas, y diseñado la ficha del cliente con sus préstamos y la asignación de cobrador en el detalle del préstamo.
5. ✅ (hecho) Nuevo préstamo: cobrador opcional, y los cuatro montos tal como los pide la API.
6. ✅ (hecho) Cuadres, Notificaciones, Estadísticas y Configuración: alinear los filtros y las secciones con lo implementado.
7. ✅ (hecho) Diseñar las pantallas de recuperar contraseña y de cambio obligatorio.

## Pendientes que sí caben en la API (sin mockup nuevo)

- Comprobar si una cédula ya existe antes de registrar al cliente (`QUERY /clients` con `search`).
- Mostrar el cobrador en la lista de préstamos (pide una consulta por préstamo; mejor un campo en la API).

Las decisiones técnicas detrás de cada diferencia están en [DECISIONES.md](./DECISIONES.md).

## Pantallas y componentes nuevos (10 de octubre de 2026)

| Pieza | La web implementa (API) | Penpot |
|---|---|---|
| Registrar cobro (detalle de préstamo) | `POST /loans/:loanId/collection-visits`: resultado, monto y medio si pagó, fecha prometida si reprogramó, con confirmación. Solo con el rol Collector y el préstamo asignado hoy a quien cobra | ✅ «Detalle de préstamo — Registrar cobro» |
| Desactivar cobrador con reasignación | `POST /collectors/:id/deactivate`: pide a quién pasar sus préstamos activos | ✅ «Diálogo — Desactivar cobrador (reasignar préstamos)» |
| Calendario, menú desplegable y botón «Aplicar» | Componentes propios (`DatePicker`, `Select`, `FilterSubmitButton`); «Aplicar» se apaga si no hay cambios | ✅ «Componente / Calendario, menú desplegable y botón Aplicar» |
| Diálogos de confirmación | Más grandes, con icono y fondo desenfocado; aprobar/rechazar cuadre, cerrar sesiones, quitar logo, desactivar cuenta | ✅ (el icono quedó suelto sobre cada tablero) |
| Tutorial de bienvenida | Invitación en el primer ingreso y recorrido que deja nítido solo el elemento explicado | ✅ «Tutorial — Invitación inicial» y «Tutorial — Paso del recorrido» |
| Permisos por rol | Menú y acciones según la matriz de la API (W-95) | ⏳ falta un tablero con el menú de un cobrador |
| Configuración y Mi cuenta en dos columnas | Bloques repartidos en dos columnas desde `xl` | ⏳ los tableros siguen apilados |
| Cobros del día: buscador arriba | Buscador solo arriba y opciones con «Aplicar» abajo | ⏳ el tablero conserva las píldoras |

