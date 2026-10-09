import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Stepper } from './Stepper';

const STEPS = ['Tipo de cuenta', 'Configuración', 'Plan'];

describe('Stepper', () => {
  it('lists every step and marks the current one', () => {
    render(<Stepper steps={STEPS} current={1} />);

    const items = screen.getAllByRole('listitem');
    expect(items).toHaveLength(3);
    expect(items[1]).toHaveAttribute('aria-current', 'step');
    expect(items[0]).not.toHaveAttribute('aria-current');
  });

  it('fills reached steps and leaves the rest outlined', () => {
    render(<Stepper steps={STEPS} current={1} />);

    expect(screen.getByText('1')).toHaveClass('bg-primary');
    expect(screen.getByText('2')).toHaveClass('bg-primary');
    expect(screen.getByText('3')).not.toHaveClass('bg-primary');
  });
});
