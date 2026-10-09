import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import type { CollectorStatsView } from '@/features/collectors/collector-stats-view-model';
import { CollectorPerformance } from './CollectorPerformance';

const STATS: CollectorStatsView = {
  period: '01/10/2026 – 31/10/2026',
  expected: '$1.000.000',
  collected: '$950.000',
  effectiveness: '95 %',
  effectivenessTone: 'good',
  visits: '42',
  overdue: '$0',
  overdueTone: 'good',
};

describe('CollectorPerformance', () => {
  it('shows the month figures under a titled section', () => {
    render(<CollectorPerformance stats={STATS} />);

    expect(screen.getByRole('heading', { level: 2, name: 'Desempeño del mes' })).toBeInTheDocument();
    expect(screen.getByText('Del 01/10/2026 – 31/10/2026')).toBeInTheDocument();
    for (const value of ['95 %', '$950.000', '$1.000.000', '42', '$0']) {
      expect(screen.getByText(value)).toBeInTheDocument();
    }
  });
});
