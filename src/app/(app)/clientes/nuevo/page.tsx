import type { Metadata } from 'next';
import { FormWithAside } from '@/components/molecules/FormWithAside';
import { CLIENTS_TEXT } from '@/content/clients';
import { ClientForm } from '@/components/organisms/ClientForm';

export const metadata: Metadata = { title: 'Registrar cliente' };

/** Registrar cliente. */
export default function NewClientPage() {
  return (
    <FormWithAside aside={CLIENTS_TEXT.form.aside}>
      <ClientForm />
    </FormWithAside>
  );
}
