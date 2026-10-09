import type { Metadata } from 'next';
import { CollectorCreateScreen } from '@/components/organisms/CollectorCreateScreen';
import { getPortfolioOptions } from '@/features/collectors/get-portfolio-options.server';

export const metadata: Metadata = { title: 'Registrar cobrador' };

/** Registrar cobrador (`Screen / Web / Registrar cobrador`): trae las carteras en el servidor. */
export default async function NewCollectorPage() {
  return <CollectorCreateScreen portfolios={await getPortfolioOptions()} />;
}
