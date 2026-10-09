import type { Metadata } from 'next';
import { EmptyState } from '@/components/molecules/EmptyState';
import { DashboardView } from '@/components/organisms/DashboardView';
import { getLenderDashboard } from '@/features/dashboard/get-dashboard.server';

export const metadata: Metadata = { title: 'Resumen' };

/** Resumen del negocio (`Screen / Web / Resumen`): trae los datos en el servidor y los pinta. */
export default async function SummaryPage() {
  const result = await getLenderDashboard();

  if (result.status === 'no-business') {
    return (
      <EmptyState
        className="max-w-md"
        icon="!"
        title="Tu cuenta no tiene un negocio activo"
        description="Pídele al administrador de tu financiera que active tu acceso."
      />
    );
  }
  return <DashboardView dashboard={result.dashboard} />;
}
