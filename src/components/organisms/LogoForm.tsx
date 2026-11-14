'use client';

import { Alert } from '@/components/molecules/Alert';
import { Avatar } from '@/components/atoms/Avatar';
import { ImageActions } from '@/components/molecules/ImageActions';
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
        <ImageActions
          accept={LOGO_CONTENT_TYPES.join(',')}
          hasImage={Boolean(logoUrl)}
          isBusy={isBusy}
          onChoose={chooseFile}
          onRemove={removeLogo}
          labels={{ upload: text.upload, change: text.change, remove: text.remove, confirmTitle: text.confirmTitle, confirmDescription: text.confirmDescription, confirmLabel: text.confirmLabel }}
        />
      )}
    </SettingsSection>
  );
}
