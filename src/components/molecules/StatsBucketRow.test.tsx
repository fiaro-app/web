import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { StatsBucketRow } from './StatsBucketRow';

const BUCKET = { label: '8–15 días', amount: '$1.600.000', clients: '1 cliente', barPercent: 50 };

describe('StatsBucketRow', () => {
  it('shows the label, amount and clients', () => {
    render(<StatsBucketRow bucket={BUCKET} />);
    expect(screen.getByText('8–15 días')).toBeInTheDocument();
    expect(screen.getByText('$1.600.000 · 1 cliente')).toBeInTheDocument();
  });

  it('sizes the bar to its share of the largest bucket', () => {
    const { container } = render(<StatsBucketRow bucket={BUCKET} />);
    expect(container.querySelector('[style]')).toHaveStyle({ width: '50%' });
  });

  it('has an empty bar for a bucket with nothing overdue', () => {
    const { container } = render(<StatsBucketRow bucket={{ ...BUCKET, amount: '$0', clients: '0 clientes', barPercent: 0 }} />);
    expect(container.querySelector('[style]')).toHaveStyle({ width: '0%' });
  });
});
