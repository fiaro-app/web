import { beforeEach, describe, expect, it, vi } from 'vitest';
import { statsEndpoints } from './endpoints';

const { callEndpointForFile } = vi.hoisted(() => ({ callEndpointForFile: vi.fn() }));
vi.mock('@/lib/api', async (importOriginal) => ({ ...(await importOriginal<typeof import('@/lib/api')>()), callEndpointForFile }));

import { DEFAULT_STATS_FILENAME, exportStatsPdf } from './stats-api';
import { EMPTY_STATS_FILTERS } from './stats-filters';

const BLOB = new Blob(['%PDF']);

beforeEach(() => {
  vi.clearAllMocks();
});

describe('exportStatsPdf', () => {
  it('sends the filters plus the pdf format and keeps the name the API suggests', async () => {
    callEndpointForFile.mockResolvedValue({ blob: BLOB, filename: 'estadisticas-2026-10-01-a-2026-10-09.pdf' });
    const file = await exportStatsPdf({ ...EMPTY_STATS_FILTERS, from: '2026-10-01', to: '2026-10-09' });
    expect(callEndpointForFile).toHaveBeenCalledWith(statsEndpoints.exportPdf, {
      body: { dateRange: { from: '2026-10-01', to: '2026-10-09' }, format: 'pdf' },
    });
    expect(file).toEqual({ blob: BLOB, filename: 'estadisticas-2026-10-01-a-2026-10-09.pdf' });
  });

  it('falls back to a default name', async () => {
    callEndpointForFile.mockResolvedValue({ blob: BLOB, filename: null });
    expect((await exportStatsPdf(EMPTY_STATS_FILTERS)).filename).toBe(DEFAULT_STATS_FILENAME);
  });
});
