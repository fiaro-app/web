'use client';

import { CollectorForm } from '@/components/organisms/CollectorForm';
import { CollectorInvited } from '@/components/organisms/CollectorInvited';
import type { PortfolioOption } from '@/features/collectors/get-portfolio-options.server';
import { useCollectorForm } from '@/features/collectors/use-collector-form';

/** Pantalla de alta de cobrador: el formulario y, al terminar, la confirmación con la contraseña temporal. */
export function CollectorCreateScreen({ portfolios }: Readonly<{ portfolios: readonly PortfolioOption[] }>) {
  const form = useCollectorForm();
  return form.invited ? <CollectorInvited invited={form.invited} /> : <CollectorForm form={form} portfolios={portfolios} />;
}
