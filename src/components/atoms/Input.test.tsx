import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { Input } from './Input';

describe('Input', () => {
  it('accepts typed text', async () => {
    render(<Input aria-label="Celular" />);

    await userEvent.type(screen.getByLabelText('Celular'), '3001234567');

    expect(screen.getByLabelText('Celular')).toHaveValue('3001234567');
  });

  it('marks itself invalid for assistive tech without blocking input', () => {
    render(<Input aria-label="Celular" invalid />);

    expect(screen.getByLabelText('Celular')).toHaveAttribute('aria-invalid', 'true');
  });

  it('disables input when disabled', () => {
    render(<Input aria-label="Celular" disabled />);

    expect(screen.getByLabelText('Celular')).toBeDisabled();
  });
});
