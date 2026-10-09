import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ApiRequestError } from '@/lib/api';
import { saveFile } from '@/lib/download';
import { exportStatsPdf } from './stats-api';
import { EMPTY_STATS_FILTERS } from './stats-filters';
import { useStatsExport } from './use-stats-export';

vi.mock('./stats-api', () => ({ exportStatsPdf: vi.fn() }));
vi.mock('@/lib/download', () => ({ saveFile: vi.fn() }));
const exportMock = vi.mocked(exportStatsPdf);
const saveMock = vi.mocked(saveFile);

const FILE = { blob: new Blob(['%PDF']), filename: 'estadisticas.pdf' };

beforeEach(() => {
  vi.clearAllMocks();
  exportMock.mockResolvedValue(FILE);
});

describe('useStatsExport', () => {
  it('requests the PDF with the active filters and saves it', async () => {
    const filters = { ...EMPTY_STATS_FILTERS, from: '2026-10-01', to: '2026-10-09' };
    const { result } = renderHook(() => useStatsExport(filters));
    await act(() => result.current.exportPdf());
    expect(exportMock).toHaveBeenCalledWith(filters);
    expect(saveMock).toHaveBeenCalledWith(FILE.blob, 'estadisticas.pdf');
    expect(result.current.error).toBeNull();
    expect(result.current.isExporting).toBe(false);
  });

  it('explains a refusal without saving anything', async () => {
    exportMock.mockRejectedValue(new ApiRequestError({ statusCode: 403, code: 'FORBIDDEN', message: 'x' }));
    const { result } = renderHook(() => useStatsExport(EMPTY_STATS_FILTERS));
    await act(() => result.current.exportPdf());
    expect(result.current.error).toBe('No tienes permiso para exportar las estadísticas.');
    expect(saveMock).not.toHaveBeenCalled();
    expect(result.current.isExporting).toBe(false);
  });

  it('explains invalid filters and falls back to the generic message', async () => {
    exportMock.mockRejectedValueOnce(new ApiRequestError({ statusCode: 400, code: 'VALIDATION_FAILED', message: 'x' }));
    const { result } = renderHook(() => useStatsExport(EMPTY_STATS_FILTERS));
    await act(() => result.current.exportPdf());
    expect(result.current.error).toMatch(/no son válidos/);
    exportMock.mockRejectedValueOnce(new Error('boom'));
    await act(() => result.current.exportPdf());
    expect(result.current.error).toMatch(/No pudimos completar la solicitud/);
  });
});
