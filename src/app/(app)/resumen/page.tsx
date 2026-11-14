import { StateIcon } from '@/components/atoms/StateIcon';
import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { EmptyState } from '@/components/molecules/EmptyState';
import { DashboardView } from '@/components/organisms/DashboardView';
import { getAccess } from '@/features/app-shell/get-access.server';
import { getCollectorsToday } from '@/features/collectors-today/get-collectors-today.server';
import { getLenderDashboard } from '@/features/dashboard/get-dashboard.server';
import { dateRangeParams } from '@/lib/search-params';

export const metadata: Metadata = { title: 'Resumen' };

/** Resumen del negocio (`Screen / Web / Resumen`): trae los datos en el servidor y los pinta. */
export default async function SummaryPage({ searchParams }: PageProps<'/resumen'>) {
  // El resumen del negocio es de quien administra: un cobrador entra por sus préstamos.
  if (!(await getAccess()).canManage) redirect('/prestamos');
  const range = dateRangeParams(await searchParams);
  const [result, collectorsToday] = await Promise.all([getLenderDashboard(range), getCollectorsToday()]);

  if (result.status === 'no-business') {
    return (
      <EmptyState
        icon={<StateIcon name="lock" />}
        title="Tu cuenta no tiene un negocio activo"
        description="Pídele al administrador de tu financiera que active tu acceso."
      />
    );
  }
  return <DashboardView dashboard={result.dashboard} range={range} collectorsToday={collectorsToday} />;
}
