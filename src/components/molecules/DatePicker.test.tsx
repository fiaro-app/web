import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { fieldValue } from '@/test/field-value';
import { DatePicker } from './DatePicker';

describe('DatePicker', () => {
  it('shows the date as dd/mm/aaaa and keeps the ISO date in the form field', () => {
    const { container } = render(<DatePicker name="desde" defaultValue="2026-10-01" aria-describedby="x" />);
    expect(screen.getByRole('button', { name: /01\/10\/2026/ })).toBeInTheDocument();
    expect(fieldValue(container, 'desde')).toBe('2026-10-01');
  });

  it('asks for a date with a placeholder when there is none', () => {
    render(<DatePicker name="desde" />);
    expect(screen.getByRole('button')).toHaveTextContent('dd/mm/aaaa');
  });

  it('opens its own calendar on the chosen month, with Monday first', async () => {
    render(<DatePicker name="desde" defaultValue="2026-10-09" />);
    await userEvent.click(screen.getByRole('button'));

    expect(screen.getByRole('dialog', { name: 'Elegir fecha' })).toBeInTheDocument();
    expect(screen.getByText('octubre de 2026')).toBeInTheDocument();
    expect(screen.getAllByRole('columnheader').map((header) => header.textContent)).toEqual(['L', 'M', 'X', 'J', 'V', 'S', 'D']);
    expect(screen.getByRole('gridcell', { name: '9 de octubre de 2026' })).toHaveAttribute('aria-selected', 'true');
  });

  it('picks a day, closes, updates the field and reports the change', async () => {
    const onValueChange = vi.fn();
    const onChange = vi.fn();
    const { container } = render(
      <form onChange={onChange}>
        <DatePicker name="desde" defaultValue="2026-10-09" onValueChange={onValueChange} />
      </form>,
    );
    await userEvent.click(screen.getByRole('button'));
    await userEvent.click(screen.getByRole('gridcell', { name: '15 de octubre de 2026' }));

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(fieldValue(container, 'desde')).toBe('2026-10-15');
    expect(onValueChange).toHaveBeenCalledWith('2026-10-15');
    expect(screen.getByRole('button')).toHaveTextContent('15/10/2026');
  });

  it('moves between months and clears the date', async () => {
    const { container } = render(<DatePicker name="desde" defaultValue="2026-10-09" />);
    await userEvent.click(screen.getByRole('button'));
    await userEvent.click(screen.getByRole('button', { name: 'Mes siguiente' }));
    expect(screen.getByText('noviembre de 2026')).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Mes anterior' }));
    await userEvent.click(screen.getByRole('button', { name: 'Mes anterior' }));
    expect(screen.getByText('septiembre de 2026')).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: 'Borrar' }));
    expect(fieldValue(container, 'desde')).toBe('');
  });

  it('chooses today with the Hoy shortcut', async () => {
    const { container } = render(<DatePicker name="desde" />);
    await userEvent.click(screen.getByRole('button'));
    await userEvent.click(screen.getByRole('button', { name: 'Hoy' }));
    expect(fieldValue(container, 'desde')).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  it('moves with the arrow keys and closes with Escape', async () => {
    render(<DatePicker name="desde" defaultValue="2026-10-09" />);
    await userEvent.click(screen.getByRole('button'));
    expect(screen.getByRole('gridcell', { name: '9 de octubre de 2026' })).toHaveFocus();

    await userEvent.keyboard('{ArrowRight}');
    expect(screen.getByRole('gridcell', { name: '10 de octubre de 2026' })).toHaveFocus();
    await userEvent.keyboard('{ArrowDown}');
    expect(screen.getByRole('gridcell', { name: '17 de octubre de 2026' })).toHaveFocus();
    await userEvent.keyboard('{PageDown}');
    expect(screen.getByText('noviembre de 2026')).toBeInTheDocument();
    await userEvent.keyboard('{Escape}');
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('closes when the person clicks outside', async () => {
    render(<DatePicker name="desde" />);
    await userEvent.click(screen.getByRole('button'));
    await userEvent.click(document.body);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('does not let pick a day after max', async () => {
    render(<DatePicker name="hasta" defaultValue="2026-10-09" max="2026-10-10" />);
    await userEvent.click(screen.getByRole('button'));

    expect(screen.getByRole('gridcell', { name: '10 de octubre de 2026' })).toBeEnabled();
    expect(screen.getByRole('gridcell', { name: '11 de octubre de 2026' })).toBeDisabled();
  });
});
