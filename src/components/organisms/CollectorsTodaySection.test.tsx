import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import type { CollectorsTodayViewModel } from '@/features/collectors-today/collectors-today-view-model';
import { CollectorsTodaySection } from './CollectorsTodaySection';

const TODAY: CollectorsTodayViewModel = {
  summary: '1 de 2 cobradores ya iniciaron su ruta · 0 la terminaron',
  notStarted: 1,
  rows: [
    { id: 'm1', fullName: 'Ana Pérez', statusLabel: 'Sin iniciar', statusTone: 'warning', progress: '0 de 4', pending: 4, collected: '$0 de $80.000', startedAt: '—', settlement: 'Sin enviar' },
    { id: 'm2', fullName: 'Beto Ríos', statusLabel: 'En ruta', statusTone: 'info', progress: '2 de 5', pending: 3, collected: '$40.000 de $100.000', startedAt: '8:05 a. m.', settlement: 'Sin enviar' },
  ],
};

describe('CollectorsTodaySection', () => {
  it('muestra el resumen y una fila por cobrador, enlazada a su gestión', () => {
    render(<CollectorsTodaySection today={TODAY} />);

    expect(screen.getByRole('heading', { name: 'Rutas de hoy' })).toBeInTheDocument();
    expect(screen.getByText(TODAY.summary)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Ana Pérez' })).toHaveAttribute('href', '/cobradores/m1');
    expect(screen.getByText('Sin iniciar')).toBeInTheDocument();
    expect(screen.getByText('$40.000 de $100.000')).toBeInTheDocument();
  });

  it('sin filas explica que no hay rutas hoy', () => {
    render(<CollectorsTodaySection today={{ ...TODAY, rows: [] }} />);

    expect(screen.getByText('No hay cobradores activos con ruta hoy.')).toBeInTheDocument();
  });
});
