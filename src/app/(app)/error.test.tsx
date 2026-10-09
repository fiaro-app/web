import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import AppError from './error';

describe('Private error boundary', () => {
  it('offers to retry and never shows the technical message', async () => {
    const retry = vi.fn();
    render(<AppError error={new Error('SELECT * FROM secretos')} retry={retry} />);

    expect(screen.queryByText(/SELECT/)).not.toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Reintentar' }));

    expect(retry).toHaveBeenCalledOnce();
  });
});
