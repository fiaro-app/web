import { describe, expect, it } from 'vitest';
import { describePlanLimit } from './plan-limit-message';

describe('describePlanLimit', () => {
  it.each([
    ['M003A', /cupos de cobrador/],
    ['M007A', /cupos de administrador/],
    ['L004A', /préstamos activos/],
    ['B007A', /máximo de carteras/],
    ['X999A', /uno de sus límites/],
    [null, /uno de sus límites/],
  ])('%s says which limit was reached', (errorCode, expected) => {
    expect(describePlanLimit(errorCode)).toMatch(expected);
  });
});
