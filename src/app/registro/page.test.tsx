import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import RegisterPage, { metadata } from './page';

vi.mock('next/navigation', () => ({ useRouter: () => ({ replace: vi.fn(), refresh: vi.fn() }) }));

describe('Register page', () => {
  it('is kept out of search engines', () => {
    expect(metadata.robots).toEqual({ index: false, follow: false });
  });

  it('renders the registration form', () => {
    render(<RegisterPage />);

    expect(screen.getByRole('form', { name: 'Registro' })).toBeInTheDocument();
  });
});
