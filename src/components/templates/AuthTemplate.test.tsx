import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { AuthTemplate } from './AuthTemplate';

describe('AuthTemplate', () => {
  it('places the form in <main> and the brand panel in a complementary region', () => {
    render(
      <AuthTemplate nav={<header>nav</header>} panel={<p>marca</p>}>
        <form aria-label="Acceso" />
      </AuthTemplate>,
    );

    expect(screen.getByRole('main')).toContainElement(screen.getByRole('form', { name: 'Acceso' }));
    expect(screen.getByText('marca').closest('aside')).toBeInTheDocument();
    expect(screen.getByRole('banner')).toBeInTheDocument();
  });
});
