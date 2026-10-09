import { act, renderHook } from '@testing-library/react';
import type { ChangeEvent } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ApiRequestError } from '@/lib/api';
import { saveLogoUrl, uploadLogoFile } from './lender-api';
import { useLogoForm } from './use-logo-form';

const refresh = vi.fn();
vi.mock('next/navigation', () => ({ useRouter: () => ({ refresh }) }));
vi.mock('./lender-api', () => ({ saveLogoUrl: vi.fn(), uploadLogoFile: vi.fn() }));

const upload = vi.mocked(uploadLogoFile);
const save = vi.mocked(saveLogoUrl);

const pick = (file: { type: string; size: number } | undefined) => {
  const input = { files: file ? [file] : [], value: 'x' };
  return { event: { target: input } as unknown as ChangeEvent<HTMLInputElement>, input };
};

beforeEach(() => {
  vi.clearAllMocks();
  upload.mockResolvedValue('https://cdn.fiaro.co/logos/a.png');
  save.mockResolvedValue({} as never);
});

describe('useLogoForm', () => {
  it('rejects a file that is not PNG/JPEG before uploading', async () => {
    const { result } = renderHook(() => useLogoForm());

    await act(() => result.current.chooseFile(pick({ type: 'image/gif', size: 10 }).event));

    expect(result.current.error).toBe('El logo debe ser una imagen PNG o JPG.');
    expect(upload).not.toHaveBeenCalled();
  });

  it('uploads the file, saves the public URL and refreshes', async () => {
    const { result } = renderHook(() => useLogoForm());
    const { event, input } = pick({ type: 'image/png', size: 10 });

    await act(() => result.current.chooseFile(event));

    expect(save).toHaveBeenCalledWith('https://cdn.fiaro.co/logos/a.png');
    expect(result.current.notice).toBe('Logo actualizado.');
    expect(refresh).toHaveBeenCalled();
    expect(input.value).toBe('');
  });

  it('ignores an empty selection', async () => {
    const { result } = renderHook(() => useLogoForm());

    await act(() => result.current.chooseFile(pick(undefined).event));

    expect(upload).not.toHaveBeenCalled();
  });

  it('explains a storage failure and an API failure differently', async () => {
    const { result } = renderHook(() => useLogoForm());
    upload.mockRejectedValueOnce(new TypeError('network'));
    await act(() => result.current.chooseFile(pick({ type: 'image/png', size: 10 }).event));
    expect(result.current.error).toBe('No pudimos subir el logo. Inténtalo de nuevo.');

    upload.mockRejectedValueOnce(new ApiRequestError({ statusCode: 403, code: 'FORBIDDEN', message: 'x' }));
    await act(() => result.current.chooseFile(pick({ type: 'image/png', size: 10 }).event));
    expect(result.current.error).toMatch(/permiso/);
  });

  it('removes the logo', async () => {
    const { result } = renderHook(() => useLogoForm());

    await act(() => result.current.removeLogo());

    expect(save).toHaveBeenCalledWith(null);
    expect(result.current.notice).toBe('Logo quitado.');
  });
});
