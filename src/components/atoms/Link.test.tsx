import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Link } from './Link';

describe('Link', () => {
  it('renders an anchor pointing at href', () => {
    render(<Link href="/recuperar">¿Olvidaste tu contraseña?</Link>);

    expect(screen.getByRole('link', { name: '¿Olvidaste tu contraseña?' })).toHaveAttribute(
      'href',
      '/recuperar',
    );
  });

  it('merges a custom className', () => {
    render(
      <Link href="/" className="extra">
        Inicio
      </Link>,
    );

    expect(screen.getByRole('link')).toHaveClass('extra', 'text-primary');
  });

  it('is 14px by default and takes the size it is given', () => {
    const { rerender } = render(<Link href="/">Inicio</Link>);
    expect(screen.getByRole('link')).toHaveClass('text-label');

    rerender(
      <Link href="/" size="caption">
        Inicio
      </Link>,
    );
    expect(screen.getByRole('link')).toHaveClass('text-caption');
    expect(screen.getByRole('link')).not.toHaveClass('text-label');
  });
});
