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
| Notificaciones | «Marcar todas como leídas» | Marcar de una en una; la API no tiene «todas». Filtro «No leídas» | ✅ |
| Estadísticas | Tendencias (↑ 4 %), **efectividad general**, periodo «Este mes» | 3 indicadores sin tendencias; periodo con fechas desde/hasta; exportar PDF | ✅ |
| Configuración | Pestañas General / Facturación / Seguridad; logo, nombre y **correo de contacto** | Nombre, días sin cobro y carteras. Sin logo (falta la subida), pestañas ni correo (el correo es de la persona, no del negocio) | ✅ |

## Qué hacer en Penpot

1. ✅ (hecho) Agregar «Notificaciones» a la barra lateral de todas las pantallas del panel.
2. ✅ (hecho) Cobradores: quitar cédula y efectividad de la tabla, cambiar «Editar» por «Gestionar», y rediseñar «Editar cobrador» como pantalla de gestión.
3. ✅ (hecho) Registrar cobrador: mostrar la contraseña temporal en la confirmación (una sola vez), no «enviada por correo».
4. Clientes y Préstamos: columnas ✅ (hecho). Falta diseñar la ficha del cliente con sus préstamos y la asignación de cobrador en el detalle del préstamo.
5. ✅ (hecho) Nuevo préstamo: cobrador opcional, y los cuatro montos tal como los pide la API.
6. ✅ (hecho) Cuadres, Notificaciones, Estadísticas y Configuración: alinear los filtros y las secciones con lo implementado.
7. ✅ (hecho) Diseñar las pantallas de recuperar contraseña y de cambio obligatorio.

## Pendientes que sí caben en la API (sin mockup nuevo)

- Comprobar si una cédula ya existe antes de registrar al cliente (`QUERY /clients` con `search`).
- Mostrar el cobrador en la lista de préstamos (pide una consulta por préstamo; mejor un campo en la API).
- Subir el logo (`POST /lender/logo-upload-url`): requiere conocer el host de almacenamiento para la CSP.

Las decisiones técnicas detrás de cada diferencia están en [DECISIONES.md](./DECISIONES.md).
