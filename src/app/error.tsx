'use client';

import { ErrorState } from '@/components/molecules/ErrorState';

/** Si algo falla al cargar una página pública (inicio de sesión, registro, contacto), se ofrece reintentar. */
export default function RootError({ retry }: Readonly<{ error: Error & { digest?: string }; retry: () => void }>) {
  return (
    <main id="contenido" tabIndex={-1} className="flex min-h-dvh items-center justify-center bg-background px-6 focus:outline-none">
      <ErrorState className="w-full max-w-md" onRetry={retry} />
    </main>
  );
}
