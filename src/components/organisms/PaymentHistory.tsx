import { Text } from '@/components/atoms/Text';
import { PlainTable } from '@/components/molecules/PlainTable';
import { PLANS_TEXT } from '@/content/plans';
import type { PaymentHistoryItem } from '@/features/subscription/checkout-endpoints';
import { formatCop } from '@/lib/amount';
import { formatInstantDate } from '@/lib/dates';
import { methodName, planName } from '@/lib/payment-labels';

/** «Historial de pagos» de «Plan y pagos»: una fila por orden, de la más reciente a la más vieja. */
export function PaymentHistory({ payments }: Readonly<{ payments: readonly PaymentHistoryItem[] }>) {
  const text = PLANS_TEXT.history;

  return (
    <section aria-labelledby="payment-history-title" className="flex flex-col gap-4">
      <Text as="h2" variant="h3" id="payment-history-title">
        {text.title}
      </Text>
      {payments.length === 0 ? (
        <Text variant="label" className="text-foreground/70">
          {text.empty}
        </Text>
      ) : (
        <PlainTable columns={Object.values(text.columns)}>
              {payments.map((payment) => (
                <tr key={payment.reference}>
                  <td className="px-4 py-3">{formatInstantDate(payment.createdAt)}</td>
                  <td className="px-4 py-3">{planName(payment.planCode)}</td>
                  <td className="px-4 py-3">{formatCop(payment.amountInCents / 100)}</td>
                  <td className="px-4 py-3">{methodName(payment.paymentMethodType)}</td>
                  <td className="px-4 py-3">{text.status[payment.status]}</td>
                </tr>
              ))}
            </PlainTable>
      )}
    </section>
  );
}
