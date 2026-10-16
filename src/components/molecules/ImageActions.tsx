'use client';

import { useId, useState, type ChangeEvent } from 'react';
import { Button } from '@/components/atoms/Button';
import { ConfirmDialog } from '@/components/molecules/ConfirmDialog';

export interface ImageActionsProps {
  /** Tipos que acepta el selector de archivos (`image/png,image/jpeg`). */
  readonly accept: string;
  /** ¿Ya hay una imagen? Cambia «Subir» por «Cambiar» y muestra «Quitar». */
  readonly hasImage: boolean;
  readonly isBusy: boolean;
  readonly onChoose: (event: ChangeEvent<HTMLInputElement>) => unknown;
  readonly onRemove: () => unknown;
  readonly labels: {
    readonly upload: string;
    readonly change: string;
    readonly remove: string;
    readonly confirmTitle: string;
    readonly confirmDescription: string;
    readonly confirmLabel: string;
  };
}

/** Los botones de una imagen que se sube a mano: subir o cambiar, y quitar con confirmación. Sin lógica de red. */
export function ImageActions({ accept, hasImage, isBusy, onChoose, onRemove, labels }: Readonly<ImageActionsProps>) {
  const inputId = useId();
  const [confirmingRemove, setConfirmingRemove] = useState(false);
  return (
    <>
      <div className="flex flex-wrap gap-3">
        <input id={inputId} type="file" accept={accept} className="sr-only" disabled={isBusy} onChange={(event) => void onChoose(event)} />
        <Button type="button" loading={isBusy} onClick={() => document.getElementById(inputId)?.click()}>
          {hasImage ? labels.change : labels.upload}
        </Button>
        {hasImage && (
          <Button type="button" variant="outline" disabled={isBusy} onClick={() => setConfirmingRemove(true)}>
            {labels.remove}
          </Button>
        )}
      </div>
      <ConfirmDialog
        open={confirmingRemove}
        title={labels.confirmTitle}
        description={labels.confirmDescription}
        confirmLabel={labels.confirmLabel}
        onCancel={() => setConfirmingRemove(false)}
        onConfirm={() => {
          setConfirmingRemove(false);
          void onRemove();
        }}
      />
    </>
  );
}
