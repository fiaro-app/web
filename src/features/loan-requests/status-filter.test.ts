import { describe, expect, it } from 'vitest';
import { loanRequestStatusParam, parseLoanRequestStatusParam } from './status-filter';

describe('parseLoanRequestStatusParam', () => {
  it('opens on the pending ones when there is no or an unknown status', () => {
    expect(parseLoanRequestStatusParam(undefined)).toBe('PENDING');
    expect(parseLoanRequestStatusParam('NOPE')).toBe('PENDING');
    expect(parseLoanRequestStatusParam(['APPROVED'])).toBe('PENDING');
  });

  it('accepts a known status', () => {
    expect(parseLoanRequestStatusParam('APPROVED')).toBe('APPROVED');
    expect(parseLoanRequestStatusParam('REJECTED')).toBe('REJECTED');
  });

  it('TODOS means every status', () => {
    expect(parseLoanRequestStatusParam('TODOS')).toBeNull();
  });
});

describe('loanRequestStatusParam', () => {
  it('writes the status back to the URL, and TODOS for every status', () => {
    expect(loanRequestStatusParam('REJECTED')).toBe('REJECTED');
    expect(loanRequestStatusParam(null)).toBe('TODOS');
  });
});
