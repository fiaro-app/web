import type { Metadata } from 'next';
import { StateIcon } from '@/components/atoms/StateIcon';
import { EmptyState } from '@/components/molecules/EmptyState';
import { AdminsView } from '@/components/organisms/AdminsView';
import { ADMINS_TEXT } from '@/content/admins';
import { getAdmins } from '@/features/admins/get-admins.server';

export const metadata: Metadata = { title: 'Administradores' };

/** Administradores del negocio: trae quiénes son y a quién se le puede subir de rango en el servidor. */
export default async function AdminsPage() {
  const result = await getAdmins();

  if (result.status === 'forbidden') {
    return <EmptyState icon={<StateIcon name="lock" />} {...ADMINS_TEXT.forbidden} />;
  }
  return <AdminsView admins={result.admins} />;
}
