import { describe, expect, it } from 'vitest';
import { ClientFormSchema, toClientChanges } from './client-schemas';
import { CreateClientBodySchema, UpdateClientBodySchema, clientEndpoints } from './endpoints';

const valid = {
  fullName: 'Carlos Andrés Gómez',
  nationalId: '1.020.304.050',
  phone: '300 123 4567',
  occupation: 'Vendedor ambulante',
  address: 'Calle 45 # 12-30, Bogotá',
};

describe('ClientFormSchema', () => {
  it('normalizes the phone to E.164 and the national id to digits', () => {
    const result = ClientFormSchema.parse(valid);
    expect(result.phone).toBe('+573001234567');
    expect(result.nationalId).toBe('1020304050');
  });

  it('accepts a landline', () => {
    expect(ClientFormSchema.parse({ ...valid, phone: '601 234 5678' }).phone).toBe('+576012345678');
  });

  it('reports a message per empty field', () => {
    const result = ClientFormSchema.safeParse({ fullName: '', nationalId: '', phone: '', occupation: '', address: '' });
    expect(result.success).toBe(false);
    expect(new Set(result.error?.issues.map((issue) => issue.path[0]))).toEqual(
      new Set(['fullName', 'nationalId', 'phone', 'occupation', 'address']),
    );
  });

  it('produces a body the API contract accepts', () => {
    expect(CreateClientBodySchema.safeParse(ClientFormSchema.parse(valid)).success).toBe(true);
  });
});

describe('toClientChanges', () => {
  const current = ClientFormSchema.parse(valid);

  it('returns only the fields that changed', () => {
    const next = ClientFormSchema.parse({ ...valid, address: 'Carrera 7 # 1-1', occupation: 'Tendero' });
    expect(toClientChanges(next, current)).toEqual({ address: 'Carrera 7 # 1-1', occupation: 'Tendero' });
  });

  it('returns null when nothing changed', () => {
    expect(toClientChanges(current, current)).toBeNull();
  });

  it('builds a PATCH body the contract accepts, and rejects an empty one', () => {
    expect(UpdateClientBodySchema.safeParse({ address: 'x' }).success).toBe(true);
    expect(UpdateClientBodySchema.safeParse({}).success).toBe(false);
  });
});

describe('client endpoints', () => {
  it('declares the four operations with the API paths', () => {
    expect(clientEndpoints.create).toMatchObject({ method: 'POST', path: '/clients' });
    expect(clientEndpoints.get).toMatchObject({ method: 'GET', path: '/clients/:id' });
    expect(clientEndpoints.list).toMatchObject({ method: 'QUERY', path: '/clients' });
    expect(clientEndpoints.update).toMatchObject({ method: 'PATCH', path: '/clients/:id' });
  });
});
