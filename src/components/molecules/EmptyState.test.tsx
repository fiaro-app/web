import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { EmptyState } from './EmptyState';

describe('EmptyState', () => {
  it('shows title and description', () => {
    render(<EmptyState title="Sin clientes" description="Aparecerán aquí." />);

    expect(screen.getByRole('heading', { name: 'Sin clientes' })).toBeInTheDocument();
    expect(screen.getByText('Aparecerán aquí.')).toBeInTheDocument();
  });

  it('renders the optional action', () => {
    render(
      <EmptyState title="Sin clientes" description="x" action={<button>Registrar</button>} />,
    );

    expect(screen.getByRole('button', { name: 'Registrar' })).toBeInTheDocument();
  });
});
