import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import RootError from './error';

describe('RootError', () => {
  it('says something went wrong and retries', async () => {
    const retry = vi.fn();
    render(<RootError error={new Error('x')} retry={retry} />);

    expect(screen.getByText('Algo salió mal')).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Reintentar' }));
    expect(retry).toHaveBeenCalledTimes(1);
  });
});
