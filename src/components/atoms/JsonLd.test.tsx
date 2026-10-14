import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { JsonLd } from './JsonLd';

describe('JsonLd', () => {
  it('renders the data as an application/ld+json script', () => {
    const { container } = render(<JsonLd data={{ '@type': 'Organization', name: 'Fiaro' }} />);

    const script = container.querySelector('script[type="application/ld+json"]');
    expect(JSON.parse(script?.textContent ?? '')).toEqual({ '@type': 'Organization', name: 'Fiaro' });
  });
});
