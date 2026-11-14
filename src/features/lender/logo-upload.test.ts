import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const { callEndpoint } = vi.hoisted(() => ({ callEndpoint: vi.fn() }));
vi.mock('@/lib/api', () => ({ callEndpoint }));

import { uploadLogoFile } from './lender-api';

const FILE = new File(['x'], 'logo.png', { type: 'image/png' });

beforeEach(() => {
  callEndpoint.mockReset();
  callEndpoint.mockResolvedValue({ uploadUrl: 'https://cdn.fiaro.co/up?sig=1', publicUrl: 'https://cdn.fiaro.co/logos/a.png', expiresAt: '2026-10-09T16:00:00.000Z' });
});
afterEach(() => vi.unstubAllGlobals());

describe('uploadLogoFile', () => {
  it('asks for a signed URL, PUTs the file straight to the storage and returns the public URL', async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, status: 200 });
    vi.stubGlobal('fetch', fetchMock);

    await expect(uploadLogoFile(FILE)).resolves.toBe('https://cdn.fiaro.co/logos/a.png');

    expect(callEndpoint.mock.calls[0]?.[1]).toEqual({ body: { contentType: 'image/png', sizeBytes: 1 } });
    expect(fetchMock).toHaveBeenCalledWith('https://cdn.fiaro.co/up?sig=1', { method: 'PUT', headers: { 'Content-Type': 'image/png' }, body: FILE });
  });

  it('fails when the storage rejects the upload', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, status: 403 }));

    await expect(uploadLogoFile(FILE)).rejects.toThrow('Falló la subida del logo (403).');
  });
});
