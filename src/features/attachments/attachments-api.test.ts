import { beforeEach, describe, expect, it, vi } from 'vitest';
import { getAttachmentUrl, removeAttachment, uploadAttachment } from '@/features/attachments/attachments-api';

const call = vi.hoisted(() => vi.fn());
vi.mock('@/lib/api', () => ({ callEndpoint: call }));

describe('attachments-api', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    vi.stubGlobal('fetch', vi.fn());
  });

  it('returns the signed url', async () => {
    call.mockResolvedValue({ url: 'https://s/x', expiresAt: 'e' });
    expect(await getAttachmentUrl('clientPhoto', 'c1')).toBe('https://s/x');
  });

  it('uploads straight to storage and then saves the key', async () => {
    call.mockResolvedValueOnce({ uploadUrl: 'https://s/put', key: 'k', expiresAt: 'e' }).mockResolvedValueOnce(undefined);
    vi.mocked(fetch).mockResolvedValue({ ok: true } as Response);
    await uploadAttachment('paymentProof', 'p1', new File(['x'], 'a.png', { type: 'image/png' }));
    expect(fetch).toHaveBeenCalledWith('https://s/put', expect.objectContaining({ method: 'PUT' }));
    expect(call).toHaveBeenLastCalledWith(expect.anything(), { params: { id: 'p1' }, body: { key: 'k' } });
  });

  it('throws when storage refuses the upload', async () => {
    call.mockResolvedValueOnce({ uploadUrl: 'https://s/put', key: 'k', expiresAt: 'e' });
    vi.mocked(fetch).mockResolvedValue({ ok: false, status: 403 } as Response);
    await expect(uploadAttachment('clientPhoto', 'c1', new File(['x'], 'a.jpg', { type: 'image/jpeg' }))).rejects.toThrow('403');
  });

  it('removes the image', async () => {
    call.mockResolvedValue(undefined);
    await removeAttachment('clientPhoto', 'c1');
    expect(call).toHaveBeenCalledWith(expect.anything(), { params: { id: 'c1' } });
  });
});
