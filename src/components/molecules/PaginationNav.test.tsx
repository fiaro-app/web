import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { PaginationNav } from './PaginationNav';

const hrefFor = (page: number) => `/lista?pagina=${String(page)}`;

describe('PaginationNav', () => {
  it('offers only the next page on the first', () => {
    render(<PaginationNav page={1} pages={3} summary="Página 1 de 3" hrefFor={hrefFor} />);
    expect(screen.getByText('Página 1 de 3')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Siguiente' })).toHaveAttribute('href', '/lista?pagina=2');
    expect(screen.queryByRole('link', { name: 'Anterior' })).not.toBeInTheDocument();
  });

  it('offers both in the middle and only previous on the last', () => {
    const { rerender } = render(<PaginationNav page={2} pages={3} summary="s" hrefFor={hrefFor} />);
    expect(screen.getByRole('link', { name: 'Anterior' })).toHaveAttribute('href', '/lista?pagina=1');
    expect(screen.getByRole('link', { name: 'Siguiente' })).toBeInTheDocument();
    rerender(<PaginationNav page={3} pages={3} summary="s" hrefFor={hrefFor} />);
    expect(screen.queryByRole('link', { name: 'Siguiente' })).not.toBeInTheDocument();
  });

  it('accepts custom labels', () => {
    render(<PaginationNav page={2} pages={3} summary="s" hrefFor={hrefFor} previousLabel="Atrás" nextLabel="Adelante" />);
    expect(screen.getByRole('link', { name: 'Atrás' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Adelante' })).toBeInTheDocument();
  });
});
