'use client';

import { ConfirmForm } from '@/components/molecules/ConfirmForm';
import { COMMON_TEXT } from '@/content/common';
import { Alert } from '@/components/molecules/Alert';
import { Button } from '@/components/atoms/Button';
import { Input } from '@/components/atoms/Input';
import { FormField } from '@/components/molecules/FormField';
import { ACCOUNT_TEXT } from '@/content/account';
import { useProfileForm } from '@/features/account/use-profile-form';

export interface AccountProfileFormProps {
  readonly fullName: string;
  readonly phoneNumber: string;
  readonly contactEmail: string | null;
}

/** Datos de la persona: nombre editable, celular de solo lectura y correo de contacto. Lógica en `useProfileForm`. */
export function AccountProfileForm({ fullName, phoneNumber, contactEmail }: Readonly<AccountProfileFormProps>) {
  const text = ACCOUNT_TEXT.profile;
  const { values, fieldErrors, formError, notice, isSubmitting, setField, submit } = useProfileForm({ fullName, contactEmail });

  return (
    <ConfirmForm
      confirmation={COMMON_TEXT.confirm.save} onSubmit={submit} noValidate aria-label={text.title} className="flex flex-col gap-4">
      <FormField label={text.fullName.label} error={fieldErrors.fullName}>
        <Input name="fullName" autoComplete="name" placeholder={text.fullName.placeholder} value={values.fullName} onChange={setField('fullName')} />
      </FormField>
      <FormField label={text.phone.label} hint={text.phone.hint}>
        <Input name="phone" value={phoneNumber} disabled readOnly />
      </FormField>
      <FormField label={text.contactEmail.label} hint={text.contactEmail.hint} error={fieldErrors.contactEmail}>
        <Input
          name="contactEmail"
          type="email"
          autoComplete="email"
          placeholder={text.contactEmail.placeholder}
          value={values.contactEmail}
          onChange={setField('contactEmail')}
        />
      </FormField>

      {formError && <Alert tone="error">{formError}</Alert>}
      {notice && <Alert tone="success">{notice}</Alert>}

      <Button type="submit" loading={isSubmitting} className="self-start">
        {text.save}
      </Button>
    </ConfirmForm>
  );
}
