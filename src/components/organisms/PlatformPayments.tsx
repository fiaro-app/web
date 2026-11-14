'use client';

import { Fragment, useState } from 'react';
import { Button } from '@/components/atoms/Button';
import { Text } from '@/components/atoms/Text';
import { RefundForm } from '@/components/organisms/RefundForm';
import { PLAN_OFFERS, PLANS_TEXT } from '@/content/plans';
import { PLATFORM_PAYMENTS_TEXT } from '@/content/platform-payments';
import type { PlatformPayment } from '@/features/platform-payments/endpoints';
import { formatCop } from '@/lib/amount';
import { formatInstantDate } from '@/lib/dates';

const planName = (code: string) => PLAN_OFFERS.find((offer) => offer.code === code)?.name ?? code;
const methodName = (type: string | null) => (type === null ? '—' : ((PLANS_TEXT.history.method as Readonly<Record<string, string>>)[type] ?? type));

/** «Pagos de la plataforma»: una fila por pago de cualquier negocio; los aprobados se pueden reembolsar con un formulario bajo la fila. */
export function PlatformPayments({ payments }: Readonly<{ payments: readonly PlatformPayment[] }>) {
  const text = PLATFORM_PAYMENTS_TEXT;
  const [open, setOpen] = useState<string | null>(null);

  return (
    <section aria-labelledby="platform-payments-title" className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <Text as="h1" variant="title" weight="bold" id="platform-payments-title">
          {text.title}
        </Text>
        <Text variant="label" className="text-foreground/70">
          {text.description}
        </Text>
      </div>
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
                <Fragment key={payment.reference}>
                  <tr>
                    <td className="px-4 py-3">{formatInstantDate(payment.createdAt)}</td>
                    <td className="px-4 py-3">{payment.tenantName}</td>
                    <td className="px-4 py-3">{planName(payment.planCode)}</td>
                    <td className="px-4 py-3">{formatCop(payment.amountInCents / 100)}</td>
                    <td className="px-4 py-3">{methodName(payment.paymentMethodType)}</td>
                    <td className="px-4 py-3">{text.status[payment.status]}</td>
                    <td className="px-4 py-3">
                      {payment.status === 'APPROVED' && (
                        <Button
                          variant="outline"
                          onClick={() => {
                            setOpen(payment.reference);
                          }}
                        >
                          {text.refund.open}
                        </Button>
                      )}
                    </td>
                  </tr>
                  {open === payment.reference && (
                    <tr>
                      <td colSpan={Object.keys(text.columns).length} className="px-4">
                        <RefundForm
                          reference={payment.reference}
                          business={payment.tenantName}
                          onCancel={() => {
                            setOpen(null);
                          }}
                        />
                      </td>
                    </tr>
                  )}
                </Fragment>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
