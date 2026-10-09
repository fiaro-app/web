import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Checkbox } from './Checkbox';

describe('Checkbox', () => {
  it('toggles on click', async () => {
    const onChange = vi.fn();
    render(<Checkbox aria-label="Acepto" onChange={onChange} />);
    const checkbox = screen.getByRole('checkbox', { name: 'Acepto' });

    await userEvent.click(checkbox);
    expect(checkbox).toBeChecked();

    await userEvent.click(checkbox);
    expect(checkbox).not.toBeChecked();
    expect(onChange).toHaveBeenCalledTimes(2);
  });

  it('toggles from the keyboard', async () => {
    render(<Checkbox aria-label="Acepto" />);

    await userEvent.tab();
    await userEvent.keyboard(' ');

    expect(screen.getByRole('checkbox')).toBeChecked();
  });

  it('cannot be toggled when disabled', async () => {
    render(<Checkbox aria-label="Acepto" disabled />);
    const checkbox = screen.getByRole('checkbox');

    await userEvent.click(checkbox);

    expect(checkbox).toBeDisabled();
    expect(checkbox).not.toBeChecked();
  });

  it('marks itself invalid for assistive tech', () => {
    render(<Checkbox aria-label="Acepto" invalid />);

    expect(screen.getByRole('checkbox')).toHaveAttribute('aria-invalid', 'true');
  });
});
