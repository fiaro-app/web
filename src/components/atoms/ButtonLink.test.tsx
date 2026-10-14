import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ButtonLink } from './ButtonLink';

describe('ButtonLink', () => {
  it('is a link that looks like a primary button', () => {
    render(<ButtonLink href="/registro">Comenzar gratis</ButtonLink>);

    const link = screen.getByRole('link', { name: 'Comenzar gratis' });
    expect(link).toHaveAttribute('href', '/registro');
    expect(link).toHaveClass('bg-primary', 'h-12');
  });

  it.each([
    ['outline', 'border-primary'],
    ['text', 'bg-transparent'],
    ['inverse', 'bg-surface'],
  ] as const)('applies the %s variant', (variant, expectedClass) => {
    render(
      <ButtonLink href="/" variant={variant}>
        Ir
      </ButtonLink>,
    );

    expect(screen.getByRole('link')).toHaveClass(expectedClass);
  });
});
