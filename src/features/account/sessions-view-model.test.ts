import { describe, expect, it } from 'vitest';
import type { AccountSession } from './endpoints';
import { toSessionRows } from './sessions-view-model';

const session = (id: string, overrides: Partial<AccountSession> = {}): AccountSession => ({
  id,
  isCurrent: false,
  device: { client: 'Chrome', os: 'Windows', label: 'Chrome en Windows' },
  ipAddress: '203.0.113.7',
  createdAt: '2026-10-01T10:00:00.000Z',
  lastUsedAt: '2026-10-05T15:00:00.000Z',
  expiresAt: '2026-11-04T15:00:00.000Z',
  ...overrides,
});

describe('toSessionRows', () => {
  it('puts the current session first and then the most recently used', () => {
    const rows = toSessionRows([
      session('old', { lastUsedAt: '2026-10-02T15:00:00.000Z' }),
      session('recent', { lastUsedAt: '2026-10-08T15:00:00.000Z' }),
      session('current', { isCurrent: true, lastUsedAt: '2026-10-01T15:00:00.000Z' }),
    ]);

    expect(rows.map((row) => row.id)).toEqual(['current', 'recent', 'old']);
    expect(rows[0]).toMatchObject({ isCurrent: true, device: 'Chrome en Windows' });
  });

  it('describes the IP and the last use as read in Colombia, with or without IP', () => {
    const [withIp, withoutIp] = toSessionRows([session('a'), session('b', { ipAddress: null, lastUsedAt: '2026-10-04T15:00:00.000Z' })]);

    expect(withIp?.detail).toBe('IP 203.0.113.7 · Último uso 05/10/2026');
    expect(withoutIp?.detail).toBe('Último uso 04/10/2026');
  });
});
