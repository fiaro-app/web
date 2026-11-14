import { Input } from '@/components/atoms/Input';
import { PasswordInput } from '@/components/molecules/PasswordInput';
import { FormField } from '@/components/molecules/FormField';
import { FormFieldset } from '@/components/molecules/FormFieldset';
import type { useRegisterForm } from '@/features/auth/use-register-form';

type RegisterState = ReturnType<typeof useRegisterForm>;

/** Campos del paso 1 del registro: datos de la persona. Solo diseño. */
export function RegisterAccountFields({ values, fieldErrors, setField }: Readonly<Pick<RegisterState, 'values' | 'fieldErrors' | 'setField'>>) {
  return (
    <FormFieldset>
      <FormField label="Nombre completo" error={fieldErrors.fullName}>
        <Input name="fullName" autoComplete="name" placeholder="Ej: Daniel Rojas" value={values.fullName} onChange={setField('fullName')} />
      </FormField>
      <FormField label="Celular" hint="Con este celular iniciarás sesión." error={fieldErrors.phone}>
        <Input name="phone" type="tel" inputMode="tel" autoComplete="tel" placeholder="300 123 4567" value={values.phone} onChange={setField('phone')} />
      </FormField>
      <FormField label="Cédula de ciudadanía" hint="Solo números, sin puntos." error={fieldErrors.nationalId}>
        <Input name="nationalId" inputMode="numeric" autoComplete="off" placeholder="Ej: 1020304050" value={values.nationalId} onChange={setField('nationalId')} />
      </FormField>
      <FormField label="Correo electrónico (opcional)" hint="Sirve para recuperar tu contraseña." error={fieldErrors.contactEmail}>
        <Input name="contactEmail" type="email" inputMode="email" autoComplete="email" placeholder="tu@correo.com" value={values.contactEmail} onChange={setField('contactEmail')} />
      </FormField>
      <FormField label="Contraseña" hint="Mínimo 15 caracteres. Sirve una frase fácil de recordar, como «la tienda abre a las seis»." error={fieldErrors.password}>
        <PasswordInput name="password" autoComplete="new-password" placeholder="••••••••" value={values.password} onChange={setField('password')} />
      </FormField>
    </FormFieldset>
  );
}
