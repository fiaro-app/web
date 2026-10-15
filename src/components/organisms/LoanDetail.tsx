'use client';

import { useState } from 'react';
import { Button } from '@/components/atoms/Button';
import { BackLink } from '@/components/molecules/BackLink';
import { Text } from '@/components/atoms/Text';
import { Alert } from '@/components/molecules/Alert';
import { ConfirmDialog } from '@/components/molecules/ConfirmDialog';
import { InfoRow } from '@/components/molecules/InfoRow';
import { LOAN_STATUS_CLASSES } from '@/components/organisms/loan-status-classes';
import { AssignCollectorForm } from '@/components/organisms/AssignCollectorForm';
import { LOANS_TEXT } from '@/content/loans';
import type { CollectorOption } from '@/features/loans/get-loan.server';
import type { LoanDetailView } from '@/features/loans/loans-view-model';
import { useCancelLoan } from '@/features/loans/use-cancel-loan';
import { cn } from '@/lib/cn';

export interface LoanDetailProps {
  readonly loan: LoanDetailView;
  readonly collectors: readonly CollectorOption[];
  /** Puede asignar cobrador y anular (Owner o Lender). */
  readonly canManage?: boolean;
}

/** Detalle de un préstamo: saldo, mora, cobrador (con su asignación) y la opción de anularlo mientras siga activo. */
export function LoanDetail({ loan, collectors, canManage = true }: Readonly<LoanDetailProps>) {
  const text = LOANS_TEXT.detail;
  const { isCanceling, error, cancel } = useCancelLoan(loan.id);
  const [confirming, setConfirming] = useState(false);

  const confirm = () => {
    setConfirming(false);
    void cancel();
  };

  return (
    <section aria-labelledby="loan-title" className="flex max-w-lg flex-col gap-5">
      <BackLink href="/prestamos">{text.back}</BackLink>
      <Text variant="title" as="h1" weight="bold" id="loan-title" className="text-foreground">
        {loan.clientName}
      </Text>

      <div className="flex flex-col divide-y divide-foreground/8 overflow-hidden rounded-md">
        <InfoRow label={text.rows.principalAmount} value={loan.principal} />
        <InfoRow label={text.rows.installments} value={loan.installments} />
        <InfoRow label={text.rows.totalPayable} value={loan.totalPayable} />
        {loan.balance !== null && <InfoRow label={text.rows.balance} value={loan.balance} />}
        {loan.paidInstallments !== null && <InfoRow label={text.rows.paid} value={loan.paidInstallments} />}
        {loan.nextDueDate !== null && <InfoRow label={text.rows.nextDue} value={loan.nextDueDate} />}
        <InfoRow label={text.rows.frequency} value={loan.frequency} />
        <InfoRow label={text.rows.startDate} value={loan.startDate} />
        <InfoRow label={text.rows.status} value={<span className={cn('font-semibold', LOAN_STATUS_CLASSES[loan.statusTone])}>{loan.status}</span>} />
        {loan.closedAt !== null && <InfoRow label={text.rows.closedAt} value={loan.closedAt} />}
        <InfoRow
          label={text.rows.collector}
          value={
            loan.collector ? (
              <span>
                {loan.collector.name}{' '}
                <span className="font-normal text-foreground/65">
                  {loan.collector.until ? `${text.collectorSince(loan.collector.since)} ${text.collectorUntil(loan.collector.until)}` : text.collectorSince(loan.collector.since)}
                </span>
              </span>
            ) : (
              text.noCollector
            )
          }
        />
      </div>

      {loan.overdue && (
        <Alert tone="warning">
          {text.rows.overdue}: {loan.overdue.amount} · {loan.overdue.days}
        </Alert>
      )}

      {error && <Alert tone="error">{error}</Alert>}

      {canManage && loan.assignable && <AssignCollectorForm loanId={loan.id} collectors={collectors} />}

      {canManage && loan.cancelable && (
        <>
          <Button variant="text" loading={isCanceling} onClick={() => setConfirming(true)} className="text-destructive">
            {text.cancel.action}
          </Button>
          <ConfirmDialog
            open={confirming}
            title={text.cancel.confirmTitle}
            description={text.cancel.confirmDescription}
            confirmLabel={text.cancel.confirmLabel}
            onCancel={() => setConfirming(false)}
            onConfirm={confirm}
          />
        </>
      )}
    </section>
  );
}
