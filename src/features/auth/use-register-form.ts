'use client';

import { useRouter } from 'next/navigation';
import { useCallback, useState, type ChangeEvent, type SubmitEvent } from 'react';
import { registerOwner, signIn } from '@/features/auth/auth-api';
import { describeAuthError, issueFieldErrors } from '@/features/auth/error-messages';
import {
  AccountStepSchema,
  CompanyStepSchema,
  REGISTER_STEP_FIELDS,
  type RegisterField,
  type RegisterFormInput,
  type RegisterStep,
} from '@/features/auth/register-schemas';
import { LOGIN_PATH } from '@/features/auth/route-guard';
import { toFieldErrors, type FieldErrors } from '@/lib/forms';
import { turnstileEnabled } from '@/components/molecules/TurnstileWidget';

const EMPTY_VALUES: RegisterFormInput = {
  fullName: '',
  phone: '',
  nationalId: '',
  contactEmail: '',
  password: '',
  businessName: '',
};

export interface UseRegisterFormOptions {
  /** Ruta interna a la que se va tras registrarse e iniciar sesión. */
  readonly redirectTo: string;
}

/** Paso al que pertenece un campo, para devolver a la persona al paso donde está el error. */
function stepOf(field: RegisterField): RegisterStep {
  return (REGISTER_STEP_FIELDS.account as readonly RegisterField[]).includes(field) ? 'account' : 'company';
}

/**
 * Lógica del registro en dos pasos (cuenta y negocio), sin nada de diseño: valores, validación de
 * cada paso con los schemas del contrato, `POST /register`, inicio de sesión automático y manejo de
 * errores (por campo, volviendo al paso que corresponde, o del formulario). La vista solo pinta.
 */
export function useRegisterForm({ redirectTo }: UseRegisterFormOptions) {
  const router = useRouter();
  const [step, setStep] = useState<RegisterStep>('account');
  const [values, setValues] = useState<RegisterFormInput>(EMPTY_VALUES);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors<RegisterField>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [turnstileResetKey, setTurnstileResetKey] = useState(0);
  const turnstileError = useCallback(
    () =>
      setFormError(
        'No pudimos cargar la verificación de seguridad. Recarga la página e inténtalo de nuevo.',
      ),
    [],
  );

  const setField = (field: RegisterField) => (event: ChangeEvent<HTMLInputElement>) => {
    setValues((current) => ({ ...current, [field]: event.target.value }));
    setFieldErrors((current) => ({ ...current, [field]: undefined }));
  };

  const goBack = () => {
    setStep('account');
    setFormError(null);
  };

  const showErrors = (errors: FieldErrors<RegisterField>, message: string | null = null) => {
    setFieldErrors(errors);
    setFormError(message);
    const firstField = (Object.keys(errors) as RegisterField[])[0];
    if (firstField) setStep(stepOf(firstField));
  };

  const fail = (error: unknown) => {
    const { message, field } = describeAuthError(error);
    const errors: FieldErrors<RegisterField> = issueFieldErrors(error);
    // Solo los campos que este formulario tiene (el mismo error en otro formulario apunta a otro campo).
    if (field && field in EMPTY_VALUES) errors[field as RegisterField] = message;
    showErrors(errors, Object.keys(errors).length === 0 ? message : null);
    setIsSubmitting(false);
  };

  const finish = async (phone: string, password: string) => {
    try {
      await signIn({ phone, password });
      router.replace(redirectTo);
    } catch {
      // La cuenta ya existe: si no se pudo abrir la sesión sola, que la abra la persona.
      router.replace(LOGIN_PATH);
    }
    router.refresh();
  };

  const submit = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSubmitting) return;

    const account = AccountStepSchema.safeParse(values);
    if (!account.success) {
      showErrors(toFieldErrors<RegisterField>(account.error));
      return;
    }
    if (step === 'account') {
      setFieldErrors({});
      setStep('company');
      return;
    }

    const company = CompanyStepSchema.safeParse(values);
    if (!company.success) {
      showErrors(toFieldErrors<RegisterField>(company.error));
      return;
    }

    setIsSubmitting(true);
    setFieldErrors({});
    setFormError(null);
    if (turnstileEnabled && !turnstileToken) {
      setFormError('Completa la verificación de seguridad para continuar.');
      setIsSubmitting(false);
      return;
    }
    try {
      await registerOwner(account.data, company.data, turnstileToken ?? undefined);
    } catch (error) {
      setTurnstileToken(null);
      setTurnstileResetKey((current) => current + 1);
      fail(error);
      return;
    }
    await finish(account.data.phone, account.data.password);
  };

  return {
    step,
    values,
    fieldErrors,
    formError,
    isSubmitting,
    setField,
    goBack,
    submit,
    turnstileResetKey,
    setTurnstileToken,
    turnstileError,
  };
}
