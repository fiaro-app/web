import { Input } from '@/components/atoms/Input';
import { FormField } from '@/components/molecules/FormField';
import { FormFieldset } from '@/components/molecules/FormFieldset';
import type { useRegisterForm } from '@/features/auth/use-register-form';

type RegisterState = ReturnType<typeof useRegisterForm>;

/** Campos del paso 2 del registro: el negocio. Solo diseño. */
export function RegisterCompanyFields({ values, fieldErrors, setField }: Readonly<Pick<RegisterState, 'values' | 'fieldErrors' | 'setField'>>) {
  return (
    <FormFieldset>
      <FormField label="Nombre de la financiera" required error={fieldErrors.businessName}>
        <Input name="businessName" autoComplete="organization" placeholder="Ej: Financiera Buen Vecino" value={values.businessName} onChange={setField('businessName')} />
      </FormField>
    </FormFieldset>
  );
}
