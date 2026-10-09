'use client';

import { useEffect, useId, useRef } from 'react';
import { Button } from '@/components/atoms/Button';
import { Text } from '@/components/atoms/Text';

export interface ConfirmDialogProps {
  readonly open: boolean;
  readonly title: string;
  readonly description: string;
  readonly confirmLabel?: string;
  readonly cancelLabel?: string;
  readonly onConfirm: () => void;
  /** Se llama al pulsar "Cancelar" o la tecla Esc; quien lo usa decide cerrar (`open={false}`). */
  readonly onCancel: () => void;
  /** Deshabilita ambas acciones y muestra la carga en "Confirmar" mientras se procesa. */
  readonly loading?: boolean;
}

/**
 * Modal de confirmación para acciones irreversibles. Usa el `<dialog>` nativo en modo modal:
 * el navegador atrapa el foco, bloquea el fondo y maneja Esc. No se cierra al hacer clic fuera,
 * para que una confirmación no se descarte por accidente.
 */
export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = 'Confirmar',
  cancelLabel = 'Cancelar',
  onConfirm,
  onCancel,
  loading = false,
}: Readonly<ConfirmDialogProps>) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const descriptionId = useId();

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={titleId}
      aria-describedby={descriptionId}
      onCancel={(event) => {
        // Esc: el estado lo controla el padre, no el navegador.
        event.preventDefault();
        if (!loading) onCancel();
      }}
      className="m-auto w-80 max-w-[calc(100%-2rem)] rounded-lg bg-surface p-6 text-foreground shadow-[0_12px_32px_-4px_rgb(28_27_46/0.28)] backdrop:bg-foreground/40 open:flex open:flex-col open:gap-3"
    >
      <Text id={titleId} variant="h3" as="h2">
        {title}
      </Text>
      <Text id={descriptionId} className="text-foreground/75">
        {description}
      </Text>
      <div className="flex justify-end gap-3">
        <Button variant="outline" size="sm" className="w-32" disabled={loading} onClick={onCancel}>
          {cancelLabel}
        </Button>
        <Button size="sm" className="w-32" loading={loading} onClick={onConfirm}>
          {confirmLabel}
        </Button>
      </div>
    </dialog>
  );
}
