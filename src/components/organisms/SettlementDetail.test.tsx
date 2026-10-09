import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import type { SettlementDetailView } from '@/features/settlements/settlements-view-model';
import { SettlementDetail } from './SettlementDetail';

vi.mock('@/features/settlements/use-review-settlement', () => ({
  useReviewSettlement: () => ({ note: '', changeNote: vi.fn(), pending: null, error: null, notice: null, approve: vi.fn(), reject: vi.fn() }),
}));

const SETTLEMENT: SettlementDetailView = {
  id: 's1',
  collectorName: 'Luis Gómez',
  portfolioName: 'Zona Norte',
  date: '08/10/2026',
  expected: '$100.000',
  collected: '$90.000',
  difference: '-$10.000',
  differenceTone: 'bad',
  status: 'Pendiente',
  statusTone: 'warning',
  reviewable: true,
  cash: '$60.000',
  nequi: '$30.000',
  transfer: '$0',
  collectorNote: 'Un cliente no pagó',
  reviewNote: null,
  submittedAt: '08/10/2026',
  reviewedAt: null,
};

describe('SettlementDetail', () => {
  it('shows the amounts by payment method, the difference and the collector note', () => {
    render(<SettlementDetail settlement={SETTLEMENT} />);
    expect(screen.getByRole('heading', { level: 1, name: 'Cuadre de Luis Gómez' })).toBeInTheDocument();
    for (const text of ['$60.000', '$30.000', '$0', '$100.000', '$90.000', '-$10.000', 'Un cliente no pagó']) {
      expect(screen.getByText(text)).toBeInTheDocument();
    }
    expect(screen.getByText('-$10.000')).toHaveClass('text-destructive');
  });

  it('says it balances when there is no difference', () => {
    render(<SettlementDetail settlement={{ ...SETTLEMENT, difference: null, differenceTone: 'neutral' }} />);
    expect(screen.getByText('Cuadra')).toBeInTheDocument();
  });

  it('offers the review form only while pending', () => {
    const { rerender } = render(<SettlementDetail settlement={SETTLEMENT} />);
    expect(screen.getByRole('button', { name: 'Aprobar cuadre' })).toBeInTheDocument();
    rerender(
      <SettlementDetail settlement={{ ...SETTLEMENT, reviewable: false, status: 'Rechazado', statusTone: 'bad', reviewNote: 'Falta recibo', reviewedAt: '09/10/2026' }} />,
    );
    expect(screen.queryByRole('button', { name: 'Aprobar cuadre' })).not.toBeInTheDocument();
    expect(screen.getByText('Falta recibo')).toBeInTheDocument();
    expect(screen.getByText('09/10/2026')).toBeInTheDocument();
  });
});
