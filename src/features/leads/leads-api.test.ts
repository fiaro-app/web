import { beforeEach, describe, expect, it, vi } from 'vitest';
import { leadEndpoints } from './endpoints';

const { callEndpoint } = vi.hoisted(() => ({ callEndpoint: vi.fn() }));
vi.mock('@/lib/api', async (importOriginal) => ({ ...(await importOriginal<typeof import('@/lib/api')>()), callEndpoint }));

import { sendLead } from './leads-api';

beforeEach(() => {
  vi.clearAllMocks();
  callEndpoint.mockResolvedValue({ received: true });
});

describe('leads api', () => {
  it('sends the lead as the body of the public endpoint', async () => {
    await sendLead({ name: 'Ana', phone: '+573001234567', message: 'Hola, quiero probar.' });

    expect(callEndpoint).toHaveBeenCalledWith(leadEndpoints.create, {
      body: { name: 'Ana', phone: '+573001234567', message: 'Hola, quiero probar.' },
    });
  });

  it('declares a public POST /leads that accepts the decoy field and rejects unknown ones', () => {
    expect(leadEndpoints.create).toMatchObject({ method: 'POST', path: '/leads' });
    expect(leadEndpoints.create.body.safeParse({ name: 'Ana', email: 'a@b.co', message: 'x', website: '' }).success).toBe(true);
    expect(leadEndpoints.create.body.safeParse({ name: 'Ana', message: 'x', admin: true }).success).toBe(false);
  });
});
