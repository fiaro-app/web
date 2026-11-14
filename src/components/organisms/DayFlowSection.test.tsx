import { act, fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { DAY_FLOW } from '@/content/landing';
import { DayFlowSection } from './DayFlowSection';

describe('DayFlowSection', () => {
  beforeEach(() => {
    vi.stubGlobal('matchMedia', () => ({ matches: true }));
  });

  it('starts with the notebook and its problems', () => {
    render(<DayFlowSection id="un-dia" content={DAY_FLOW} />);

    expect(screen.getByText(DAY_FLOW.notebook.heading)).toBeInTheDocument();
    expect(screen.getByText(DAY_FLOW.notebook.problems[0])).toBeInTheDocument();
    expect(screen.getByRole('button', { name: DAY_FLOW.modes.notebook })).toHaveAttribute('aria-pressed', 'true');
  });

  it('switches to Fiaro and walks through the steps', async () => {
    render(<DayFlowSection id="un-dia" content={DAY_FLOW} />);

    await userEvent.click(screen.getByRole('button', { name: DAY_FLOW.modes.fiaro }));
    expect(screen.getByRole('tab', { name: /La ruta/ })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByText(DAY_FLOW.steps[0].mock.heading)).toBeInTheDocument();

    await userEvent.click(screen.getByRole('tab', { name: /El cuadre/ }));
    expect(screen.getByRole('tabpanel')).toHaveTextContent(DAY_FLOW.steps[2].title);
    expect(screen.getByText(DAY_FLOW.steps[2].mock.heading)).toBeInTheDocument();
  });

  it('does not advance on its own when the person prefers reduced motion', () => {
    vi.useFakeTimers();
    render(<DayFlowSection id="un-dia" content={DAY_FLOW} />);
    fireEvent.click(screen.getByRole('button', { name: DAY_FLOW.modes.fiaro }));

    act(() => vi.advanceTimersByTime(12000));

    expect(screen.getByRole('tab', { name: /La ruta/ })).toHaveAttribute('aria-selected', 'true');
    vi.useRealTimers();
  });

  it('advances on its own otherwise, and stops once the person picks a step', () => {
    vi.useFakeTimers();
    vi.stubGlobal('matchMedia', () => ({ matches: false }));
    render(<DayFlowSection id="un-dia" content={DAY_FLOW} />);
    fireEvent.click(screen.getByRole('button', { name: DAY_FLOW.modes.fiaro }));

    act(() => vi.advanceTimersByTime(5000));
    expect(screen.getByRole('tab', { name: /El cobro/ })).toHaveAttribute('aria-selected', 'true');

    fireEvent.click(screen.getByRole('tab', { name: /La ruta/ }));
    act(() => vi.advanceTimersByTime(12000));
    expect(screen.getByRole('tab', { name: /La ruta/ })).toHaveAttribute('aria-selected', 'true');
    vi.useRealTimers();
  });
});
