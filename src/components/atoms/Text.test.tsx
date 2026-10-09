import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Text } from './Text';

describe('Text', () => {
  it('renders a paragraph in the body scale by default', () => {
    render(<Text>Hola</Text>);

    expect(screen.getByText('Hola').tagName).toBe('P');
    expect(screen.getByText('Hola')).toHaveClass('font-sans', 'text-body', 'font-normal');
  });

  it('uses the display font and a semibold weight for headings', () => {
    render(<Text variant="h2">Inicia sesión</Text>);

    const heading = screen.getByRole('heading', { level: 2, name: 'Inicia sesión' });
    expect(heading).toHaveClass('font-display', 'text-h2', 'font-semibold');
  });

  it('decouples the HTML element from the style with `as`', () => {
    render(
      <Text variant="h2" as="h1">
        Panel
      </Text>,
    );

    expect(screen.getByRole('heading', { level: 1, name: 'Panel' })).toHaveClass('text-h2');
  });

  it('lets the caller override the weight', () => {
    render(
      <Text variant="mono" weight="bold">
        $420.000
      </Text>,
    );

    expect(screen.getByText('$420.000')).toHaveClass('font-mono', 'font-bold');
  });

  it('has a page-title scale in the display font', () => {
    render(<Text variant="title">Resumen</Text>);

    expect(screen.getByRole('heading', { level: 1, name: 'Resumen' })).toHaveClass('font-display', 'text-title', 'font-semibold');
  });
});
