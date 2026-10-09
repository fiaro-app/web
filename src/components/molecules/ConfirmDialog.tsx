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
 * Modal de confirmación para acciones importantes: grande, con un icono y el fondo desenfocado. Usa el `<dialog>` nativo en modo modal:
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
      className="m-auto w-[30rem] max-w-[calc(100%-2rem)] rounded-xl bg-surface p-8 text-foreground shadow-[0_24px_64px_-8px_rgb(28_27_46/0.4)] backdrop:bg-foreground/45 backdrop:backdrop-blur-sm open:flex open:flex-col open:gap-5"
    >
      <span aria-hidden="true" className="grid size-12 place-items-center rounded-full bg-primary/10 text-primary">
        <svg viewBox="0 0 24 24" className="size-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="9" />
          <path d="M12 8v5M12 16.5v.01" />
        </svg>
      </span>
      <div className="flex flex-col gap-2">
        <Text id={titleId} variant="h3" as="h2">
          {title}
        </Text>
        <Text id={descriptionId} className="text-foreground/75">
          {description}
        </Text>
      </div>
      <div className="flex justify-end gap-3 max-sm:flex-col-reverse">
        <Button variant="outline" size="sm" className="min-w-36 max-sm:w-full" disabled={loading} onClick={onCancel}>
          {cancelLabel}
        </Button>
        <Button size="sm" className="min-w-36 max-sm:w-full" loading={loading} onClick={onConfirm}>
          {confirmLabel}
        </Button>
      </div>
    </dialog>
  );
}
