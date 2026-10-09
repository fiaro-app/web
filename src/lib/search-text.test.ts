import { describe, expect, it } from 'vitest';
import { matchesSearch, normalizeSearchText } from './search-text';

describe('normalizeSearchText', () => {
  it('removes accents, case and surrounding spaces', () => {
    expect(normalizeSearchText('  José PÉREZ ')).toBe('jose perez');
  });
});

describe('matchesSearch', () => {
  it('finds a word in any field, ignoring accents and case', () => {
    expect(matchesSearch('jose', 'Carlos Gómez', 'José Ruiz')).toBe(true);
    expect(matchesSearch('GOMEZ', 'Carlos Gómez')).toBe(true);
  });

  it('does not match what is not there and matches everything when empty', () => {
    expect(matchesSearch('luis', 'Carlos Gómez')).toBe(false);
    expect(matchesSearch('', 'Carlos')).toBe(true);
  });
});
