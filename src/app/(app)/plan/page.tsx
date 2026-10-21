import { StateIcon } from '@/components/atoms/StateIcon';
import type { Metadata } from 'next';
import { Text } from '@/components/atoms/Text';
import { Alert } from '@/components/molecules/Alert';
import { EmptyState } from '@/components/molecules/EmptyState';
import { PaymentHistory } from '@/components/organisms/PaymentHistory';
import { PlanCheckout } from '@/components/organisms/PlanCheckout';
import { PlanPanel } from '@/components/organisms/PlanPanel';
import { PLANS_TEXT } from '@/content/plans';
import { getAccess } from '@/features/app-shell/get-access.server';
import { getPayments } from '@/features/subscription/get-payments.server';
import { getSubscription } from '@/features/subscription/get-subscription.server';

export const metadata: Metadata = { title: 'Plan y pagos' };

/**
 * Plan y pagos: el plan actual y los planes que se pueden pagar. Es de quien administra el negocio;
 * pagar es de la dueña, y la API es quien lo exige (un administrador que lo intente ve el motivo).
 */
export default async function PlanPage() {
  if (!(await getAccess()).canManage) {
    return <EmptyState icon={<StateIcon name="lock" />} {...PLANS_TEXT.forbidden} />;
  }
  const [subscription, payments] = await Promise.all([getSubscription(), getPayments()]);

  return (
    <>
      <Text variant="title" as="h1" weight="bold" className="text-foreground">
        {PLANS_TEXT.title}
      </Text>
      {subscription?.notice && <Alert tone={subscription.notice.tone}>{subscription.notice.message}</Alert>}
      {subscription && (
        <div className="*:max-w-none">
          <PlanPanel subscription={subscription} />
        </div>
      )}
      <PlanCheckout currentPlanName={subscription?.planName ?? null} />
      {payments && <PaymentHistory payments={payments} />}
    </>
  );
}
