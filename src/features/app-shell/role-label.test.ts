import { describe, expect, it } from 'vitest';
import { ADMIN_LABEL, COLLECTOR_LABEL, roleLabel } from './role-label';

describe('roleLabel', () => {
  it.each([
    [['OWNER'], ADMIN_LABEL],
    [['LENDER'], ADMIN_LABEL],
    [['OWNER', 'LENDER', 'COLLECTOR'], ADMIN_LABEL],
    [['COLLECTOR'], COLLECTOR_LABEL],
    [[], null],
  ] as const)('labels %j as %s', (roles, label) => {
    expect(roleLabel(roles)).toBe(label);
  });
});
