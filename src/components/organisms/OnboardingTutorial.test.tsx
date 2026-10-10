import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { OnboardingTutorial } from './OnboardingTutorial';

beforeEach(() => {
  window.localStorage.clear();
  window.ResizeObserver ??= class {
    observe() {}
    disconnect() {}
    unobserve() {}
  };
  Element.prototype.scrollIntoView ??= vi.fn();
});

const NAV = ['/resumen', '/clientes'];

describe('OnboardingTutorial', () => {
  it('asks the first-time visitor if they want the tutorial', () => {
    render(<OnboardingTutorial userId="u1" navHrefs={NAV} />);

    expect(screen.getByRole('heading', { name: '¡Bienvenido a Fiaro!' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Sí, mostrarme' })).toBeInTheDocument();
  });

  it('starts the tour on yes and walks it to the end', async () => {
    render(<OnboardingTutorial userId="u1" navHrefs={NAV} />);
    await userEvent.click(screen.getByRole('button', { name: 'Sí, mostrarme' }));

    expect(screen.getByRole('heading', { name: 'Así se recorre el panel' })).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Siguiente' }));
    expect(screen.getByRole('heading', { name: 'Resumen' })).toBeInTheDocument();
    await userEvent.keyboard('{Escape}');
    expect(screen.queryByTestId('tutorial-tour')).not.toBeInTheDocument();
  });

  it('does not ask again once the person said not now', async () => {
    const { unmount } = render(<OnboardingTutorial userId="u1" navHrefs={NAV} />);
    await userEvent.click(screen.getByRole('button', { name: 'Ahora no' }));
    unmount();

    render(<OnboardingTutorial userId="u1" navHrefs={NAV} />);
    expect(screen.queryByRole('heading', { name: '¡Bienvenido a Fiaro!' })).not.toBeInTheDocument();
    expect(screen.queryByTestId('tutorial-tour')).not.toBeInTheDocument();
  });
});
