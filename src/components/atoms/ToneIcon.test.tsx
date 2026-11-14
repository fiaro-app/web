import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ToneIcon } from './ToneIcon';

describe('ToneIcon', () => {
  it.each(['success', 'warning', 'error', 'info'] as const)('draws the %s icon, hidden from screen readers', (tone) => {
    const { container } = render(<ToneIcon tone={tone} />);

    const svg = container.querySelector('svg');
    expect(svg).toHaveAttribute('aria-hidden', 'true');
    expect(svg?.querySelectorAll('path').length).toBeGreaterThan(1);
  });
});
