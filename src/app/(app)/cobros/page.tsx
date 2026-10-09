import type { Metadata } from 'next';
import { StateIcon } from '@/components/atoms/StateIcon';
import { EmptyState } from '@/components/molecules/EmptyState';
import { VisitReportView } from '@/components/organisms/VisitReportView';
import { VISITS_TEXT } from '@/content/visits';
import { getVisitReport } from '@/features/visits/get-visit-report.server';
import { parseVisitReportFilters } from '@/features/visits/visit-report-filters';
import { parsePageParam } from '@/lib/pagination';

export const metadata: Metadata = { title: 'Cobros del día' };

/** Cobros del día: trae la página y los filtros pedidos en el servidor y los pinta. */
export default async function VisitReportPage({ searchParams }: PageProps<'/cobros'>) {
  const params = await searchParams;
  const filters = parseVisitReportFilters(params);
  const result = await getVisitReport(filters, parsePageParam(params.pagina));

  if (result.status === 'forbidden') {
    return <EmptyState icon={<StateIcon name="lock" />} {...VISITS_TEXT.report.forbidden} />;
  }
  return <VisitReportView report={result.report} filters={filters} collectors={result.collectors} />;
}
