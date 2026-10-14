import { describe, expect, it } from 'vitest';
import { parseInitialClient } from './initial-client';

const ID = '0192f0a4-7c3e-7000-8000-000000000001';

describe('parseInitialClient', () => {
  it('accepts a UUID', () => {
    expect(parseInitialClient(ID)).toBe(ID);
  });

  it.each([undefined, '', 'maria', '../login', [ID, ID]])('is empty for %j', (value) => {
    expect(parseInitialClient(value)).toBe('');
  });
});
