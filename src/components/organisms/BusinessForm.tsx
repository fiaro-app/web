'use client';

import { ConfirmForm } from '@/components/molecules/ConfirmForm';
import { COMMON_TEXT } from '@/content/common';
import { Button } from '@/components/atoms/Button';
import { Input } from '@/components/atoms/Input';
import { Alert } from '@/components/molecules/Alert';
import { FormField } from '@/components/molecules/FormField';
import { SettingsSection } from '@/components/molecules/SettingsSection';
import { SETTINGS_TEXT } from '@/content/settings';
import { useBusinessForm } from '@/features/lender/use-settings-forms';

/** "Datos del negocio": cambiar el nombre. Solo diseño; la lógica vive en `useBusinessForm`. */
export function BusinessForm({ name, canEdit }: Readonly<{ name: string; canEdit: boolean }>) {
  const form = useBusinessForm({ name });
  const text = SETTINGS_TEXT.business;

  return (
    <SettingsSection title={text.title} description={text.description}>
      <ConfirmForm
        confirmation={COMMON_TEXT.confirm.save} onSubmit={form.submit} noValidate aria-label={text.title} className="flex flex-col gap-4">
        <FormField label={text.nameLabel} error={form.fieldError}>
          <Input name="name" autoComplete="organization" placeholder={text.namePlaceholder} value={form.name} onChange={form.changeName} disabled={!canEdit} />
        </FormField>
        {form.error && <Alert tone="error">{form.error}</Alert>}
        {form.notice && <Alert tone="success">{form.notice}</Alert>}
        {canEdit && (
          <Button type="submit" loading={form.isSubmitting}>
            {text.save}
          </Button>
        )}
      </ConfirmForm>
    </SettingsSection>
  );
}
