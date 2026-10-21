import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import Home from './page';

describe('Landing (Home)', () => {
  it('has a single h1 and every section of the design', () => {
    render(<Home />);

    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1);
    expect(screen.getByRole('region', { name: /Todo lo que tu cuaderno/ })).toHaveAttribute('id', 'producto');
    expect(screen.getByRole('region', { name: /3 pasos/ })).toHaveAttribute('id', 'como-funciona');
    expect(screen.getByRole('region', { name: /Un plan para cada tamaño/ })).toHaveAttribute('id', 'precios');
    expect(screen.getAllByRole('article')).not.toHaveLength(0);
    expect(screen.getByRole('contentinfo')).toBeInTheDocument();
  });

  it('offers the three plans, with the middle one as the recommended', () => {
    render(<Home />);

    for (const plan of ['Individual', 'Pro', 'Team']) {
      expect(screen.getByRole('heading', { level: 3, name: plan })).toBeInTheDocument();
    }
  });

  it('sends "Contacto" and "Contactar ventas" to the contact page', () => {
    render(<Home />);

    for (const link of screen.getAllByRole('link', { name: /^Contacto$|^Contactar ventas$/ })) {
      expect(link).toHaveAttribute('href', '/contacto');
    }
  });

  it('points every "Comenzar gratis" at the signup route', () => {
    render(<Home />);

    for (const link of screen.getAllByRole('link', { name: 'Comenzar gratis' })) {
      expect(link).toHaveAttribute('href', '/registro');
    }
  });
});

describe('Landing structured data', () => {
  it('declares the organization and the application with its priced plans for search engines', () => {
    const { container } = render(<Home />);

    const script = container.querySelector('script[type="application/ld+json"]');
    const nodes = JSON.parse(script?.textContent ?? '[]') as { '@type': string; offers?: unknown[] }[];

    expect(nodes.map((node) => node['@type'])).toEqual(['Organization', 'WebSite', 'SoftwareApplication', 'FAQPage']);
    const appNode = nodes.find((node) => node['@type'] === 'SoftwareApplication');
    expect(appNode?.offers).toHaveLength(3);
  });

  it('marks up the same questions the page shows', () => {
    const { container } = render(<Home />);
    const nodes = JSON.parse(container.querySelector('script[type="application/ld+json"]')?.textContent ?? '[]') as {
      '@type': string;
      mainEntity?: { name: string }[];
    }[];
    const questions = nodes.find((node) => node['@type'] === 'FAQPage')?.mainEntity?.map((entry) => entry.name) ?? [];

    expect(questions.length).toBeGreaterThan(0);
    for (const question of questions) expect(container).toHaveTextContent(question);
  });
});
