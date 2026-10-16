import { describe, expect, it } from 'vitest';
import { IMAGE_MAX_BYTES, validateImageFile } from '@/features/attachments/image-file';

describe('validateImageFile', () => {
  it('accepts png and jpeg within the limit', () => {
    expect(validateImageFile({ type: 'image/png', size: 10 })).toBeNull();
    expect(validateImageFile({ type: 'image/jpeg', size: IMAGE_MAX_BYTES })).toBeNull();
  });
  it('rejects other types, big and empty files', () => {
    expect(validateImageFile({ type: 'image/gif', size: 10 })).toMatch(/PNG o JPG/);
    expect(validateImageFile({ type: 'image/png', size: IMAGE_MAX_BYTES + 1 })).toMatch(/5 MB/);
    expect(validateImageFile({ type: 'image/png', size: 0 })).toMatch(/vacío/);
  });
});
