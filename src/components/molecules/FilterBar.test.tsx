import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { FilterBar } from './FilterBar';

const OPTIONS = [
  { value: 'all', label: 'Todos' },
  { value: 'late', label: 'Atraso' },
];

describe('FilterBar', () => {
  it('reports search text', async () => {
    const onChange = vi.fn();
    render(<FilterBar search={{ value: '', onChange, placeholder: 'Buscar cliente...' }} />);

    await userEvent.type(screen.getByRole('searchbox'), 'M');

    expect(onChange).toHaveBeenCalledWith('M');
  });

  it('renders only the search when nothing else is given', () => {
    render(<FilterBar search={{ value: '', onChange: () => {} }} />);

    expect(screen.queryByRole('group')).not.toBeInTheDocument();
    expect(screen.queryByRole('combobox')).not.toBeInTheDocument();
  });

  it('marks the selected pill and reports a new choice', async () => {
    const onChange = vi.fn();
    render(<FilterBar search={{ value: '', onChange: () => {} }} pills={{ options: OPTIONS, value: 'all', onChange }} />);

    expect(screen.getByRole('button', { name: 'Todos' })).toHaveAttribute('aria-pressed', 'true');
    await userEvent.click(screen.getByRole('button', { name: 'Atraso' }));

    expect(onChange).toHaveBeenCalledWith('late');
  });

  it('reports a select choice', async () => {
    const onChange = vi.fn();
    render(
      <FilterBar
        search={{ value: '', onChange: () => {} }}
        selects={[{ label: 'Cobrador', value: '', onChange, options: [{ value: 'luis', label: 'Luis' }] }]}
      />,
    );

    await userEvent.selectOptions(screen.getByRole('combobox', { name: 'Cobrador' }), 'luis');

    expect(onChange).toHaveBeenCalledWith('luis');
  });
});
