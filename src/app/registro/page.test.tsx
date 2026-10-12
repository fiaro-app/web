import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import RegisterPage, { metadata } from './page';

vi.mock('next/navigation', () => ({ useRouter: () => ({ replace: vi.fn(), refresh: vi.fn() }) }));

describe('Register page', () => {
  it('defines canonical and open graph metadata for search engines', () => {
    expect(metadata.robots).toEqual({ index: true, follow: true });
    expect(metadata.alternates).toEqual({ canonical: '/registro' });
    expect(metadata.openGraph).toMatchObject({ url: '/registro' });
  });

  it('renders the registration form', () => {
    render(<RegisterPage />);

    expect(screen.getByRole('form', { name: 'Registro' })).toBeInTheDocument();
  });
});
