import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import LoginPage, { metadata } from './page';

vi.mock('next/navigation', () => ({ useRouter: () => ({ replace: vi.fn(), refresh: vi.fn() }) }));

async function renderPage(searchParams: Record<string, string | string[] | undefined> = {}) {
  render(await LoginPage({ searchParams: Promise.resolve(searchParams) } as never));
}

describe('Login page', () => {
  it('is kept out of search engines', () => {
    expect(metadata.robots).toEqual({ index: false, follow: false });
  });

  it('renders the form with its brand panel and the link to register', async () => {
    await renderPage();

    expect(screen.getByRole('heading', { level: 1, name: 'Inicia sesión' })).toBeInTheDocument();
    expect(screen.getByText('Tu cartera, siempre bajo control')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Regístrate gratis' })).toHaveAttribute('href', '/registro');
  });
});
