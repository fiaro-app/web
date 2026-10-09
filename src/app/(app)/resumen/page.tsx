import type { Metadata } from 'next';
import { EmptyState } from '@/components/molecules/EmptyState';

export const metadata: Metadata = { title: 'Resumen' };

/** Resumen del negocio (`Screen / Web / Resumen`): por ahora solo el espacio reservado. */
export default function SummaryPage() {
  return (
    <EmptyState
      className="mx-auto max-w-md"
      icon="◔"
      title="Estamos preparando tu resumen"
      description="Muy pronto verás aquí tu cartera, la mora y el cuadre del día."
    />
  );
}
