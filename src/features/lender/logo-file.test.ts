import { describe, expect, it } from 'vitest';
import { LOGO_MAX_BYTES, validateLogoFile } from './logo-file';

describe('validateLogoFile', () => {
  it('accepts a PNG or JPEG within the size limit', () => {
    expect(validateLogoFile({ type: 'image/png', size: 1000 })).toBeNull();
    expect(validateLogoFile({ type: 'image/jpeg', size: LOGO_MAX_BYTES })).toBeNull();
  });

  it('rejects other types, big files and empty files', () => {
    expect(validateLogoFile({ type: 'image/gif', size: 1000 })).toBe('El logo debe ser una imagen PNG o JPG.');
    expect(validateLogoFile({ type: 'image/png', size: LOGO_MAX_BYTES + 1 })).toMatch(/más de 2 MB/);
    expect(validateLogoFile({ type: 'image/png', size: 0 })).toBe('El archivo está vacío.');
  });
});
