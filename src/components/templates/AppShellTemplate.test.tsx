import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

vi.mock('next/navigation', () => ({ usePathname: () => '/resumen' }));
import { AppShellTemplate } from './AppShellTemplate';

describe('AppShellTemplate', () => {
  it('shows the sidebar next to the main content', () => {
    render(
      <AppShellTemplate sidebar={<aside>lateral</aside>}>
        <p>contenido</p>
      </AppShellTemplate>,
    );

    expect(screen.getByRole('complementary')).toHaveTextContent('lateral');
    expect(screen.getByRole('main')).toHaveTextContent('contenido');
  });

  it('offers a menu button for narrow screens without repeating the sidebar while it is closed', () => {
    render(
      <AppShellTemplate sidebar={<aside>lateral</aside>}>
        <p>contenido</p>
      </AppShellTemplate>,
    );

    expect(screen.getByRole('button', { name: 'Abrir menú' })).toBeInTheDocument();
    expect(screen.getAllByText('lateral')).toHaveLength(1);
  });
});
