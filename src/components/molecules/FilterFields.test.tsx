import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { fieldValue } from '@/test/field-value';
import { FilterActions } from './FilterActions';
import { FilterDateRange } from './FilterDateRange';
import { FilterSelectField } from './FilterSelectField';

describe('FilterDateRange', () => {
  it('renders the two dates named desde and hasta with their current values', () => {
    const { container } = render(<FilterDateRange from="2026-10-01" to="2026-10-09" fromLabel="Desde" toLabel="Hasta" />);

    expect(fieldValue(container, 'desde')).toBe('2026-10-01');
    expect(fieldValue(container, 'hasta')).toBe('2026-10-09');
    expect(screen.getByLabelText('Desde')).toHaveTextContent('01/10/2026');
    expect(screen.getByLabelText('Hasta')).toHaveTextContent('09/10/2026');
  });
});

describe('FilterSelectField', () => {
  it('offers the "all" option first, then the options, with the current one selected', async () => {
    const { container } = render(
      <FilterSelectField
        name="cobrador"
        label="Cobrador"
        defaultValue="c2"
        allLabel="Todos"
        options={[
          { value: 'c1', label: 'Ana' },
          { value: 'c2', label: 'Luis' },
        ]}
      />,
    );

    const select = screen.getByLabelText('Cobrador');
    expect(fieldValue(container, 'cobrador')).toBe('c2');
    expect(select).toHaveTextContent('Luis');
    await userEvent.click(select);
    expect(screen.getAllByRole('option').map((option) => option.textContent)).toEqual(['Todos', 'Ana', 'Luis']);
  });
});

describe('FilterActions', () => {
  it('always applies, and offers to clear only when something is filtered', () => {
    const { rerender } = render(<FilterActions applyLabel="Aplicar" clearLabel="Limpiar" clearHref="/cobros" isFiltered={false} />);
    expect(screen.getByRole('button', { name: 'Aplicar' })).toHaveAttribute('type', 'submit');
    expect(screen.queryByRole('link', { name: 'Limpiar' })).not.toBeInTheDocument();

    rerender(<FilterActions applyLabel="Aplicar" clearLabel="Limpiar" clearHref="/cobros" isFiltered />);
    expect(screen.getByRole('link', { name: 'Limpiar' })).toHaveAttribute('href', '/cobros');
  });
});
