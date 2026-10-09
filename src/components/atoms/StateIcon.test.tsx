import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { StateIcon, type StateIconName } from './StateIcon';

const NAMES: StateIconName[] = ['users', 'user-plus', 'wallet', 'clipboard', 'bell', 'chart', 'lock', 'search', 'alert'];

describe('StateIcon', () => {
  it.each(NAMES)('draws the %s icon as a decorative svg', (name) => {
    const { container } = render(<StateIcon name={name} />);

    const svg = container.querySelector('svg');
    expect(svg).toHaveAttribute('aria-hidden', 'true');
    expect(svg?.querySelectorAll('path').length).toBeGreaterThan(0);
  });

  it('takes the size it is given', () => {
    const { container } = render(<StateIcon name="bell" className="size-8" />);

    expect(container.querySelector('svg')).toHaveClass('size-8');
  });
});
