'use client';

import { useState } from 'react';
import { describeStatsError } from '@/features/stats/error-messages';
import { exportStatsPdf } from '@/features/stats/stats-api';
import type { StatsFilters } from '@/features/stats/stats-filters';
import { saveFile } from '@/lib/download';

/**
 * Lógica de "Exportar reporte (PDF)", sin diseño. Pide el PDF con los filtros activos y lo deja
 * descargando en el navegador; si falla, deja el mensaje en `error`.
 */
export function useStatsExport(filters: StatsFilters) {
  const [isExporting, setIsExporting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const exportPdf = async () => {
    if (isExporting) return;
    setIsExporting(true);
    setError(null);
    try {
      const { blob, filename } = await exportStatsPdf(filters);
      saveFile(blob, filename);
    } catch (failure) {
      setError(describeStatsError(failure).message);
    } finally {
      setIsExporting(false);
    }
  };

  return { isExporting, error, exportPdf };
}
