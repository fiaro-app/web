import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { AboutSection } from './AboutSection';

describe('AboutSection', () => {
  it('is a labelled region with one heading and list per column', () => {
    render(
      <AboutSection
        id="que-es-fiaro"
        eyebrow="Qué es Fiaro"
        title="Reglas claras"
        subtitle="Lo que hace y lo que no."
        columns={[
          { title: 'Lo que hace', items: ['a', 'b'] },
          { title: 'Lo que no hace', items: ['c'] },
        ]}
      />,
    );

    expect(screen.getByRole('region', { name: 'Reglas claras' })).toHaveAttribute('id', 'que-es-fiaro');
    expect(screen.getAllByRole('heading', { level: 3 })).toHaveLength(2);
    expect(screen.getAllByRole('listitem')).toHaveLength(3);
  });
});
