'use client';

import { FormWithAside } from '@/components/molecules/FormWithAside';
import { AdminForm } from '@/components/organisms/AdminForm';
import { CollectorInvited } from '@/components/organisms/CollectorInvited';
import { ADMINS_TEXT } from '@/content/admins';
import { useAdminForm } from '@/features/admins/use-admin-form';

/** Pantalla de invitar a un administrador: el formulario y, al terminar, la confirmación con la contraseña temporal. */
export function AdminCreateScreen() {
  const form = useAdminForm();
  if (form.invited) return <CollectorInvited invited={form.invited} text={ADMINS_TEXT.invited} backHref="/administradores" />;
  return (
    <FormWithAside aside={ADMINS_TEXT.form.aside}>
      <AdminForm form={form} />
    </FormWithAside>
  );
}
