'use client';

import { Alert } from '@/components/molecules/Alert';
import { Button } from '@/components/atoms/Button';
import { Input } from '@/components/atoms/Input';
import { Link } from '@/components/atoms/Link';
import { Text } from '@/components/atoms/Text';
import { PasswordInput } from '@/components/molecules/PasswordInput';
import { FormField } from '@/components/molecules/FormField';
import { useLoginForm } from '@/features/auth/use-login-form';

export interface LoginFormProps {
  /** Ruta interna a la que se va tras iniciar sesión. */
  readonly redirectTo: string;
  /** A dónde lleva "¿Olvidaste tu contraseña?". */
  readonly forgotPasswordHref: string;
}

/** Formulario de inicio de sesión (celular + contraseña). Solo diseño: la lógica vive en `useLoginForm`. */
export function LoginForm({ redirectTo, forgotPasswordHref }: Readonly<LoginFormProps>) {
  const { values, fieldErrors, formError, isSubmitting, setField, submit } = useLoginForm({ redirectTo });

  return (
    <form onSubmit={(event) => void submit(event)} noValidate aria-label="Inicio de sesión" className="flex flex-col gap-5">
      <div className="flex flex-col gap-1">
        <Text variant="h2" as="h1">
          Inicia sesión
        </Text>
        <Text variant="label" className="text-foreground/70">
          Ingresa a tu panel de Fiaro.
        </Text>
      </div>

      <FormField label="Celular" error={fieldErrors.phone}>
        <Input
          name="phone"
          type="tel"
          inputMode="tel"
          autoComplete="username"
          placeholder="300 123 4567"
          value={values.phone}
          onChange={setField('phone')}
        />
      </FormField>

      <FormField label="Contraseña" error={fieldErrors.password}>
        <PasswordInput
          name="password"
          autoComplete="current-password"
          placeholder="••••••••"
          value={values.password}
          onChange={setField('password')}
        />
      </FormField>

      <div className="flex justify-end">
        <Link href={forgotPasswordHref} size="caption" className="inline-flex min-h-11 items-center font-semibold">
          ¿Olvidaste tu contraseña?
        </Link>
      </div>

      {formError && <Alert tone="error">{formError}</Alert>}

      <Button type="submit" loading={isSubmitting} className="w-full">
        Iniciar sesión
      </Button>
    </form>
  );
}
