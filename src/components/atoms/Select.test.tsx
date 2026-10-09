import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { Select } from './Select';

function renderSelect(props: Parameters<typeof Select>[0] = {}) {
  render(
    <Select aria-label="Cobrador" {...props}>
      <option value="">Todos los cobradores</option>
      <option value="luis">Luis</option>
    </Select>,
  );
  return screen.getByRole('combobox', { name: 'Cobrador' });
}

describe('Select', () => {
  it('lets the user pick an option', async () => {
    const select = renderSelect();

    await userEvent.selectOptions(select, 'luis');

    expect(select).toHaveValue('luis');
  });

  it('marks itself invalid for assistive tech', () => {
    expect(renderSelect({ invalid: true })).toHaveAttribute('aria-invalid', 'true');
  });

  it('disables selection when disabled', () => {
    expect(renderSelect({ disabled: true })).toBeDisabled();
  });
});
