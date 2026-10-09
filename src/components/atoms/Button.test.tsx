import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Button } from './Button';

describe('Button', () => {
  it('renders its children and responds to a click', async () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Pagar</Button>);

    await userEvent.click(screen.getByRole('button', { name: 'Pagar' }));

    expect(onClick).toHaveBeenCalledOnce();
  });

  it('defaults to type="button" so it never submits a form by accident', () => {
    render(<Button>Pagar</Button>);

    expect(screen.getByRole('button')).toHaveAttribute('type', 'button');
  });

  it('applies the style of each variant', () => {
    const { rerender } = render(<Button variant="primary">Pagar</Button>);
    expect(screen.getByRole('button')).toHaveClass('bg-primary');

    rerender(<Button variant="outline">Pagar</Button>);
    expect(screen.getByRole('button')).toHaveClass('border-primary');

    rerender(<Button variant="text">Pagar</Button>);
    expect(screen.getByRole('button')).toHaveClass('bg-transparent');
  });

  it('does not call onClick when disabled', async () => {
    const onClick = vi.fn();
    render(
      <Button disabled onClick={onClick}>
        Pagar
      </Button>,
    );

    await userEvent.click(screen.getByRole('button'));

    expect(screen.getByRole('button')).toBeDisabled();
    expect(onClick).not.toHaveBeenCalled();
  });

  it('disables itself while loading, keeping its label (hidden) so the size does not change', async () => {
    const onClick = vi.fn();
    render(
      <Button loading onClick={onClick}>
        Guardar
      </Button>,
    );

    const button = screen.getByRole('button', { name: 'Guardar' });
    expect(button).toBeDisabled();
    expect(button).toHaveAttribute('aria-busy', 'true');
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
    await userEvent.click(button);
    expect(onClick).not.toHaveBeenCalled();
  });

  it('stays disabled when loading finishes but disabled is still set', () => {
    render(
      <Button disabled loading={false}>
        Guardar
      </Button>,
    );

    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('renders both icons when not loading', () => {
    render(
      <Button leftIcon={<i data-testid="left" />} rightIcon={<i data-testid="right" />}>
        Siguiente
      </Button>,
    );

    expect(screen.getByTestId('left')).toBeInTheDocument();
    expect(screen.getByTestId('right')).toBeInTheDocument();
  });
});

describe('Button size', () => {
  it('is 48px by default and 44px when small', () => {
    const { rerender } = render(<Button>Pagar</Button>);
    expect(screen.getByRole('button')).toHaveClass('h-12');

    rerender(<Button size="sm">Pagar</Button>);
    expect(screen.getByRole('button')).toHaveClass('h-11');
  });
});
