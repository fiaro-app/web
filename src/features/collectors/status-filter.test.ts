import { describe, expect, it } from 'vitest';
import { parseCollectorStatusParam, toMembershipStatus } from './status-filter';

describe('collector status filter', () => {
  it('opens on the active ones unless inactive or all are asked for', () => {
    expect(parseCollectorStatusParam(undefined)).toBe('activos');
    expect(parseCollectorStatusParam('otro')).toBe('activos');
    expect(parseCollectorStatusParam(['todos'])).toBe('activos');
    expect(parseCollectorStatusParam('inactivos')).toBe('inactivos');
    expect(parseCollectorStatusParam('todos')).toBe('todos');
  });

  it('maps to the membership status the API filters by', () => {
    expect(toMembershipStatus('activos')).toBe('ACTIVE');
    expect(toMembershipStatus('inactivos')).toBe('INACTIVE');
    expect(toMembershipStatus('todos')).toBeUndefined();
  });
});
