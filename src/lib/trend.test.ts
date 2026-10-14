import { describe, expect, it } from 'vitest';
import { pointsTrend, relativeTrend } from './trend';

describe('relativeTrend', () => {
  it('shows the percent change and judges it by the polarity of the indicator', () => {
    expect(relativeTrend(1_040, 1_000, 'higher-is-better')).toEqual({
      direction: 'up',
      label: '↑ 4 %',
      description: 'Sube 4 % frente al período anterior',
      tone: 'good',
    });
    expect(relativeTrend(800, 1_000, 'higher-is-better')).toMatchObject({ direction: 'down', label: '↓ 20 %', tone: 'bad' });
    expect(relativeTrend(800, 1_000, 'lower-is-better')).toMatchObject({ direction: 'down', tone: 'good' });
    expect(relativeTrend(1_200, 1_000, 'lower-is-better')).toMatchObject({ direction: 'up', tone: 'bad' });
  });

  it('has no good or bad side for a neutral indicator', () => {
    expect(relativeTrend(1_200, 1_000, 'neutral')).toMatchObject({ direction: 'up', tone: 'neutral' });
  });

  it('calls a tiny change "igual"', () => {
    expect(relativeTrend(1_002, 1_000, 'higher-is-better')).toEqual({
      direction: 'flat',
      label: '= igual',
      description: 'Sin cambio frente al período anterior',
      tone: 'neutral',
    });
  });

  it('has nothing to compare without a previous period or with one at zero', () => {
    expect(relativeTrend(10, null, 'neutral')).toBeNull();
    expect(relativeTrend(10, undefined, 'neutral')).toBeNull();
    expect(relativeTrend(10, 0, 'neutral')).toBeNull();
  });
});

describe('pointsTrend', () => {
  it('shows the change of a ratio in percentage points', () => {
    expect(pointsTrend(0.22, 0.18, 'lower-is-better')).toMatchObject({ direction: 'up', label: '↑ 4 pts', tone: 'bad' });
    expect(pointsTrend(0.9, 0.8, 'higher-is-better')).toMatchObject({ direction: 'up', label: '↑ 10 pts', tone: 'good' });
  });

  it('has nothing to compare when either ratio is unknown', () => {
    expect(pointsTrend(null, 0.5, 'neutral')).toBeNull();
    expect(pointsTrend(0.5, null, 'neutral')).toBeNull();
    expect(pointsTrend(0.5, undefined, 'neutral')).toBeNull();
  });
});
