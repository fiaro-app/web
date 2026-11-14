import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import NewAdminPage from './page';

vi.mock('@/components/organisms/AdminCreateScreen', () => ({ AdminCreateScreen: () => <p>formulario</p> }));

describe('New admin page', () => {
  it('renders the invitation screen', () => {
    render(<NewAdminPage />);

    expect(screen.getByText('formulario')).toBeInTheDocument();
  });
});
