import { Text } from '@/components/atoms/Text';
import { PLAN_OFFERS, PLANS_TEXT } from '@/content/plans';
import type { PaymentHistoryItem } from '@/features/subscription/checkout-endpoints';
import { formatCop } from '@/lib/amount';
import { formatInstantDate } from '@/lib/dates';

/** El nombre de un plan, o su código si el catálogo no lo conoce. */
const planName = (code: string) => PLAN_OFFERS.find((offer) => offer.code === code)?.name ?? code;

/** El medio de pago legible; el que no conocemos se muestra como llegó, y el pendiente como guion. */
const methodName = (type: string | null) =>
  type === null ? '—' : (PLANS_TEXT.history.method as Readonly<Record<string, string>>)[type] ?? type;

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
        <div className="overflow-x-auto rounded-md bg-surface">
          <table className="w-full text-left text-body">
            <thead>
              <tr className="text-foreground/70">
                {Object.values(text.columns).map((label) => (
                  <th key={label} scope="col" className="px-4 py-3 font-medium">
                    {label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-foreground/8">
              {payments.map((payment) => (
                <tr key={payment.reference}>
                  <td className="px-4 py-3">{formatInstantDate(payment.createdAt)}</td>
                  <td className="px-4 py-3">{planName(payment.planCode)}</td>
                  <td className="px-4 py-3">{formatCop(payment.amountInCents / 100)}</td>
                  <td className="px-4 py-3">{methodName(payment.paymentMethodType)}</td>
                  <td className="px-4 py-3">{text.status[payment.status]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
