'use client';

import { ConfirmForm } from '@/components/molecules/ConfirmForm';
import { COMMON_TEXT } from '@/content/common';
import { Button } from '@/components/atoms/Button';
import { Alert } from '@/components/molecules/Alert';
import { FormField } from '@/components/molecules/FormField';
import { SettingsSection } from '@/components/molecules/SettingsSection';
import { SETTINGS_TEXT } from '@/content/settings';
import { swatchesFor } from '@/features/lender/brand-palette';
import { useBrandColorForm } from '@/features/lender/use-settings-forms';

export interface BrandColorFormProps {
  /** Color de marca guardado (`#RRGGBB`); `null` es el de Fiaro. */
  readonly brandColor: string | null;
  readonly canEdit: boolean;
}

/** "Color de marca": elegir el color del panel entre una gama corta, con una vista previa. Solo diseño; la lógica vive en `useBrandColorForm`. */
export function BrandColorForm({ brandColor, canEdit }: Readonly<BrandColorFormProps>) {
  const form = useBrandColorForm({ brandColor });
  const text = SETTINGS_TEXT.brand;

  return (
    <SettingsSection title={text.title} description={text.description}>
      <ConfirmForm
        confirmation={COMMON_TEXT.confirm.save} onSubmit={form.submit} noValidate aria-label={text.title} className="flex flex-col gap-4">
        <FormField label={text.colorLabel} error={form.fieldError}>
          <fieldset className="flex flex-wrap gap-3" disabled={!canEdit}>
            <legend className="sr-only">{text.colorLabel}</legend>
            {swatchesFor(brandColor, text.currentColor).map((swatch) => (
              <label key={swatch.value} className="flex cursor-pointer flex-col items-center gap-1.5 text-caption has-[:disabled]:cursor-not-allowed has-[:disabled]:opacity-60">
                <input
                  type="radio"
                  name="brandColor"
                  value={swatch.value}
                  checked={form.color.toUpperCase() === swatch.value.toUpperCase()}
                  onChange={() => form.chooseColor(swatch.value)}
                  className="peer sr-only"
                />
                <span
                  aria-hidden="true"
                  style={{ backgroundColor: swatch.value }}
                  className="size-11 rounded-full border-2 border-surface ring-2 ring-foreground/15 transition peer-checked:ring-4 peer-checked:ring-primary peer-focus-visible:ring-4 peer-focus-visible:ring-ring"
                />
                <span className="text-foreground/80 peer-checked:font-semibold peer-checked:text-foreground">{swatch.label}</span>
              </label>
            ))}
          </fieldset>
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
      </ConfirmForm>
    </SettingsSection>
  );
}
