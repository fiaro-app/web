import { act, renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useAttachment } from '@/features/attachments/use-attachment';

const api = vi.hoisted(() => ({ getAttachmentUrl: vi.fn(), uploadAttachment: vi.fn(), removeAttachment: vi.fn() }));
vi.mock('@/features/attachments/attachments-api', () => api);

const file = (type: string, size = 100) => new File([new Uint8Array(size)], 'a', { type });
const pick = (f: File) => ({ target: { files: [f], value: 'x' } }) as never;

describe('useAttachment', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    api.getAttachmentUrl.mockResolvedValue(null);
  });

  it('loads the url and ends ready', async () => {
    api.getAttachmentUrl.mockResolvedValue('https://s/x');
    const { result } = renderHook(() => useAttachment('clientPhoto', 'c1'));
    expect(result.current.status).toBe('loading');
    await waitFor(() => expect(result.current.status).toBe('ready'));
    expect(result.current.url).toBe('https://s/x');
  });

  it('shows an error and retries', async () => {
    api.getAttachmentUrl.mockRejectedValueOnce(new Error('x'));
    const { result } = renderHook(() => useAttachment('clientPhoto', 'c1'));
    await waitFor(() => expect(result.current.status).toBe('error'));
    act(() => result.current.retry());
    await waitFor(() => expect(result.current.status).toBe('ready'));
  });

  it('rejects a file that is not an image without calling the api', async () => {
    const { result } = renderHook(() => useAttachment('clientPhoto', 'c1'));
    await waitFor(() => expect(result.current.status).toBe('ready'));
    await act(() => result.current.chooseFile(pick(file('application/pdf'))));
    expect(result.current.error).toMatch(/PNG o JPG/);
    expect(api.uploadAttachment).not.toHaveBeenCalled();
  });

  it('uploads a valid file and reloads the url', async () => {
    const { result } = renderHook(() => useAttachment('paymentProof', 'p1'));
    await waitFor(() => expect(result.current.status).toBe('ready'));
    api.uploadAttachment.mockResolvedValue(undefined);
    api.getAttachmentUrl.mockResolvedValue('https://s/new');
    await act(() => result.current.chooseFile(pick(file('image/png'))));
    expect(api.uploadAttachment).toHaveBeenCalledWith('paymentProof', 'p1', expect.any(File));
    expect(result.current.url).toBe('https://s/new');
    expect(result.current.notice).toBe('Imagen guardada.');
  });

  it('shows a storage failure as a friendly message', async () => {
    const { result } = renderHook(() => useAttachment('clientPhoto', 'c1'));
    await waitFor(() => expect(result.current.status).toBe('ready'));
    api.uploadAttachment.mockRejectedValue(new Error('boom'));
    await act(() => result.current.chooseFile(pick(file('image/jpeg'))));
    expect(result.current.error).toMatch(/No pudimos subir/);
  });

  it('removes the image', async () => {
    api.getAttachmentUrl.mockResolvedValue('https://s/x');
    const { result } = renderHook(() => useAttachment('clientPhoto', 'c1'));
    await waitFor(() => expect(result.current.url).toBe('https://s/x'));
    api.removeAttachment.mockResolvedValue(undefined);
    api.getAttachmentUrl.mockResolvedValue(null);
    await act(() => result.current.remove());
    expect(result.current.url).toBeNull();
    expect(result.current.notice).toBe('Imagen quitada.');
  });
});
