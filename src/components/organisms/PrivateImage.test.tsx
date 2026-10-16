import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { PrivateImage } from '@/components/organisms/PrivateImage';

const hook = vi.hoisted(() => vi.fn());
vi.mock('@/features/attachments/use-attachment', () => ({ useAttachment: hook }));

const base = { status: 'ready', url: null, isBusy: false, error: null, notice: null, chooseFile: vi.fn(), remove: vi.fn(), retry: vi.fn() };
const props = { target: 'clientPhoto', id: 'c1', title: 'Foto', description: 'd', alt: 'Foto de Ana', none: 'Sin foto', canEdit: true } as const;

describe('PrivateImage', () => {
  it('shows the loading state', () => {
    hook.mockReturnValue({ ...base, status: 'loading' });
    render(<PrivateImage {...props} />);
    expect(screen.getByRole('status')).toHaveTextContent('Cargando imagen');
  });

  it('shows an error with a retry button', () => {
    hook.mockReturnValue({ ...base, status: 'error' });
    render(<PrivateImage {...props} />);
    expect(screen.getByText(/No pudimos cargar/)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Reintentar' })).toBeInTheDocument();
  });

  it('shows the empty state with an upload button', () => {
    hook.mockReturnValue(base);
    render(<PrivateImage {...props} />);
    expect(screen.getByText('Sin foto')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Subir imagen' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Quitar imagen' })).not.toBeInTheDocument();
  });

  it('shows the image with its alt and the change and remove actions', () => {
    hook.mockReturnValue({ ...base, url: 'https://s/x' });
    render(<PrivateImage {...props} />);
    expect(screen.getByRole('img', { name: 'Foto de Ana' })).toHaveAttribute('src', 'https://s/x');
    expect(screen.getByRole('button', { name: 'Cambiar imagen' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Quitar imagen' })).toBeInTheDocument();
  });

  it('hides the actions when it cannot edit', () => {
    hook.mockReturnValue({ ...base, url: 'https://s/x' });
    render(<PrivateImage {...props} canEdit={false} />);
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });
});
