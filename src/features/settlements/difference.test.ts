import { describe, expect, it } from 'vitest';
import { describeDifference } from './difference';

describe('describeDifference', () => {
  it('is neutral and has no text when it balances', () => {
    expect(describeDifference(100_000, 100_000)).toEqual({ text: null, tone: 'neutral' });
  });

  it('is bad when money is missing', () => {
    expect(describeDifference(100_000, 90_000)).toEqual({ text: '-$10.000', tone: 'bad' });
  });

  it('is a warning when there is a surplus', () => {
    expect(describeDifference(100_000, 105_000)).toEqual({ text: '$5.000', tone: 'warning' });
  });
});
