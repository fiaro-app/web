import { describe, expect, it } from 'vitest';
import { notificationHref } from './notification-link';

const ID = '0192f0a4-7c3e-7000-8000-000000000001';

describe('notificationHref', () => {
  it.each([
    ['DAILY_SETTLEMENT', `/cuadres/${ID}`],
    ['LOAN', `/prestamos/${ID}`],
    ['CLIENT', `/clientes/${ID}`],
    ['MEMBERSHIP', `/cobradores/${ID}`],
  ] as const)('links %s to its screen', (type, href) => {
    expect(notificationHref(type, ID)).toBe(href);
  });

  it('has no link for a subscription, which has no screen yet', () => {
    expect(notificationHref('SUBSCRIPTION', ID)).toBeNull();
  });

  it('has no link without an entity', () => {
    expect(notificationHref(null, null)).toBeNull();
    expect(notificationHref('LOAN', null)).toBeNull();
    expect(notificationHref(null, ID)).toBeNull();
  });

  it('refuses an id that is not shaped like a UUID', () => {
    expect(notificationHref('LOAN', '../../login')).toBeNull();
    expect(notificationHref('LOAN', `${ID}?x=1`)).toBeNull();
  });
});
