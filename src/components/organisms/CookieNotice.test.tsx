import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it } from 'vitest';
import { CookieNotice } from './CookieNotice';

describe('CookieNotice', () => {
  beforeEach(() => localStorage.clear());

  it('informs, links to the policy and remembers when it is closed', async () => {
    render(<CookieNotice />);

    expect(screen.getByText(/solo cookies necesarias/)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Más información' })).toHaveAttribute('href', '/cookies');

    await userEvent.click(screen.getByRole('button', { name: 'Entendido' }));

    expect(screen.queryByRole('region', { name: 'Aviso de cookies' })).not.toBeInTheDocument();
    expect(localStorage.getItem('fiaro-cookie-notice')).toBe('1');
  });

  it('stays hidden once it was dismissed', () => {
    localStorage.setItem('fiaro-cookie-notice', '1');
    render(<CookieNotice />);

    expect(screen.queryByRole('region', { name: 'Aviso de cookies' })).not.toBeInTheDocument();
  });
});
