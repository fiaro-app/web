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
});
