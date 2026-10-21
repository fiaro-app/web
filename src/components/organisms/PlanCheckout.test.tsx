import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { PlanCheckout } from './PlanCheckout';

const { useCheckout } = vi.hoisted(() => ({ useCheckout: vi.fn() }));
vi.mock('@/features/subscription/use-checkout', () => ({ useCheckout }));

const pay = vi.fn();

beforeEach(() => {
  vi.clearAllMocks();
  useCheckout.mockReturnValue({ payingPlan: null, error: null, pay });
});

describe('PlanCheckout', () => {
  it('offers the three paid plans with their monthly price', () => {
    render(<PlanCheckout currentPlanName={null} />);

    const plans = screen.getAllByRole('heading', { level: 3 }).map((heading) => heading.textContent);
    expect(plans).toEqual(['Individual', 'Pro', 'Team']);
    for (const price of ['$49.000', '$69.000', '$149.000']) expect(screen.getByText(price, { exact: false })).toBeInTheDocument();
    expect(screen.getAllByRole('button', { name: 'Pagar con Wompi' })).toHaveLength(3);
  });

  it('marks the plan the business already has', () => {
    render(<PlanCheckout currentPlanName="Pro" />);

    expect(screen.getByText('Tu plan actual')).toBeInTheDocument();
  });

  it('pays the plan whose button is pressed', async () => {
    render(<PlanCheckout currentPlanName={null} />);
    const pro = screen.getByRole('heading', { level: 3, name: 'Pro' }).closest('li');

    await userEvent.click(within(pro as HTMLElement).getByRole('button', { name: 'Pagar con Wompi' }));

    expect(pay).toHaveBeenCalledExactlyOnceWith('PRO');
  });

  it('shows the error and locks every button while an order is being created', () => {
    useCheckout.mockReturnValue({ payingPlan: 'PRO', error: 'No se pudo', pay });
    render(<PlanCheckout currentPlanName={null} />);

    expect(screen.getByRole('alert')).toHaveTextContent('No se pudo');
    for (const button of screen.getAllByRole('button')) expect(button).toBeDisabled();
  });

  it('points to sales for questions', () => {
    render(<PlanCheckout currentPlanName={null} />);

    expect(screen.getByRole('link', { name: 'Hablar con ventas' })).toHaveAttribute('href', '/contacto');
  });
});
