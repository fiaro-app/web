import type { Metadata } from 'next';
import { StateIcon } from '@/components/atoms/StateIcon';
import { EmptyState } from '@/components/molecules/EmptyState';
import { PlatformPayments } from '@/components/organisms/PlatformPayments';
import { PLATFORM_PAYMENTS_TEXT } from '@/content/platform-payments';
import { getPlatformPayments } from '@/features/platform-payments/get-platform-payments.server';

export const metadata: Metadata = { title: 'Pagos de la plataforma' };

/** Pagos de la plataforma: los pagos del plan de todos los negocios y su reembolso (D-156 de la API). Solo quien opera la plataforma; la API es quien lo exige. */
export default async function PlatformPaymentsPage() {
  const result = await getPlatformPayments();
  if (result.status === 'forbidden') {
    return <EmptyState icon={<StateIcon name="lock" />} {...PLATFORM_PAYMENTS_TEXT.forbidden} />;
  }
  return <PlatformPayments payments={result.payments} />;
}
