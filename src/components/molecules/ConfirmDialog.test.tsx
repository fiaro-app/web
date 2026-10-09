import { fireEvent, render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { beforeAll, describe, expect, it, vi } from 'vitest';
import { ConfirmDialog } from './ConfirmDialog';

// jsdom no implementa `showModal`/`close`: se simulan con el atributo `open`.
beforeAll(() => {
  HTMLDialogElement.prototype.showModal = function showModal() {
    this.setAttribute('open', '');
  };
  HTMLDialogElement.prototype.close = function close() {
    this.removeAttribute('open');
  };
});

function setup(props: Partial<Parameters<typeof ConfirmDialog>[0]> = {}) {
  const onConfirm = vi.fn();
  const onCancel = vi.fn();
  render(
    <ConfirmDialog
      open
      title="¿Confirmar pago?"
      description="Esta acción no se puede deshacer."
      onConfirm={onConfirm}
      onCancel={onCancel}
      {...props}
    />,
  );
  return { onConfirm, onCancel };
}

describe('ConfirmDialog', () => {
  it('is an accessible dialog named by its title and described by its text', () => {
    setup();

    const dialog = screen.getByRole('dialog', { name: '¿Confirmar pago?' });
    expect(dialog).toHaveAccessibleDescription('Esta acción no se puede deshacer.');
  });

  it('is not shown while closed', () => {
    setup({ open: false });

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('confirms and cancels through its buttons', async () => {
    const { onConfirm, onCancel } = setup();

    await userEvent.click(screen.getByRole('button', { name: 'Confirmar' }));
    await userEvent.click(screen.getByRole('button', { name: 'Cancelar' }));

    expect(onConfirm).toHaveBeenCalledOnce();
    expect(onCancel).toHaveBeenCalledOnce();
  });

  it('asks the parent to close on Esc instead of closing itself', () => {
    const { onCancel } = setup();

    fireEvent(screen.getByRole('dialog'), new Event('cancel', { cancelable: true }));

    expect(onCancel).toHaveBeenCalledOnce();
  });

  it('blocks both actions and Esc while loading', async () => {
    const { onCancel } = setup({ loading: true });

    expect(screen.getByRole('button', { name: 'Cancelar' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Confirmar' })).toBeDisabled();
    fireEvent(screen.getByRole('dialog'), new Event('cancel', { cancelable: true }));
    expect(onCancel).not.toHaveBeenCalled();
  });

  it('accepts custom button labels', () => {
    setup({ confirmLabel: 'Sí, pagar', cancelLabel: 'Volver' });

    expect(screen.getByRole('button', { name: 'Sí, pagar' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Volver' })).toBeInTheDocument();
  });
});
