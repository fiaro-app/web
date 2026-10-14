import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { EMPTY_VISIT_REPORT_FILTERS } from '@/features/visits/visit-report-filters';
import type { VisitReportRow, VisitReportViewModel } from '@/features/visits/visits-view-model';
import { VisitReportView } from './VisitReportView';

const ROW: VisitReportRow = {
  id: 'v1',
  time: '3:05 p. m.',
  loanId: 'l1',
  clientName: 'Ana Gómez',
  collectorName: 'Luis Pérez',
  outcome: 'Pagó',
  outcomeTone: 'success',
  expected: '$30.000',
  collected: '$30.000',
  method: 'Efectivo',
  reverted: false,
  note: null,
};
const REPORT: VisitReportViewModel = { rows: [ROW], total: 45, page: 1, pageSize: 20, rangeFrom: '09/10/2026', rangeTo: '09/10/2026', searchTruncated: false };
const COLLECTORS = [{ id: 'c1', name: 'Luis Pérez' }];

describe('VisitReportView', () => {
  it('shows the title, today as the range and a row linking to the loan', () => {
    render(<VisitReportView report={REPORT} filters={EMPTY_VISIT_REPORT_FILTERS} collectors={COLLECTORS} />);

    expect(screen.getByRole('heading', { level: 1, name: 'Cobros del día' })).toBeInTheDocument();
    expect(screen.getByText('Hoy · 09/10/2026')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Ver préstamo de Ana Gómez' })).toHaveAttribute('href', '/prestamos/l1');
    expect(screen.getByText('Página 1 de 3 · 45 visitas')).toBeInTheDocument();
  });

  it('describes a day and a period when filtered, and strikes through a reverted payment', () => {
    const reverted = { ...REPORT, rows: [{ ...ROW, reverted: true, note: 'Prometió pagar el 05/10/2026' }], rangeTo: '10/10/2026' };
    const { rerender } = render(
      <VisitReportView
        report={reverted}
        filters={{ ...EMPTY_VISIT_REPORT_FILTERS, from: '2026-10-09', to: '2026-10-10' }}
        collectors={COLLECTORS}
      />,
    );
    expect(screen.getByText('Del 09/10/2026 al 10/10/2026')).toBeInTheDocument();
    expect(screen.getByText('Revertido')).toBeInTheDocument();
    expect(screen.getByText('Prometió pagar el 05/10/2026')).toBeInTheDocument();

    rerender(
      <VisitReportView
        report={{ ...REPORT, rows: [ROW] }}
        filters={{ ...EMPTY_VISIT_REPORT_FILTERS, from: '2026-10-09', to: '2026-10-09' }}
        collectors={COLLECTORS}
      />,
    );
    expect(screen.getByText('El 09/10/2026')).toBeInTheDocument();
  });

  it('keeps the filters in the pagination links', () => {
    render(<VisitReportView report={REPORT} filters={{ ...EMPTY_VISIT_REPORT_FILTERS, outcome: 'PAID' }} collectors={COLLECTORS} />);

    expect(screen.getByRole('link', { name: /Siguiente/ })).toHaveAttribute('href', '/cobros?pagina=2&resultado=PAID');
  });

  it('shows a large empty state, with a way out when it is filtered', () => {
    const empty = { ...REPORT, rows: [], total: 0 };
    const { rerender } = render(<VisitReportView report={empty} filters={EMPTY_VISIT_REPORT_FILTERS} collectors={COLLECTORS} />);
    expect(screen.getByRole('heading', { name: 'Todavía no hay cobros hoy' })).toBeInTheDocument();
    expect(screen.queryByRole('link', { name: 'Limpiar filtros' })).not.toBeInTheDocument();

    rerender(<VisitReportView report={empty} filters={{ ...EMPTY_VISIT_REPORT_FILTERS, collectorId: 'c1' }} collectors={COLLECTORS} />);
    expect(screen.getByRole('heading', { name: 'No hay cobros con esos filtros' })).toBeInTheDocument();
  });

  it('has a search box and warns when the search could not cover every visit', () => {
    render(<VisitReportView report={{ ...REPORT, searchTruncated: true }} filters={{ ...EMPTY_VISIT_REPORT_FILTERS, search: 'ana' }} collectors={COLLECTORS} />);
    expect(screen.getByRole('searchbox')).toHaveValue('ana');
    expect(screen.getByText(/más visitas en este período/)).toBeInTheDocument();
  });
});
