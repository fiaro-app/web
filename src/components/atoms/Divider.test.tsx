import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Divider } from './Divider';

describe('Divider', () => {
  it('is exposed as a horizontal separator by default', () => {
    render(<Divider />);

    expect(screen.getByRole('separator')).toHaveAttribute('aria-orientation', 'horizontal');
  });

  it('supports the vertical orientation', () => {
    render(<Divider orientation="vertical" />);

    expect(screen.getByRole('separator')).toHaveAttribute('aria-orientation', 'vertical');
  });

  it('is hidden from assistive tech when decorative', () => {
    render(<Divider decorative />);

    expect(screen.queryByRole('separator')).not.toBeInTheDocument();
  });
});
