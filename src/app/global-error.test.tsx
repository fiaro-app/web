import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import GlobalError from './global-error';

describe('GlobalError', () => {
  it('offers to retry', async () => {
    const retry = vi.fn();
    render(<GlobalError error={new Error('x')} retry={retry} />, { container: document });

    expect(screen.getByRole('heading', { name: 'Algo salió mal' })).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Reintentar' }));
    expect(retry).toHaveBeenCalledTimes(1);
  });
});
