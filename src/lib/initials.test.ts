import { describe, expect, it } from 'vitest';
import { getInitials } from './initials';

describe('getInitials', () => {
  it('uses the first letter of the first two words, uppercased', () => {
    expect(getInitials('Marta Gómez')).toBe('MG');
    expect(getInitials('  juan  pablo  r.')).toBe('JP');
  });

  it('returns a single letter for a single word', () => {
    expect(getInitials('Fiaro')).toBe('F');
  });

  it('returns an empty string for an empty name', () => {
    expect(getInitials('   ')).toBe('');
  });
});
