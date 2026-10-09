import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import ContactPage, { metadata } from './page';

describe('Contact page', () => {
  it('has one h1, the form and the "what happens next" aside', () => {
    render(<ContactPage />);

    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1);
    expect(screen.getByRole('heading', { level: 1, name: 'Hablemos de tu cartera' })).toBeInTheDocument();
    expect(screen.getByRole('form', { name: 'Contactar ventas' })).toBeInTheDocument();
    expect(screen.getByRole('complementary', { hidden: true })).toBeInTheDocument();
    expect(screen.getByRole('contentinfo')).toBeInTheDocument();
  });

  it('points the navigation anchors back to the landing sections', () => {
    render(<ContactPage />);

    expect(screen.getAllByRole('link', { name: 'Precios' })[0]).toHaveAttribute('href', '/#precios');
  });

  it('is indexable, with its own title, description and canonical URL', () => {
    expect(metadata).toMatchObject({ title: 'Contactar ventas', alternates: { canonical: '/contacto' } });
    expect(metadata.robots).toBeUndefined();
    expect(String(metadata.description).length).toBeGreaterThan(50);
  });
});
