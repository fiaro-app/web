'use client';

import { Alert } from '@/components/molecules/Alert';
import { Button } from '@/components/atoms/Button';
import { Skeleton } from '@/components/atoms/Skeleton';
import { Text } from '@/components/atoms/Text';
import { ImageActions } from '@/components/molecules/ImageActions';
import { ATTACHMENTS_TEXT } from '@/content/attachments';
import type { AttachmentTarget } from '@/features/attachments/endpoints';
import { IMAGE_CONTENT_TYPES } from '@/features/attachments/image-file';
import { useAttachment } from '@/features/attachments/use-attachment';

export interface PrivateImageProps {
  readonly target: AttachmentTarget;
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly alt: string;
  readonly none: string;
  /** Puede subir, cambiar y quitar (quien administra, o el cobrador de ese cobro). */
  readonly canEdit: boolean;
}

/** Una imagen privada (foto de cliente, comprobante): carga, error, vacío, subir, cambiar y quitar. Lógica en `useAttachment`. */
export function PrivateImage({ target, id, title, description, alt, none, canEdit }: Readonly<PrivateImageProps>) {
  const { status, url, isBusy, error, notice, chooseFile, remove, retry } = useAttachment(target, id);
  const text = ATTACHMENTS_TEXT;

  return (
    <section aria-label={title} className="flex max-w-lg flex-col gap-3 rounded-md bg-surface p-5">
      <div className="flex flex-col gap-1">
        <Text variant="h3" as="h3">
          {title}
        </Text>
        <Text variant="label" className="text-foreground/70">
          {description}
        </Text>
      </div>

      {status === 'loading' && (
        <output>
          <span className="sr-only">{text.loading}</span>
          <Skeleton className="h-40 w-full rounded-md" />
        </output>
      )}
      {status === 'error' && (
        <Alert tone="error">
          {text.error}{' '}
          <Button type="button" variant="outline" onClick={retry}>
            {text.retry}
          </Button>
        </Alert>
      )}
      {status === 'ready' &&
        (url ? (
          // Imagen del almacenamiento externo (CSP `img-src`): next/image no aporta aquí.
          // eslint-disable-next-line @next/next/no-img-element
          <img src={url} alt={alt} className="max-h-72 w-full rounded-md bg-surface-2 object-contain" />
        ) : (
          <p className="text-label text-foreground/70">{none}</p>
        ))}

      {error && <Alert tone="error">{error}</Alert>}
      {notice && <Alert tone="success">{notice}</Alert>}

      {canEdit && status === 'ready' && (
        <ImageActions
          accept={IMAGE_CONTENT_TYPES.join(',')}
          hasImage={Boolean(url)}
          isBusy={isBusy}
          onChoose={chooseFile}
          onRemove={remove}
          labels={{ upload: text.upload, change: text.change, remove: text.remove, confirmTitle: text.confirmTitle, confirmDescription: text.confirmDescription, confirmLabel: text.confirmLabel }}
        />
      )}
    </section>
  );
}
