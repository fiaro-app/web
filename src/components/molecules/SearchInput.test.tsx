import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { SearchInput } from './SearchInput';

describe('SearchInput', () => {
  it('is named by its placeholder and accepts text', async () => {
    render(<SearchInput placeholder="Buscar cliente..." />);
    const input = screen.getByRole('searchbox', { name: 'Buscar cliente...' });

    await userEvent.type(input, 'Marta');

    expect(input).toHaveValue('Marta');
  });

  it('prefers an explicit aria-label', () => {
    render(<SearchInput aria-label="Clientes" />);

    expect(screen.getByRole('searchbox', { name: 'Clientes' })).toBeInTheDocument();
  });
});
