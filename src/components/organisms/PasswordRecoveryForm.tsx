'use client';

import { Alert } from '@/components/molecules/Alert';
import { Button } from '@/components/atoms/Button';
import { ButtonLink } from '@/components/atoms/ButtonLink';
import { Input } from '@/components/atoms/Input';
import { Text } from '@/components/atoms/Text';
import { TextButton } from '@/components/atoms/TextButton';
import { PasswordInput } from '@/components/molecules/PasswordInput';
import { FormField } from '@/components/molecules/FormField';
import { RECOVERY_CONTENT } from '@/content/password';
import { usePasswordRecovery } from '@/features/auth/use-password-recovery';

function Heading({ title, subtitle }: Readonly<{ title: string; subtitle: string }>) {
  return (
    <div className="flex flex-col gap-1">
      <Text variant="h2" as="h1">
        {title}
      </Text>
      <Text variant="label" className="text-foreground/70">
        {subtitle}
      </Text>
    </div>
  );
}

/**
 * Recuperar la contraseña en tres pasos: pedir el código, canjearlo con la contraseña nueva y el
 * aviso final. Solo diseño: la lógica vive en `usePasswordRecovery`.
 */
export function PasswordRecoveryForm() {
  const { step, values, fieldErrors, formError, isSubmitting, codeResent, setField, submit, resendCode, changePhone } = usePasswordRecovery();
  const text = RECOVERY_CONTENT;

  if (step === 'done') {
    return (
      <div className="flex flex-col gap-5">
        <Heading title={text.done.title} subtitle={text.done.subtitle} />
        <ButtonLink href="/login" className="w-full">
          {text.done.action}
        </ButtonLink>
      </div>
    );
  }

  const isReset = step === 'reset';
  const content = isReset ? text.reset : text.request;

  return (
    <form onSubmit={(event) => void submit(event)} noValidate aria-label={content.title} className="flex flex-col gap-5">
      <Heading title={content.title} subtitle={content.subtitle} />

      {isReset ? (
        <>
          <FormField label={text.reset.code.label} hint={text.reset.code.hint} error={fieldErrors.code}>
            <Input name="code" inputMode="numeric" autoComplete="one-time-code" placeholder={text.reset.code.placeholder} value={values.code} onChange={setField('code')} />
          </FormField>
          <FormField label={text.reset.newPassword.label} hint={text.reset.newPassword.hint} error={fieldErrors.newPassword}>
            <PasswordInput name="newPassword" autoComplete="new-password" placeholder="••••••••" value={values.newPassword} onChange={setField('newPassword')} />
          </FormField>
          <FormField label={text.reset.confirmPassword.label} error={fieldErrors.confirmPassword}>
            <PasswordInput name="confirmPassword" autoComplete="new-password" placeholder="••••••••" value={values.confirmPassword} onChange={setField('confirmPassword')} />
          </FormField>
        </>
      ) : (
        <>
          <FormField label={text.request.phone.label} error={fieldErrors.phone}>
            <Input name="phone" type="tel" inputMode="tel" autoComplete="username" placeholder={text.request.phone.placeholder} value={values.phone} onChange={setField('phone')} />
          </FormField>
          <Text variant="small" className="text-foreground/70">
            {text.request.note}
          </Text>
        </>
      )}

      {codeResent && <Alert tone="success">{text.reset.resent}</Alert>}
      {formError && <Alert tone="error">{formError}</Alert>}

      <Button type="submit" loading={isSubmitting} className="w-full">
        {isReset ? text.reset.submit : text.request.submit}
      </Button>

      {isReset && (
        <div className="flex justify-between">
          <TextButton disabled={isSubmitting} onClick={() => void resendCode()}>
            {text.reset.resend}
          </TextButton>
          <TextButton disabled={isSubmitting} onClick={changePhone}>
            {text.reset.changePhone}
          </TextButton>
        </div>
      )}
    </form>
  );
}
