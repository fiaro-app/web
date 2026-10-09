'use client';

import { Alert } from '@/components/molecules/Alert';
import { Button } from '@/components/atoms/Button';
import { Input } from '@/components/atoms/Input';
import { FormField } from '@/components/molecules/FormField';
import { ACCOUNT_TEXT } from '@/content/account';
import { useContactEmailVerification } from '@/features/account/use-contact-email-verification';

/** Verificar el correo de contacto con el código que llegó por correo. Lógica en `useContactEmailVerification`. */
export function EmailVerificationForm({ email }: Readonly<{ email: string }>) {
  const text = ACCOUNT_TEXT.verification;
  const { code, codeError, formError, notice, isBusy, changeCode, resend, submit } = useContactEmailVerification();

  return (
    <form onSubmit={submit} noValidate aria-label={text.pending} className="flex flex-col gap-3 rounded-md bg-surface-2 p-4">
      <p className="text-small font-semibold text-warning">
        {text.pending}: {email}
      </p>
      <FormField label={text.code.label} hint={text.hint} error={codeError}>
        <Input name="code" inputMode="numeric" autoComplete="one-time-code" placeholder={text.code.placeholder} value={code} onChange={changeCode} />
      </FormField>

      {formError && <Alert tone="error">{formError}</Alert>}
      {notice && <Alert tone="success">{notice}</Alert>}

      <div className="flex flex-wrap gap-3">
        <Button type="submit" loading={isBusy}>
          {text.submit}
        </Button>
        <Button type="button" variant="outline" disabled={isBusy} onClick={() => void resend()}>
          {text.resend}
        </Button>
      </div>
    </form>
  );
}
