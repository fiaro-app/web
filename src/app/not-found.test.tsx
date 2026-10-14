import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import NotFound, { metadata } from './not-found';

describe('404 page', () => {
  it('is kept out of search engines', () => {
    expect(metadata.robots).toEqual({ index: false, follow: false });
  });

  it('explains what happened and links back home', () => {
    render(<NotFound />);

    expect(screen.getByRole('heading', { name: 'No encontramos esa página' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Volver al inicio' })).toHaveAttribute('href', '/');
  });
});
