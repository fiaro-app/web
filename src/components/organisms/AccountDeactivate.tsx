'use client';

import { Alert } from '@/components/molecules/Alert';
import { Button } from '@/components/atoms/Button';
import { PasswordInput } from '@/components/molecules/PasswordInput';
import { ConfirmDialog } from '@/components/molecules/ConfirmDialog';
import { FormField } from '@/components/molecules/FormField';
import { ACCOUNT_TEXT } from '@/content/account';
import { useDeactivateAccount } from '@/features/account/use-deactivate-account';

/** Desactivar la cuenta confirmando con la contraseña. Lógica en `useDeactivateAccount`. */
export function AccountDeactivate() {
  const text = ACCOUNT_TEXT.danger;
  const { password, passwordError, formError, isSubmitting, isConfirming, changePassword, submit, cancel, confirm } = useDeactivateAccount();

  return (
    <form onSubmit={submit} noValidate aria-label={text.title} className="flex flex-col gap-4">
      <FormField label={text.password.label} error={passwordError}>
        <PasswordInput name="password" autoComplete="current-password" placeholder="••••••••" value={password} onChange={changePassword} />
      </FormField>
      {formError && <Alert tone="error">{formError}</Alert>}
      <Button type="submit" variant="text" loading={isSubmitting} className="self-start text-destructive">
        {text.submit}
      </Button>
      <ConfirmDialog
        open={isConfirming}
        title={text.confirmTitle}
        description={text.confirmDescription}
        confirmLabel={text.confirmLabel}
        onCancel={cancel}
        onConfirm={() => void confirm()}
      />
    </form>
  );
}
