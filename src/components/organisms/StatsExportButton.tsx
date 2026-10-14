'use client';

import { Button } from '@/components/atoms/Button';
import { Alert } from '@/components/molecules/Alert';
import { STATS_TEXT } from '@/content/stats';
import type { StatsFilters } from '@/features/stats/stats-filters';
import { useStatsExport } from '@/features/stats/use-stats-export';

/** "Exportar reporte (PDF)" con los filtros activos. Solo diseño; la lógica vive en `useStatsExport`. */
export function StatsExportButton({ filters }: Readonly<{ filters: StatsFilters }>) {
  const { isExporting, error, exportPdf } = useStatsExport(filters);

  return (
    <div className="flex flex-col items-start gap-3">
      {error && <Alert tone="error">{error}</Alert>}
      <Button variant="outline" loading={isExporting} onClick={() => void exportPdf()}>
        {STATS_TEXT.export.action}
      </Button>
    </div>
  );
}
