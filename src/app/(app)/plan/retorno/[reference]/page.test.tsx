import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import CheckoutReturnPage from './page';

vi.mock('@/components/organisms/CheckoutResult', () => ({
  CheckoutResult: ({ reference }: { reference: string }) => <p>orden:{reference}</p>,
}));

describe('Checkout return page', () => {
  it('waits for the order named in the address, not for what Wompi sends', async () => {
    render(await CheckoutReturnPage({ params: Promise.resolve({ reference: 'fiaro-abc' }) } as never));

    expect(screen.getByText('orden:fiaro-abc')).toBeInTheDocument();
  });
});
