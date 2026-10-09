'use client';

import { Button } from '@/components/atoms/Button';
import { ButtonLink } from '@/components/atoms/ButtonLink';
import { Input } from '@/components/atoms/Input';
import { Text } from '@/components/atoms/Text';
import { Alert } from '@/components/molecules/Alert';
import { FormField } from '@/components/molecules/FormField';
import { FormFieldset } from '@/components/molecules/FormFieldset';
import { CLIENTS_TEXT } from '@/content/clients';
import type { ClientResponse } from '@/features/clients/endpoints';
import { useClientForm } from '@/features/clients/use-client-form';

/** Formulario de cliente: alta, o edición si recibe `client`. Solo diseño; la lógica vive en `useClientForm`. */
export function ClientForm({ client }: Readonly<{ client?: ClientResponse }>) {
  const { values, fieldErrors, formError, isSubmitting, isEditing, setField, submit } = useClientForm({ client });
  const text = CLIENTS_TEXT.form;
  const title = isEditing ? text.editTitle : text.createTitle;

  return (
    <form onSubmit={submit} noValidate aria-label={title} className="flex max-w-lg flex-col gap-5">
      <div className="flex flex-col gap-1">
        <Text variant="title" as="h1" weight="bold" className="text-foreground">
          {title}
        </Text>
        <Text variant="label" className="text-foreground/70">
          {isEditing ? text.editSubtitle : text.createSubtitle}
        </Text>
      </div>

      <FormFieldset>
        <FormField label={text.fullName.label} required error={fieldErrors.fullName}>
          <Input name="fullName" autoComplete="off" placeholder={text.fullName.placeholder} value={values.fullName} onChange={setField('fullName')} />
        </FormField>
        <FormField label={text.nationalId.label} required hint={text.nationalId.hint} error={fieldErrors.nationalId}>
          <Input name="nationalId" inputMode="numeric" autoComplete="off" placeholder={text.nationalId.placeholder} value={values.nationalId} onChange={setField('nationalId')} />
        </FormField>
        <FormField label={text.phone.label} required hint={text.phone.hint} error={fieldErrors.phone}>
          <Input name="phone" type="tel" inputMode="tel" autoComplete="off" placeholder={text.phone.placeholder} value={values.phone} onChange={setField('phone')} />
        </FormField>
        <FormField label={text.occupation.label} required error={fieldErrors.occupation}>
          <Input name="occupation" autoComplete="off" placeholder={text.occupation.placeholder} value={values.occupation} onChange={setField('occupation')} />
        </FormField>
        <FormField label={text.address.label} required hint={text.address.hint} error={fieldErrors.address}>
          <Input name="address" autoComplete="off" placeholder={text.address.placeholder} value={values.address} onChange={setField('address')} />
        </FormField>
      </FormFieldset>

      {formError && <Alert tone="error">{formError}</Alert>}

      <div className="flex gap-3">
        <ButtonLink variant="outline" href="/clientes" className="flex-1">
          {text.cancel}
        </ButtonLink>
        <Button type="submit" loading={isSubmitting} className="flex-1">
          {isEditing ? text.submitEdit : text.submitCreate}
        </Button>
      </div>
    </form>
  );
}
