import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { ErrorState } from './ErrorState';

describe('ErrorState', () => {
  it('says something went wrong and lets the person retry', async () => {
    const onRetry = vi.fn();
    render(<ErrorState onRetry={onRetry} />);

    expect(screen.getByRole('heading', { name: 'Algo salió mal' })).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Reintentar' }));

    expect(onRetry).toHaveBeenCalledOnce();
  });

  it('accepts its own message', () => {
    render(<ErrorState onRetry={() => {}} title="Sin conexión" description="Revisa tu internet." />);

    expect(screen.getByRole('heading', { name: 'Sin conexión' })).toBeInTheDocument();
    expect(screen.getByText('Revisa tu internet.')).toBeInTheDocument();
  });
});
