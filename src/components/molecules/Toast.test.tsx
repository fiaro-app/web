import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Toast } from './Toast';

describe('Toast', () => {
  it('shows the message', () => {
    render(<Toast message="Guardado, pendiente de sync" />);

    expect(screen.getByRole('status')).toHaveTextContent('Guardado, pendiente de sync');
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('runs the action when pressed', async () => {
    const onAction = vi.fn();
    render(<Toast message="Error" actionLabel="Reintentar" onAction={onAction} />);

    await userEvent.click(screen.getByRole('button', { name: 'Reintentar' }));

    expect(onAction).toHaveBeenCalledOnce();
  });

  it('hides the action when there is no handler', () => {
    render(<Toast message="Error" actionLabel="Reintentar" />);

    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });
});
