import type { Metadata } from 'next';
import { ButtonLink } from '@/components/atoms/ButtonLink';
import { EmptyState } from '@/components/molecules/EmptyState';

export const metadata: Metadata = {
  title: 'Página no encontrada',
  robots: { index: false, follow: false },
};

/** 404 de todo el sitio: dice qué pasó y devuelve a la portada. */
export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-6">
      <EmptyState
        className="w-full max-w-md"
        icon="?"
        title="No encontramos esa página"
        description="Puede que el enlace esté roto o que la página ya no exista."
        action={<ButtonLink href="/">Volver al inicio</ButtonLink>}
      />
    </main>
  );
}
