import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { EMPTY_STATS_FILTERS } from '@/features/stats/stats-filters';
import { StatsExportButton } from './StatsExportButton';

const { useStatsExport } = vi.hoisted(() => ({ useStatsExport: vi.fn() }));
vi.mock('@/features/stats/use-stats-export', () => ({ useStatsExport }));

const exportPdf = vi.fn();

beforeEach(() => {
  vi.clearAllMocks();
  useStatsExport.mockReturnValue({ isExporting: false, error: null, exportPdf });
});

describe('StatsExportButton', () => {
  it('exports through the hook with the active filters', async () => {
    render(<StatsExportButton filters={EMPTY_STATS_FILTERS} />);
    expect(useStatsExport).toHaveBeenCalledWith(EMPTY_STATS_FILTERS);
    await userEvent.click(screen.getByRole('button', { name: 'Exportar reporte (PDF)' }));
    expect(exportPdf).toHaveBeenCalledTimes(1);
  });

  it('shows why the export failed', () => {
    useStatsExport.mockReturnValue({ isExporting: false, error: 'No tienes permiso', exportPdf });
    render(<StatsExportButton filters={EMPTY_STATS_FILTERS} />);
    expect(screen.getByText('No tienes permiso')).toBeInTheDocument();
  });
});
