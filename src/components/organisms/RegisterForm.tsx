'use client';

import { Button } from '@/components/atoms/Button';
import { Text } from '@/components/atoms/Text';
import { Alert } from '@/components/molecules/Alert';
import { Stepper } from '@/components/molecules/Stepper';
import { RegisterAccountFields } from '@/components/organisms/RegisterAccountFields';
import { RegisterCompanyFields } from '@/components/organisms/RegisterCompanyFields';
import { REGISTER_STEP_CONTENT, REGISTER_STEP_LABELS } from '@/content/register';
import { REGISTER_STEPS } from '@/features/auth/register-schemas';
import type { useRegisterForm } from '@/features/auth/use-register-form';

type RegisterState = ReturnType<typeof useRegisterForm>;

/** Formulario de registro en dos pasos. Solo diseño: la lógica vive en `useRegisterForm`. */
export function RegisterForm({ form }: Readonly<{ form: RegisterState }>) {
  const { step, formError, isSubmitting, goBack, submit } = form;
  const content = REGISTER_STEP_CONTENT[step];

  return (
    <form onSubmit={submit} noValidate aria-label="Registro" className="flex flex-col gap-5">
      <Stepper steps={REGISTER_STEP_LABELS} current={REGISTER_STEPS.indexOf(step)} size="sm" />
      <div className="flex flex-col gap-1">
        <Text variant="h2" as="h1" className="text-[24px]">
          {content.title}
        </Text>
        <Text variant="label" className="text-foreground/70">
          {content.subtitle}
        </Text>
      </div>

      {step === 'account' ? <RegisterAccountFields {...form} /> : <RegisterCompanyFields {...form} />}

      {formError && <Alert tone="error">{formError}</Alert>}

      <div className="flex gap-3">
        {step === 'company' && (
          <Button type="button" variant="outline" disabled={isSubmitting} onClick={goBack} className="flex-1">
            Atrás
          </Button>
        )}
        <Button type="submit" loading={isSubmitting} className="flex-1">
          {content.submitLabel}
        </Button>
      </div>
    </form>
  );
}
