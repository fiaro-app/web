import type { Metadata } from 'next';
import { StateIcon } from '@/components/atoms/StateIcon';
import { EmptyState } from '@/components/molecules/EmptyState';
import { getAccess } from '@/features/app-shell/get-access.server';
import { FormWithAside } from '@/components/molecules/FormWithAside';
import { CLIENTS_TEXT } from '@/content/clients';
import { ClientForm } from '@/components/organisms/ClientForm';

export const metadata: Metadata = { title: 'Registrar cliente' };

/** Registrar cliente. */
export default async function NewClientPage() {
  if (!(await getAccess()).canManage) return <EmptyState icon={<StateIcon name="lock" />} {...CLIENTS_TEXT.forbidden} />;
  return (
    <FormWithAside aside={CLIENTS_TEXT.form.aside}>
      <ClientForm />
    </FormWithAside>
  );
}
