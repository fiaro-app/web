'use client';

import { useState } from 'react';
import { Button } from '@/components/atoms/Button';
import { StatePill } from '@/components/atoms/StatePill';
import { Text } from '@/components/atoms/Text';
import { ResponsiveTable } from '@/components/organisms/ResponsiveTable';
import { RESPONSIVE_TABLE } from '@/components/organisms/responsive-table';
import { PrivateImage } from '@/components/organisms/PrivateImage';
import { ReversePaymentForm } from '@/components/organisms/ReversePaymentForm';
import { ATTACHMENTS_TEXT } from '@/content/attachments';
import { VISITS_TEXT } from '@/content/visits';
import type { VisitRow } from '@/features/visits/visits-view-model';

export interface LoanVisitsProps {
  readonly visits: readonly VisitRow[];
  /** Puede revertir pagos (Owner o Lender). */
  readonly canManage?: boolean;
}

/** Historial de cobros de un préstamo: cada visita con su resultado y, si hubo pago, la opción de revertirlo. */
export function LoanVisits({ visits, canManage = true }: Readonly<LoanVisitsProps>) {
  const [reversing, setReversing] = useState<string | null>(null);
  const [proofOf, setProofOf] = useState<{ paymentId: string; date: string } | null>(null);

  return (
    <section aria-labelledby="visits-title" className="flex flex-col gap-4">
      <Text variant="h3" as="h2" id="visits-title">
        {VISITS_TEXT.title}
      </Text>

      {visits.length === 0 ? (
        <p className="text-label text-foreground/70">{VISITS_TEXT.empty}</p>
      ) : (
        <ResponsiveTable caption={VISITS_TEXT.caption} headers={VISITS_TEXT.headers} minWidthClass="md:min-w-190" className="max-h-112 overflow-y-auto">
          {visits.map((visit) => (
            <tr key={visit.id} className={RESPONSIVE_TABLE.row}>
              <th scope="row" className={RESPONSIVE_TABLE.rowHeader}>
                {visit.date}
              </th>
              <td className={RESPONSIVE_TABLE.cell} data-label={VISITS_TEXT.headers[1]}>
                {visit.collectorName}
              </td>
              <td className={RESPONSIVE_TABLE.cell} data-label={VISITS_TEXT.headers[2]}>
                <span className="flex flex-col items-start gap-1 md:items-start">
                  <StatePill tone={visit.outcomeTone}>{visit.outcome}</StatePill>
                  {visit.note && <span className="text-caption text-foreground/65">{visit.note}</span>}
                </span>
              </td>
              <td className={RESPONSIVE_TABLE.cell} data-label={VISITS_TEXT.headers[3]}>
                {visit.expected}
              </td>
              <td className={RESPONSIVE_TABLE.cell} data-label={VISITS_TEXT.headers[4]}>
                <span className={visit.reverted ? 'text-foreground/65 line-through' : undefined}>{visit.collected}</span>
                {visit.reverted && <StatePill tone="muted">{VISITS_TEXT.reversed}</StatePill>}
              </td>
              <td className={RESPONSIVE_TABLE.cell} data-label={VISITS_TEXT.headers[5]}>
                {visit.method}
              </td>
              <td className={RESPONSIVE_TABLE.action}>
                {visit.paymentId && (
                  <Button
                    variant="outline"
                    onClick={() => setProofOf({ paymentId: visit.paymentId ?? '', date: visit.date })}
                    aria-label={`${ATTACHMENTS_TEXT.paymentProof.action} del ${visit.date}`}
                  >
                    {ATTACHMENTS_TEXT.paymentProof.action}
                  </Button>
                )}
                {canManage && visit.reversiblePaymentId && (
                  <Button
                    variant="outline"
                    onClick={() => setReversing(visit.reversiblePaymentId)}
                    aria-label={`${VISITS_TEXT.reverse.action} del ${visit.date}`}
                  >
                    {VISITS_TEXT.reverse.action}
                  </Button>
                )}
              </td>
            </tr>
          ))}
        </ResponsiveTable>
      )}

      {proofOf && (
        <div className="flex flex-col items-start gap-3">
          <PrivateImage
            key={proofOf.paymentId}
            target="paymentProof"
            id={proofOf.paymentId}
            canEdit={canManage}
            title={ATTACHMENTS_TEXT.paymentProof.title}
            description={ATTACHMENTS_TEXT.paymentProof.description}
            alt={ATTACHMENTS_TEXT.paymentProof.alt(proofOf.date)}
            none={ATTACHMENTS_TEXT.paymentProof.none}
          />
          <Button variant="outline" onClick={() => setProofOf(null)}>
            {ATTACHMENTS_TEXT.paymentProof.close}
          </Button>
        </div>
      )}

      {reversing && <ReversePaymentForm key={reversing} paymentId={reversing} onCancel={() => setReversing(null)} />}
    </section>
  );
}
