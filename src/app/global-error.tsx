'use client';

/**
 * Último recurso: si falla el diseño raíz, esto reemplaza toda la página. Trae su propio `<html>` y `<body>` y estilos en línea:
 * ni las fuentes ni el CSS global están disponibles aquí.
 */
export default function GlobalError({ retry }: Readonly<{ error: Error & { digest?: string }; retry: () => void }>) {
  return (
    <html lang="es-CO">
      <body style={{ margin: 0, fontFamily: 'system-ui, sans-serif', display: 'flex', minHeight: '100dvh', alignItems: 'center', justifyContent: 'center', padding: 24, textAlign: 'center' }}>
        <main>
          <h1 style={{ fontSize: 24 }}>Algo salió mal</h1>
          <p>No pudimos cargar Fiaro. Inténtalo de nuevo en un momento.</p>
          <button type="button" onClick={retry} style={{ minHeight: 44, padding: '0 24px', fontSize: 16, cursor: 'pointer' }}>
            Reintentar
          </button>
        </main>
      </body>
    </html>
  );
}
