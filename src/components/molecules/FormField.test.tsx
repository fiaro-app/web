import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Input } from '@/components/atoms/Input';
import { FormField } from './FormField';

describe('FormField', () => {
  it('links the label to the control so it is reachable by its label text', () => {
    render(
      <FormField label="Correo">
        <Input type="email" />
      </FormField>,
    );

    expect(screen.getByLabelText('Correo')).toBeInTheDocument();
  });

  it('shows an error, marks the control invalid, and describes it by the error', () => {
    render(
      <FormField label="Correo" error="Correo inválido">
        <Input type="email" />
      </FormField>,
    );

    const input = screen.getByLabelText('Correo');
    expect(input).toHaveAttribute('aria-invalid', 'true');
    const error = screen.getByRole('alert');
    expect(error).toHaveTextContent('Correo inválido');
    expect(input).toHaveAttribute('aria-describedby', error.id);
  });

  it('shows the hint only when there is no error', () => {
    render(
      <FormField label="Correo" hint="Usa el correo de tu cuenta">
        <Input type="email" />
      </FormField>,
    );

    expect(screen.getByText('Usa el correo de tu cuenta')).toBeInTheDocument();
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });
});
