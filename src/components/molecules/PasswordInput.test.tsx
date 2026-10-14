import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { PasswordInput } from './PasswordInput';

describe('PasswordInput', () => {
  it('hides the password and shows it with the eye button', async () => {
    render(<PasswordInput aria-label="Contraseña" defaultValue="secreto" />);
    const input = screen.getByLabelText('Contraseña');
    expect(input).toHaveAttribute('type', 'password');

    await userEvent.click(screen.getByRole('button', { name: 'Mostrar contraseña' }));
    expect(input).toHaveAttribute('type', 'text');
    expect(screen.getByRole('button', { name: 'Ocultar contraseña' })).toHaveAttribute('aria-pressed', 'true');

    await userEvent.click(screen.getByRole('button', { name: 'Ocultar contraseña' }));
    expect(input).toHaveAttribute('type', 'password');
  });

  it('does not submit the form when the eye is pressed', async () => {
    const onSubmit = vi.fn((event: { preventDefault: () => void }) => event.preventDefault());
    render(
      <form onSubmit={onSubmit}>
        <PasswordInput aria-label="Contraseña" />
      </form>,
    );
    await userEvent.click(screen.getByRole('button', { name: 'Mostrar contraseña' }));
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('locks the eye when the field is disabled', () => {
    render(<PasswordInput aria-label="Contraseña" disabled />);
    expect(screen.getByRole('button', { name: 'Mostrar contraseña' })).toBeDisabled();
  });
});
