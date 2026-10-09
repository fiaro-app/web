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

  it('fills the content area by default and is a small card when compact', () => {
    const { container, rerender } = render(<EmptyState title="Sin clientes" description="x" />);
    expect(container.firstElementChild).toHaveClass('min-h-[calc(100vh-10rem)]');

    rerender(<EmptyState title="Sin clientes" description="x" size="compact" />);
    expect(container.firstElementChild).not.toHaveClass('min-h-[calc(100vh-10rem)]');
  });

  it('paints the "!" icon as an error alert', () => {
    render(<EmptyState title="Sin acceso" description="x" icon="!" />);

    expect(screen.getByText('!')).toHaveClass('text-destructive');
  });
});
