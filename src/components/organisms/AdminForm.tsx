'use client';

import { Button } from '@/components/atoms/Button';
import { ButtonLink } from '@/components/atoms/ButtonLink';
import { Input } from '@/components/atoms/Input';
import { Text } from '@/components/atoms/Text';
import { Alert } from '@/components/molecules/Alert';
import { ConfirmForm } from '@/components/molecules/ConfirmForm';
import { FormField } from '@/components/molecules/FormField';
import { FormFieldset } from '@/components/molecules/FormFieldset';
import { COMMON_TEXT } from '@/content/common';
import { ADMINS_TEXT } from '@/content/admins';
import type { useAdminForm } from '@/features/admins/use-admin-form';

type AdminFormState = ReturnType<typeof useAdminForm>;

/** Formulario "Invitar administrador". Solo diseño: la lógica vive en `useAdminForm`. */
export function AdminForm({ form }: Readonly<{ form: AdminFormState }>) {
  const { values, fieldErrors, formError, isSubmitting, setField, submit } = form;
  const text = ADMINS_TEXT.form;

  return (
    <ConfirmForm confirmation={COMMON_TEXT.confirm.create} onSubmit={submit} noValidate aria-label={text.title} className="flex max-w-lg flex-col gap-5">
      <div className="flex flex-col gap-1">
        <Text variant="title" as="h1" weight="bold" className="text-foreground">
          {text.title}
        </Text>
        <Text variant="label" className="text-foreground/70">
          {text.subtitle}
        </Text>
      </div>

      <FormFieldset>
        <FormField label={text.fullName.label} error={fieldErrors.fullName}>
          <Input name="fullName" autoComplete="off" placeholder={text.fullName.placeholder} value={values.fullName} onChange={setField('fullName')} />
        </FormField>
        <FormField label={text.nationalId.label} hint={text.nationalId.hint} error={fieldErrors.nationalId}>
          <Input name="nationalId" inputMode="numeric" autoComplete="off" placeholder={text.nationalId.placeholder} value={values.nationalId} onChange={setField('nationalId')} />
        </FormField>
        <FormField label={text.phone.label} hint={text.phone.hint} error={fieldErrors.phone}>
          <Input name="phone" type="tel" inputMode="tel" autoComplete="off" placeholder={text.phone.placeholder} value={values.phone} onChange={setField('phone')} />
        </FormField>
        <FormField label={text.contactEmail.label} hint={text.contactEmail.hint} error={fieldErrors.contactEmail}>
          <Input name="contactEmail" type="email" inputMode="email" autoComplete="off" placeholder={text.contactEmail.placeholder} value={values.contactEmail} onChange={setField('contactEmail')} />
        </FormField>
      </FormFieldset>

      {formError && <Alert tone="error">{formError}</Alert>}

      <div className="flex gap-3">
        <ButtonLink variant="outline" href="/administradores" className="flex-1">
          {text.cancel}
        </ButtonLink>
        <Button type="submit" loading={isSubmitting} className="flex-1">
          {text.submit}
        </Button>
      </div>
    </ConfirmForm>
  );
}
