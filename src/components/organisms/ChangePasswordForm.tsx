'use client';

import { Alert } from '@/components/molecules/Alert';
import { Button } from '@/components/atoms/Button';
import { Input } from '@/components/atoms/Input';
import { Text } from '@/components/atoms/Text';
import { FormField } from '@/components/molecules/FormField';
import { CHANGE_PASSWORD_CONTENT } from '@/content/password';
import { useChangePasswordForm } from '@/features/auth/use-change-password-form';

/** Cambio obligatorio de la contraseña temporal. Solo diseño: la lógica vive en `useChangePasswordForm`. */
export function ChangePasswordForm({ redirectTo }: Readonly<{ redirectTo: string }>) {
  const { values, fieldErrors, formError, isSubmitting, setField, submit } = useChangePasswordForm({ redirectTo });
  const text = CHANGE_PASSWORD_CONTENT.form;

  return (
    <form onSubmit={submit} noValidate aria-label={text.title} className="flex flex-col gap-5">
      <div className="flex flex-col gap-1">
        <Text variant="h2" as="h1">
          {text.title}
        </Text>
        <Text variant="label" className="text-foreground/70">
          {text.subtitle}
        </Text>
      </div>

      <FormField label={text.currentPassword.label} error={fieldErrors.currentPassword}>
        <Input name="currentPassword" type="password" autoComplete="current-password" placeholder="••••••••" value={values.currentPassword} onChange={setField('currentPassword')} />
      </FormField>
      <FormField label={text.newPassword.label} hint={text.newPassword.hint} error={fieldErrors.newPassword}>
        <Input name="newPassword" type="password" autoComplete="new-password" placeholder="••••••••" value={values.newPassword} onChange={setField('newPassword')} />
      </FormField>
      <FormField label={text.confirmPassword.label} error={fieldErrors.confirmPassword}>
        <Input name="confirmPassword" type="password" autoComplete="new-password" placeholder="••••••••" value={values.confirmPassword} onChange={setField('confirmPassword')} />
      </FormField>

      {formError && <Alert tone="error">{formError}</Alert>}

      <Button type="submit" loading={isSubmitting} className="w-full">
        {text.submit}
      </Button>
    </form>
  );
}
