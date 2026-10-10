import { describe, expect, it } from 'vitest';
import { uuidv7 } from './uuid';

const UUID_V7 = /^[0-9a-f]{8}-[0-9a-f]{4}-7[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;

describe('uuidv7', () => {
  it('has the version 7 and RFC 4122 variant bits', () => {
    expect(uuidv7()).toMatch(UUID_V7);
  });

  it('starts with the timestamp in milliseconds', () => {
    const id = uuidv7(0x0190f7a01234, () => new Uint8Array(16));
    expect(id.startsWith('0190f7a0-1234-7')).toBe(true);
  });

  it('is sortable by time and unique for the same instant', () => {
    expect(uuidv7(1_000) < uuidv7(2_000)).toBe(true);
    expect(uuidv7(5_000)).not.toBe(uuidv7(5_000));
  });
});
