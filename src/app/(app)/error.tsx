'use client';

import { ErrorState } from '@/components/molecules/ErrorState';

/** Si algo falla al cargar una pantalla del panel (API caída, respuesta inesperada), se ofrece reintentar. */
export default function AppError({ retry }: Readonly<{ error: Error & { digest?: string }; retry: () => void }>) {
  return <ErrorState className="max-w-md" onRetry={retry} />;
}
