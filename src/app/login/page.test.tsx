import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import LoginPage, { metadata } from './page';

vi.mock('next/navigation', () => ({ useRouter: () => ({ replace: vi.fn(), refresh: vi.fn() }) }));

async function renderPage(searchParams: Record<string, string | string[] | undefined> = {}) {
  render(await LoginPage({ searchParams: Promise.resolve(searchParams) } as never));
}

describe('Login page', () => {
  it('defines canonical and open graph metadata for search engines', () => {
    expect(metadata.robots).toEqual({ index: true, follow: true });
    expect(metadata.alternates).toEqual({ canonical: '/login' });
    expect(metadata.openGraph).toMatchObject({ url: '/login' });
  });

  it('renders the form with its brand panel and the link to register', async () => {
    await renderPage();

    expect(screen.getByRole('heading', { level: 1, name: 'Inicia sesión' })).toBeInTheDocument();
    expect(screen.getByText('Tu cartera, siempre bajo control')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Regístrate gratis' })).toHaveAttribute('href', '/registro');
  });
});
