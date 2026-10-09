import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
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
});
