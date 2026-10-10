import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { TutorialTour } from './TutorialTour';

const STEP = { id: 'nav/clientes', target: 'nav/clientes', title: 'Clientes', body: 'Es el directorio. Sirve para tener su historial.' };
const handlers = { onNext: vi.fn(), onPrevious: vi.fn(), onFinish: vi.fn() };
const props = (overrides = {}) => ({ step: STEP, index: 2, total: 8, isFirst: false, isLast: false, ...handlers, ...overrides });

beforeEach(() => {
  vi.clearAllMocks();
  window.ResizeObserver ??= class {
    observe() {}
    disconnect() {}
    unobserve() {}
  };
  Element.prototype.scrollIntoView ??= vi.fn();
});

function addTarget() {
  const element = document.createElement('a');
  element.dataset.tour = 'nav/clientes';
  element.getClientRects = () => [{}] as unknown as DOMRectList;
  element.getBoundingClientRect = () => ({ top: 200, left: 24, width: 212, height: 37, right: 236, bottom: 237, x: 24, y: 200, toJSON: () => ({}) });
  document.body.append(element);
  return element;
}

describe('TutorialTour', () => {
  it('explains the step with its counter and the buttons to move', () => {
    render(<TutorialTour {...props()} />);

    expect(screen.getByRole('dialog', { name: 'Clientes' })).toBeInTheDocument();
    expect(screen.getByText('Paso 3 de 8')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Clientes' })).toBeInTheDocument();
    expect(screen.getByText(/Sirve para tener su historial/)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Anterior' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Siguiente' })).toBeInTheDocument();
  });

  it('moves with the buttons and the keyboard, and leaves with Esc', async () => {
    render(<TutorialTour {...props()} />);

    await userEvent.click(screen.getByRole('button', { name: 'Siguiente' }));
    await userEvent.click(screen.getByRole('button', { name: 'Anterior' }));
    await userEvent.click(screen.getByRole('button', { name: 'Omitir tutorial' }));
    expect(handlers.onNext).toHaveBeenCalledTimes(1);
    expect(handlers.onPrevious).toHaveBeenCalledTimes(1);
    expect(handlers.onFinish).toHaveBeenCalledTimes(1);

    await userEvent.keyboard('{ArrowRight}{ArrowLeft}{Escape}');
    expect(handlers.onNext).toHaveBeenCalledTimes(2);
    expect(handlers.onPrevious).toHaveBeenCalledTimes(2);
    expect(handlers.onFinish).toHaveBeenCalledTimes(2);
  });

  it('has no previous button on the first step and finishes on the last', async () => {
    const { rerender } = render(<TutorialTour {...props({ index: 0, isFirst: true })} />);
    expect(screen.queryByRole('button', { name: 'Anterior' })).not.toBeInTheDocument();

    rerender(<TutorialTour {...props({ index: 7, isLast: true })} />);
    expect(screen.queryByRole('button', { name: 'Omitir tutorial' })).not.toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Terminar' }));
    expect(handlers.onNext).toHaveBeenCalled();
  });

  it('blurs everything but the element it explains', () => {
    const target = addTarget();
    const { container } = render(<TutorialTour {...props()} />);

    // Cuatro franjas desenfocadas alrededor del hueco del elemento.
    expect(container.querySelectorAll('.backdrop-blur-\\[3px\\]')).toHaveLength(4);
    target.remove();
  });

  it('blurs the whole window when there is nothing to point at', () => {
    const { container } = render(<TutorialTour {...props({ step: { ...STEP, id: 'welcome', target: null } })} />);
    expect(container.querySelectorAll('.backdrop-blur-\\[3px\\]')).toHaveLength(1);
  });
});
