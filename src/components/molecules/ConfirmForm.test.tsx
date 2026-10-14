import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { ConfirmForm } from './ConfirmForm';

const CONFIRMATION = { title: '¿Guardar los cambios?', description: 'Se aplican de inmediato.', confirmLabel: 'Guardar' };

describe('ConfirmForm', () => {
  it('only runs the submit once the person confirms', async () => {
    const onSubmit = vi.fn();
    render(
      <ConfirmForm confirmation={CONFIRMATION} onSubmit={onSubmit} aria-label="Datos">
        <button type="submit">Enviar</button>
      </ConfirmForm>,
    );

    await userEvent.click(screen.getByRole('button', { name: 'Enviar' }));
    expect(screen.getByRole('heading', { name: '¿Guardar los cambios?' })).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();

    await userEvent.click(screen.getByRole('button', { name: 'Guardar' }));
    expect(onSubmit).toHaveBeenCalledTimes(1);
  });

  it('does not submit when the person cancels', async () => {
    const onSubmit = vi.fn();
    render(
      <ConfirmForm confirmation={CONFIRMATION} onSubmit={onSubmit} aria-label="Datos">
        <button type="submit">Enviar</button>
      </ConfirmForm>,
    );

    await userEvent.click(screen.getByRole('button', { name: 'Enviar' }));
    await userEvent.click(screen.getByRole('button', { name: 'Cancelar' }));
    expect(onSubmit).not.toHaveBeenCalled();
  });
});
