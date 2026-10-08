import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Button } from './Button';

describe('Button', () => {
  it('renders its children and responds to a click', async () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Guardar</Button>);

    await userEvent.click(screen.getByRole('button', { name: 'Guardar' }));

    expect(onClick).toHaveBeenCalledOnce();
  });

  it('disables itself and shows a spinner while loading, without calling onClick', async () => {
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

  it('disabled takes effect even without loading', () => {
    render(<Button disabled>Guardar</Button>);

    expect(screen.getByRole('button', { name: 'Guardar' })).toBeDisabled();
  });

  it('caps the loading spinner at size "md" even on a "lg" button', () => {
    render(
      <Button loading size="lg">
        Guardar
      </Button>,
    );

    const spinner = screen.getByRole('button', { name: 'Guardar' }).querySelector('span');
    expect(spinner).toHaveClass('size-5');
  });
});
