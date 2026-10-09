'use client';

import { useId } from 'react';
import { Alert } from '@/components/molecules/Alert';
import { Avatar } from '@/components/atoms/Avatar';
import { Button } from '@/components/atoms/Button';
import { SettingsSection } from '@/components/molecules/SettingsSection';
import { SETTINGS_TEXT } from '@/content/settings';
import { LOGO_CONTENT_TYPES } from '@/features/lender/logo-file';
import { useLogoForm } from '@/features/lender/use-logo-form';

export interface LogoFormProps {
  readonly businessName: string;
  readonly logoUrl: string | null;
  readonly canEdit: boolean;
  /** Si el entorno tiene configurado el almacenamiento (`STORAGE_ORIGIN`); sin él no se puede subir. */
  readonly uploadAvailable: boolean;
}

/** Logo del negocio: vista previa, subir/cambiar y quitar. Lógica en `useLogoForm`. */
export function LogoForm({ businessName, logoUrl, canEdit, uploadAvailable }: Readonly<LogoFormProps>) {
  const text = SETTINGS_TEXT.logo;
  const inputId = useId();
  const { isBusy, error, notice, chooseFile, removeLogo } = useLogoForm();

  return (
    <SettingsSection title={text.title} description={text.description}>
      <div className="flex items-center gap-4">
        {logoUrl ? (
          // Imagen del almacenamiento externo (CSP `img-src`): next/image no aporta aquí.
          // eslint-disable-next-line @next/next/no-img-element
          <img src={logoUrl} alt={`${text.current}: ${businessName}`} className="size-20 rounded-md bg-surface-2 object-contain" />
        ) : (
          <Avatar name={businessName} size="md" />
        )}
        {!logoUrl && <p className="text-label text-foreground/70">{text.none}</p>}
      </div>

      {error && <Alert tone="error">{error}</Alert>}
      {notice && <Alert tone="success">{notice}</Alert>}

      {canEdit && !uploadAvailable && <Alert tone="info">{text.unavailable}</Alert>}
      {canEdit && uploadAvailable && (
        <div className="flex flex-wrap gap-3">
          <input
            id={inputId}
            type="file"
            accept={LOGO_CONTENT_TYPES.join(',')}
            className="sr-only"
            disabled={isBusy}
            onChange={(event) => void chooseFile(event)}
          />
          <Button type="button" loading={isBusy} onClick={() => document.getElementById(inputId)?.click()}>
            {logoUrl ? text.change : text.upload}
          </Button>
          {logoUrl && (
            <Button type="button" variant="outline" disabled={isBusy} onClick={() => void removeLogo()}>
              {text.remove}
            </Button>
          )}
        </div>
      )}
    </SettingsSection>
  );
}
