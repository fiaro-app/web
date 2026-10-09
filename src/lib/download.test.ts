import { afterEach, describe, expect, it, vi } from 'vitest';
import { saveFile } from './download';

afterEach(() => {
  vi.restoreAllMocks();
});

describe('saveFile', () => {
  it('clicks a temporary download link and cleans up', () => {
    const create = vi.fn(() => 'blob:fiaro/1');
    const revoke = vi.fn();
    vi.stubGlobal('URL', { ...URL, createObjectURL: create, revokeObjectURL: revoke });
    const click = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => undefined);

    saveFile(new Blob(['x']), 'reporte.pdf');

    expect(create).toHaveBeenCalledTimes(1);
    expect(click).toHaveBeenCalledTimes(1);
    const clicked = click.mock.contexts[0];
    expect(clicked.download).toBe('reporte.pdf');
    expect(clicked.getAttribute('href')).toBe('blob:fiaro/1');
    expect(revoke).toHaveBeenCalledWith('blob:fiaro/1');
    expect(document.querySelector('a[download]')).toBeNull();
    vi.unstubAllGlobals();
  });
});
