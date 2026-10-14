'use client';

import { useCallback, useState, type ChangeEvent, type FormEvent } from 'react';
import { turnstileEnabled } from '@/components/molecules/TurnstileWidget';
import { requestPasswordReset, resetPassword } from '@/features/auth/auth-api';
import { describeAuthError, issueFieldErrors } from '@/features/auth/error-messages';
import { RequestResetFormSchema, ResetPasswordFormSchema } from '@/features/auth/password-schemas';
import { toFieldErrors, type FieldErrors } from '@/lib/forms';

export type RecoveryStep = 'request' | 'reset' | 'done';
export type RecoveryField = 'phone' | 'code' | 'newPassword' | 'confirmPassword';

const EMPTY_VALUES: Record<RecoveryField, string> = { phone: '', code: '', newPassword: '', confirmPassword: '' };

/** El mismo error de la API puede llamarse `password` en un formulario y `newPassword` en este. */
function toRecoveryField(field: string | null): RecoveryField | null {
  if (field === 'password') return 'newPassword';
  return field !== null && field in EMPTY_VALUES ? (field as RecoveryField) : null;
}

/**
 * Lógica de recuperar la contraseña, sin diseño: pedir el código (paso 1), canjearlo con la
 * contraseña nueva (paso 2) y terminar (paso 3, `done`). La API no revela si el celular tiene
 * cuenta, así que el paso 1 siempre avanza al 2 si la solicitud se procesó.
 */
export function usePasswordRecovery() {
  const [step, setStep] = useState<RecoveryStep>('request');
  const [values, setValues] = useState(EMPTY_VALUES);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors<RecoveryField>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [codeResent, setCodeResent] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [turnstileResetKey, setTurnstileResetKey] = useState(0);
  const turnstileError = useCallback(
    () => setFormError('No pudimos cargar la verificación de seguridad. Recarga la página e inténtalo de nuevo.'),
    [],
  );

  const setField = (field: RecoveryField) => (event: ChangeEvent<HTMLInputElement>) => {
    setValues((current) => ({ ...current, [field]: event.target.value }));
    setFieldErrors((current) => ({ ...current, [field]: undefined }));
  };

  const fail = (error: unknown) => {
    const { message, field } = describeAuthError(error);
    const errors: FieldErrors<RecoveryField> = {};
    for (const [issueField, text] of Object.entries(issueFieldErrors(error))) {
      const mapped = toRecoveryField(issueField);
      if (mapped) errors[mapped] = text;
    }
    const mapped = toRecoveryField(field);
    if (mapped) errors[mapped] = message;
    setFieldErrors(errors);
    setFormError(Object.keys(errors).length === 0 ? message : null);
    setIsSubmitting(false);
  };

  const requestCode = async (phone: string) => {
    if (turnstileEnabled && !turnstileToken) {
      setFormError('Completa la verificación de seguridad para continuar.');
      return false;
    }
    setIsSubmitting(true);
    setFormError(null);
    // Cada token sirve una vez: el siguiente pedido (reenviar el código) necesita un desafío nuevo.
    setTurnstileToken(null);
    setTurnstileResetKey((current) => current + 1);
    try {
      await requestPasswordReset(phone, turnstileToken ?? undefined);
      setStep('reset');
      setIsSubmitting(false);
      return true;
    } catch (error) {
      fail(error);
      return false;
    }
  };

  const submitRequest = async () => {
    const parsed = RequestResetFormSchema.safeParse(values);
    if (!parsed.success) {
      setFieldErrors(toFieldErrors<RecoveryField>(parsed.error));
      return;
    }
    setFieldErrors({});
    await requestCode(parsed.data.phone);
  };

  const submitReset = async () => {
    const phone = RequestResetFormSchema.safeParse(values);
    const reset = ResetPasswordFormSchema.safeParse(values);
    if (!phone.success || !reset.success) {
      setFieldErrors(toFieldErrors<RecoveryField>((reset.error ?? phone.error)!));
      return;
    }

    setIsSubmitting(true);
    setFieldErrors({});
    setFormError(null);
    try {
      await resetPassword({ phone: phone.data.phone, code: reset.data.code, newPassword: reset.data.newPassword });
      setStep('done');
      setIsSubmitting(false);
    } catch (error) {
      fail(error);
    }
  };

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSubmitting || step === 'done') return;
    await (step === 'request' ? submitRequest() : submitReset());
  };

  /** Pide un código nuevo para el mismo celular (el anterior deja de servir). */
  const resendCode = async () => {
    if (isSubmitting) return;
    const phone = RequestResetFormSchema.safeParse(values);
    if (!phone.success) return;
    setFieldErrors({});
    setCodeResent(false);
    setCodeResent(await requestCode(phone.data.phone));
  };

  const changePhone = () => {
    setStep('request');
    setFormError(null);
    setFieldErrors({});
    setCodeResent(false);
  };

  return {
    step,
    values,
    fieldErrors,
    formError,
    isSubmitting,
    codeResent,
    setField,
    submit,
    resendCode,
    changePhone,
    turnstileResetKey,
    setTurnstileToken,
    turnstileError,
  };
}
