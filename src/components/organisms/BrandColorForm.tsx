'use client';

import { Button } from '@/components/atoms/Button';
import { Alert } from '@/components/molecules/Alert';
import { FormField } from '@/components/molecules/FormField';
import { SettingsSection } from '@/components/molecules/SettingsSection';
import { SETTINGS_TEXT } from '@/content/settings';
import { useBrandColorForm } from '@/features/lender/use-settings-forms';

export interface BrandColorFormProps {
  /** Color de marca guardado (`#RRGGBB`); `null` es el de Fiaro. */
  readonly brandColor: string | null;
  readonly canEdit: boolean;
}

/** "Color de marca": elegir el color del panel, con una vista previa. Solo diseño; la lógica vive en `useBrandColorForm`. */
export function BrandColorForm({ brandColor, canEdit }: Readonly<BrandColorFormProps>) {
  const form = useBrandColorForm({ brandColor });
  const text = SETTINGS_TEXT.brand;

  return (
    <SettingsSection title={text.title} description={text.description}>
      <form onSubmit={form.submit} noValidate aria-label={text.title} className="flex flex-col gap-4">
        <FormField label={text.colorLabel} error={form.fieldError}>
          <input
            name="brandColor"
            type="color"
            value={form.color}
            onChange={form.changeColor}
            disabled={!canEdit}
            className="h-11 w-24 cursor-pointer rounded-sm border border-foreground/12 bg-surface p-1 disabled:cursor-not-allowed disabled:opacity-60"
          />
        </FormField>
        <div className="flex items-center gap-3">
          <span className="text-small text-foreground/70">{text.preview}</span>
          <span
            aria-hidden="true"
            className="inline-flex h-11 items-center rounded-md px-5 text-label font-semibold text-white"
            style={{ backgroundColor: form.color }}
          >
            Fiaro
          </span>
        </div>
        {form.error && <Alert tone="error">{form.error}</Alert>}
        {form.notice && <Alert tone="success">{form.notice}</Alert>}
        {canEdit && (
          <div className="flex flex-wrap gap-3">
            <Button type="submit" loading={form.isSubmitting}>
              {text.save}
            </Button>
            {form.isCustom && (
              <Button type="button" variant="text" disabled={form.isSubmitting} onClick={() => void form.reset()}>
                {text.reset}
              </Button>
            )}
          </div>
        )}
      </form>
    </SettingsSection>
  );
}
