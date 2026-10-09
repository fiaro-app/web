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
    render(<EmptyState title="Sin clientes" description="x" action={<button>Registrar</button>} />);

    expect(screen.getByRole('button', { name: 'Registrar' })).toBeInTheDocument();
  });

  it('fills the content area by default and is a small card when compact', () => {
    const { container, rerender } = render(<EmptyState title="Sin clientes" description="x" />);
    expect(container.firstElementChild).toHaveClass('min-h-112');

    rerender(<EmptyState title="Sin clientes" description="x" size="compact" />);
    expect(container.firstElementChild).not.toHaveClass('min-h-112');
  });

  it('paints the icon as an error when the tone says so', () => {
    render(<EmptyState title="Sin acceso" description="x" icon="!" tone="error" />);

    expect(screen.getByText('!')).toHaveClass('text-destructive');
  });
});
