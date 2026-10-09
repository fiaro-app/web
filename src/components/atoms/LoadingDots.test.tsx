import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { LoadingDots } from './LoadingDots';

describe('LoadingDots', () => {
  it('renders three decorative dots', () => {
    const { container } = render(<LoadingDots />);

    expect(container.firstElementChild).toHaveAttribute('aria-hidden', 'true');
    expect(container.firstElementChild?.children).toHaveLength(3);
  });
});
