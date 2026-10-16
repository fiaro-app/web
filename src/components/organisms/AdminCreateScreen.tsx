'use client';

import { ButtonLink } from '@/components/atoms/ButtonLink';
import { Text } from '@/components/atoms/Text';
import { FormWithAside } from '@/components/molecules/FormWithAside';
import { AdminForm } from '@/components/organisms/AdminForm';
import { ADMINS_TEXT } from '@/content/admins';
import { useAdminForm } from '@/features/admins/use-admin-form';

/** Pantalla de invitar a un administrador: el formulario y, al terminar, la confirmación con la contraseña temporal. */
export function AdminCreateScreen() {
  const form = useAdminForm();
  const text = ADMINS_TEXT.invited;

  if (form.invited) {
    const { fullName, tempPassword } = form.invited;
    return (
      <section aria-labelledby="invited-title" className="flex max-w-lg flex-col gap-5">
        <div className="flex flex-col gap-1">
          <Text variant="title" as="h1" weight="bold" id="invited-title" className="text-foreground">
            {text.title}
          </Text>
          <Text variant="label" className="text-foreground/70">
            {tempPassword === null ? text.existingAccount(fullName) : text.withPassword(fullName)}
          </Text>
        </div>
        {tempPassword !== null && (
          <div className="flex flex-col gap-1 rounded-md bg-surface p-5">
            <Text variant="caption" className="font-semibold text-foreground/65">
              {text.passwordLabel}
            </Text>
            <output className="font-mono text-h3 font-semibold break-all text-foreground select-all">{tempPassword}</output>
          </div>
        )}
        <ButtonLink href="/administradores">{text.done}</ButtonLink>
      </section>
    );
  }
  return (
    <FormWithAside aside={ADMINS_TEXT.form.aside}>
      <AdminForm form={form} />
    </FormWithAside>
  );
}
