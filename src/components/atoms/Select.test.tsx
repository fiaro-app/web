import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { fieldValue } from '@/test/field-value';
import { Select } from './Select';

function renderSelect(props: Parameters<typeof Select>[0] = {}) {
  const view = render(
    <Select aria-label="Cobrador" name="cobrador" {...props}>
      <option value="">Todos los cobradores</option>
      <option value="luis">Luis</option>
      <option value="ana">Ana</option>
    </Select>,
  );
  return { ...view, combobox: screen.getByRole('combobox', { name: 'Cobrador' }) };
}

describe('Select', () => {
  it('shows the current option and lets the user pick another from the list', async () => {
    const { combobox, container } = renderSelect();
    expect(combobox).toHaveTextContent('Todos los cobradores');
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();

    await userEvent.click(combobox);
    expect(screen.getAllByRole('option').map((option) => option.textContent)).toEqual(['Todos los cobradores', 'Luis', 'Ana']);
    expect(screen.getByRole('option', { name: 'Todos los cobradores' })).toHaveAttribute('aria-selected', 'true');
    await userEvent.click(screen.getByRole('option', { name: 'Luis' }));

    expect(combobox).toHaveTextContent('Luis');
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    expect(fieldValue(container, 'cobrador')).toBe('luis');
  });

  it('starts on the default value and reports the change like a native select', async () => {
    const onChange = vi.fn();
    const { combobox } = renderSelect({ defaultValue: 'ana', onChange });
    expect(combobox).toHaveTextContent('Ana');

    await userEvent.click(combobox);
    await userEvent.click(screen.getByRole('option', { name: 'Luis' }));
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange.mock.calls[0]?.[0].target.value).toBe('luis');
  });

  it('follows the value when it is controlled', () => {
    const { combobox } = renderSelect({ value: 'luis', onChange: () => {} });
    expect(combobox).toHaveTextContent('Luis');
  });

  it('works with the keyboard: arrows move, Enter picks and Esc closes', async () => {
    const { combobox } = renderSelect();
    combobox.focus();

    await userEvent.keyboard('{ArrowDown}{ArrowDown}{Enter}');
    expect(combobox).toHaveTextContent('Luis');

    await userEvent.keyboard('{ArrowDown}');
    expect(screen.getByRole('listbox')).toBeInTheDocument();
    await userEvent.keyboard('{Escape}');
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  it('closes when the person clicks outside', async () => {
    const { combobox } = renderSelect();
    await userEvent.click(combobox);
    await userEvent.click(document.body);
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  it('marks itself invalid for assistive tech', () => {
    expect(renderSelect({ invalid: true }).combobox).toHaveAttribute('aria-invalid', 'true');
  });

  it('cannot be opened when disabled', () => {
    expect(renderSelect({ disabled: true }).combobox).toBeDisabled();
  });
});
