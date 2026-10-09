'use client';

import { useState } from 'react';
import { Alert } from '@/components/molecules/Alert';
import { Button } from '@/components/atoms/Button';
import { PasswordInput } from '@/components/molecules/PasswordInput';
import { FormField } from '@/components/molecules/FormField';
import { ACCOUNT_TEXT } from '@/content/account';
import { useChangePasswordForm } from '@/features/auth/use-change-password-form';

/** Cambiar la contraseña desde la cuenta. Reutiliza `useChangePasswordForm`, pero se queda en la pantalla. */
export function AccountPasswordForm() {
  const text = ACCOUNT_TEXT.password;
  const [done, setDone] = useState(false);
  const { values, fieldErrors, formError, isSubmitting, setField, submit } = useChangePasswordForm({ onSuccess: () => setDone(true) });

  return (
    <form
      onSubmit={(event) => {
        setDone(false);
        void submit(event);
      }}
      noValidate
      aria-label={text.title}
      className="flex flex-col gap-4"
    >
      <FormField label={text.currentPassword.label} error={fieldErrors.currentPassword}>
        <PasswordInput name="currentPassword" autoComplete="current-password" placeholder="••••••••" value={values.currentPassword} onChange={setField('currentPassword')} />
      </FormField>
      <FormField label={text.newPassword.label} hint={text.newPassword.hint} error={fieldErrors.newPassword}>
        <PasswordInput name="newPassword" autoComplete="new-password" placeholder="••••••••" value={values.newPassword} onChange={setField('newPassword')} />
      </FormField>
      <FormField label={text.confirmPassword.label} error={fieldErrors.confirmPassword}>
        <PasswordInput name="confirmPassword" autoComplete="new-password" placeholder="••••••••" value={values.confirmPassword} onChange={setField('confirmPassword')} />
      </FormField>

      {formError && <Alert tone="error">{formError}</Alert>}
      {done && <Alert tone="success">{text.done}</Alert>}

      <Button type="submit" loading={isSubmitting} className="self-start">
        {text.submit}
      </Button>
    </form>
  );
}
