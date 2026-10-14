import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { START_PAGE_GUIDE_EVENT } from '@/features/tutorial/tutorial-storage';
import { OnboardingTutorial } from './OnboardingTutorial';

const pathname = vi.hoisted(() => ({ current: '/clientes' }));
vi.mock('next/navigation', () => ({ usePathname: () => pathname.current }));

beforeEach(() => {
  pathname.current = '/clientes';
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

  it('guides only the controls of the screen that are visible', async () => {
    window.localStorage.setItem('fiaro:tutorial:v1:u1', 'x');
    const content = document.createElement('main');
    content.id = 'contenido';
    const link = document.createElement('a');
    link.setAttribute('href', '/clientes/nuevo');
    const header = document.createElement('header');
    header.append(link);
    content.append(header);
    link.getClientRects = () => [{}] as unknown as DOMRectList;
    link.getBoundingClientRect = () => ({ top: 10, left: 10, width: 100, height: 40, right: 110, bottom: 50, x: 10, y: 10, toJSON: () => ({}) });
    document.body.append(content);
    render(<OnboardingTutorial userId="u1" navHrefs={NAV} />);

    act(() => {
      window.dispatchEvent(new Event(START_PAGE_GUIDE_EVENT));
    });

    expect(await screen.findByTestId('tutorial-tour')).toBeInTheDocument();
    expect(screen.getByText(/1 de 1|1 \/ 1/)).toBeInTheDocument();
    content.remove();
  });
});
