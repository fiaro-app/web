import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

vi.mock('next/navigation', () => ({ useRouter: () => ({ refresh: vi.fn() }) }));

import { LogoForm } from './LogoForm';

describe('LogoForm', () => {
  it('shows the logo and offers to change or remove it', () => {
    render(<LogoForm businessName="Buen Vecino" logoUrl="https://cdn.fiaro.co/l.png" canEdit uploadAvailable />);

    expect(screen.getByRole('img', { name: /Buen Vecino/ })).toHaveAttribute('src', 'https://cdn.fiaro.co/l.png');
    expect(screen.getByRole('button', { name: 'Cambiar logo' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Quitar logo' })).toBeInTheDocument();
  });

  it('offers to upload when there is no logo yet', () => {
    render(<LogoForm businessName="Buen Vecino" logoUrl={null} canEdit uploadAvailable />);

    expect(screen.getByText('Todavía no tienes un logo.')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Subir logo' })).toBeInTheDocument();
  });

  it('explains that uploads are not configured instead of offering them', () => {
    render(<LogoForm businessName="Buen Vecino" logoUrl={null} canEdit uploadAvailable={false} />);

    expect(screen.getByText(/no está configurada/)).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Subir logo' })).not.toBeInTheDocument();
  });

  it('shows no actions to someone who cannot edit', () => {
    render(<LogoForm businessName="Buen Vecino" logoUrl={null} canEdit={false} uploadAvailable />);

    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });
});
