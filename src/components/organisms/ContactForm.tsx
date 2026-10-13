'use client';

import { Button } from '@/components/atoms/Button';
import { Input } from '@/components/atoms/Input';
import { Textarea } from '@/components/atoms/Textarea';
import { Alert } from '@/components/molecules/Alert';
import { FormField } from '@/components/molecules/FormField';
import { FormFieldset } from '@/components/molecules/FormFieldset';
import { TurnstileWidget } from '@/components/molecules/TurnstileWidget';
import { CONTACT_CONTENT } from '@/content/contact';
import type { useContactForm } from '@/features/leads/use-contact-form';

type ContactFormState = ReturnType<typeof useContactForm>;

/** Formulario «Contactar ventas». Solo diseño: la lógica vive en `useContactForm`. */
export function ContactForm({ form }: Readonly<{ form: ContactFormState }>) {
  const {
    values,
    fieldErrors,
    formError,
    isSubmitting,
    setField,
    submit,
    turnstileResetKey,
    setTurnstileToken,
    turnstileError,
  } = form;
  const text = CONTACT_CONTENT.form;

  return (
    <form onSubmit={submit} noValidate aria-label={text.label} className="flex flex-col gap-5">
      <FormFieldset>
        <FormField label={text.name.label} error={fieldErrors.name}>
          <Input name="name" autoComplete="name" placeholder={text.name.placeholder} value={values.name} onChange={setField('name')} />
        </FormField>
        <FormField label={text.phone.label} hint={text.phone.hint} error={fieldErrors.phone}>
          <Input
            name="phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            placeholder={text.phone.placeholder}
            value={values.phone}
            onChange={setField('phone')}
          />
        </FormField>
        <FormField label={text.email.label} error={fieldErrors.email}>
          <Input
            name="email"
            type="email"
            autoComplete="email"
            placeholder={text.email.placeholder}
            value={values.email}
            onChange={setField('email')}
          />
        </FormField>
        <FormField label={text.message.label} error={fieldErrors.message}>
          <Textarea name="message" rows={5} placeholder={text.message.placeholder} value={values.message} onChange={setField('message')} />
        </FormField>
      </FormFieldset>

      {/* Señuelo contra robots: una persona no lo ve ni lo llena; la API descarta el contacto si trae algo. */}
      <div aria-hidden="true" className="hidden">
        <input type="text" name="website" tabIndex={-1} autoComplete="off" />
      </div>

      <TurnstileWidget
        action="lead"
        resetKey={turnstileResetKey}
        onToken={setTurnstileToken}
        onError={turnstileError}
      />

      {formError && <Alert tone="error">{formError}</Alert>}

      <Button type="submit" loading={isSubmitting}>
        {text.submit}
      </Button>
    </form>
  );
}
