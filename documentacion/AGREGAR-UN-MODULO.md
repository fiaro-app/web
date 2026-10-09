# Cómo agregar un módulo

Ejemplo: "Cobradores". Sigue el orden; cada paso es un commit pequeño.

1. **Contrato.** Busca en `@fiaro-app/contracts` los schemas y endpoints del módulo
   (`node_modules/@fiaro-app/contracts/dist/index.d.ts`). Si no están, revisa la API
   (`src/modules/<módulo>/infrastructure/controllers/schemas`) y decláralos en
   `features/<módulo>/endpoints.ts` con `defineEndpoint` y los mismos primitivos del contrato;
   anótalo para migrarlo al paquete.
2. **Datos.** En `features/<módulo>/` crea la función que llama a la API con `callEndpoint`
   (`<módulo>-api.ts`) y su test con `fetch` simulado.
3. **Lógica.** Hooks `use-*` (listas con filtros, formularios) y funciones puras. Los errores se
   traducen en un `error-messages.ts` por **código**. Todo con tests.
4. **Texto.** Los textos de pantalla van en `src/content/<módulo>.ts`.
5. **Diseño.** Compón con átomos y moléculas existentes; si falta una pieza reutilizable, créala
   primero (con su test y su entrada en `/design-system`). Los organismos solo pintan.
6. **Ruta.** `src/app/(app)/<módulo>/page.tsx`: metadata y composición, nada más. Agrega el enlace en
   `src/content/app-nav.ts`. Si la ruta es pública, súmala a `route-guard.ts`; si no, ya está protegida.
7. **Verifica.** `pnpm lint && pnpm typecheck && pnpm test:cov && pnpm build`, y míralo en el
   navegador contra el mockup de Penpot.
8. **PR pequeño.** Una funcionalidad por PR, con commits temáticos. El CI y SonarCloud deben pasar.

## Lista de comprobación

- [ ] ¿Algún archivo supera ~150 líneas? Pártelo.
- [ ] ¿Hay lógica dentro de un componente? Muévela a un hook.
- [ ] ¿Hay texto de pantalla dentro de un componente? Muévelo a `content/`.
- [ ] ¿Se reacciona al `code` del error y no a su texto?
- [ ] ¿La página tiene `title`, `description` y, si es privada o de acceso, `noindex`?
- [ ] ¿Todo es accesible por teclado y tiene nombre accesible?
