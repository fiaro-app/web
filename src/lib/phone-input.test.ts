import { describe, expect, it } from 'vitest';
import { fieldInput, formatPhoneInput } from './phone-input';

describe('formatPhoneInput', () => {
  it.each([
    ['3218957375', '321 895 7375'],
    ['321-895-7375', '321 895 7375'],
    ['+57 321 895 7375', '321 895 7375'],
    ['573218957375', '321 895 7375'],
    ['32189573759999', '321 895 7375'],
    ['321', '321'],
    ['3218', '321 8'],
    ['6012345678', '601 234 5678'],
    ['', ''],
  ])('%j → %j', (input, expected) => {
    expect(formatPhoneInput(input)).toBe(expected);
  });
});

describe('fieldInput', () => {
  it('solo da formato al teléfono', () => {
    expect(fieldInput('phone', '3218957375')).toBe('321 895 7375');
    expect(fieldInput('fullName', '  Ana 3 ')).toBe('  Ana 3 ');
  });
});
