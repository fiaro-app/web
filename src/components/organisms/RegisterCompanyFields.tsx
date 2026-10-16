import NextLink from 'next/link';
import { Checkbox } from '@/components/atoms/Checkbox';
import { Input } from '@/components/atoms/Input';
import { FormField } from '@/components/molecules/FormField';
import { FormFieldset } from '@/components/molecules/FormFieldset';
import { CONSENT_TEXT, PRIVACY, TERMS } from '@/content/legal';
import type { RegisterConsents } from '@/features/auth/register-schemas';
import type { useRegisterForm } from '@/features/auth/use-register-form';

type RegisterState = ReturnType<typeof useRegisterForm>;

const LINK_CLASS = 'font-medium text-primary underline underline-offset-2 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none';

interface ConsentRowProps {
  readonly name: keyof RegisterConsents;
  readonly checked: boolean;
  readonly invalid: boolean;
  readonly onChange: RegisterState['setConsent'] extends (key: never) => infer Handler ? Handler : never;
  readonly children: React.ReactNode;
}

/** Una casilla con su texto; si es obligatoria y falta, muestra por qué. */
function ConsentRow({ name, checked, invalid, onChange, children }: Readonly<ConsentRowProps>) {
  const id = `consent-${name}`;
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-start gap-3">
        <Checkbox id={id} name={name} checked={checked} invalid={invalid} onChange={onChange} aria-describedby={invalid ? `${id}-error` : undefined} className="mt-0.5" />
        <label htmlFor={id} className="text-label text-foreground/85">
          {children}
        </label>
      </div>
      {invalid && (
        <p id={`${id}-error`} role="alert" className="pl-8 text-caption text-destructive">
          {CONSENT_TEXT.required}
        </p>
      )}
    </div>
  );
}

/** Campos del paso 2 del registro: el negocio y las autorizaciones. Solo diseño. */
export function RegisterCompanyFields({
  values,
  fieldErrors,
  setField,
  consents,
  consentErrors,
  setConsent,
}: Readonly<Pick<RegisterState, 'values' | 'fieldErrors' | 'setField' | 'consents' | 'consentErrors' | 'setConsent'>>) {
  return (
    <div className="flex flex-col gap-5">
      <FormFieldset>
        <FormField label="Nombre de la financiera" error={fieldErrors.businessName}>
          <Input name="businessName" autoComplete="organization" placeholder="Ej: Financiera Buen Vecino" value={values.businessName} onChange={setField('businessName')} />
        </FormField>
      </FormFieldset>
      <fieldset className="flex flex-col gap-4 border-0 p-0">
        <legend className="mb-1 text-label font-semibold text-foreground">{CONSENT_TEXT.legend}</legend>
        <ConsentRow name="terms" checked={consents.terms} invalid={consentErrors.includes('terms')} onChange={setConsent('terms')}>
          {CONSENT_TEXT.terms.before}
          <NextLink href={TERMS.path} target="_blank" className={LINK_CLASS}>
            {CONSENT_TEXT.terms.link}
          </NextLink>
          {CONSENT_TEXT.terms.after}
        </ConsentRow>
        <ConsentRow name="privacy" checked={consents.privacy} invalid={consentErrors.includes('privacy')} onChange={setConsent('privacy')}>
          {CONSENT_TEXT.privacy.before}
          <NextLink href={PRIVACY.path} target="_blank" className={LINK_CLASS}>
            {CONSENT_TEXT.privacy.link}
          </NextLink>
          {CONSENT_TEXT.privacy.after}
        </ConsentRow>
        <ConsentRow name="responsibility" checked={consents.responsibility} invalid={consentErrors.includes('responsibility')} onChange={setConsent('responsibility')}>
          {CONSENT_TEXT.responsibility}
        </ConsentRow>
        <ConsentRow name="marketing" checked={consents.marketing} invalid={false} onChange={setConsent('marketing')}>
          {CONSENT_TEXT.marketing}
        </ConsentRow>
      </fieldset>
    </div>
  );
}
