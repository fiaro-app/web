import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import AppLayout, { metadata } from './layout';

vi.mock('@/features/auth/session.server', () => ({
  requireUser: async () => ({ id: 'u1', name: 'Ana Pérez', phoneNumber: '+573001234567', contactEmail: null, mustChangePassword: false }),
}));
vi.mock('next/navigation', () => ({ useRouter: () => ({ replace: vi.fn(), refresh: vi.fn() }) }));

describe('Private layout', () => {
  it('is kept out of search engines', () => {
    expect(metadata.robots).toEqual({ index: false, follow: false });
  });

  it('shows the signed-in person, the navigation, the sign-out button and the page', async () => {
    render(await AppLayout({ children: <p>contenido</p> }));

    expect(screen.getByText('Ana Pérez')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Resumen' })).toHaveAttribute('aria-current', 'page');
    expect(screen.getByRole('button', { name: 'Cerrar sesión' })).toBeInTheDocument();
    expect(screen.getByRole('main')).toHaveTextContent('contenido');
  });
});
