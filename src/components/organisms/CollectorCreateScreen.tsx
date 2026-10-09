'use client';

import { FormWithAside } from '@/components/molecules/FormWithAside';
import { COLLECTORS_TEXT } from '@/content/collectors';
import { CollectorForm } from '@/components/organisms/CollectorForm';
import { CollectorInvited } from '@/components/organisms/CollectorInvited';
import type { PortfolioOption } from '@/features/collectors/get-portfolio-options.server';
import { useCollectorForm } from '@/features/collectors/use-collector-form';

/** Pantalla de alta de cobrador: el formulario y, al terminar, la confirmación con la contraseña temporal. */
export function CollectorCreateScreen({ portfolios }: Readonly<{ portfolios: readonly PortfolioOption[] }>) {
  const form = useCollectorForm();
  if (form.invited) return <CollectorInvited invited={form.invited} />;
  return (
    <FormWithAside aside={COLLECTORS_TEXT.form.aside}>
      <CollectorForm form={form} portfolios={portfolios} />
    </FormWithAside>
  );
}
