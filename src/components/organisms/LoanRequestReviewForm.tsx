'use client';

import { useState } from 'react';
import { LoanFrequencySchema } from '@fiaro-app/contracts';
import { AmountInput } from '@/components/atoms/AmountInput';
import { Button } from '@/components/atoms/Button';
import { Input } from '@/components/atoms/Input';
import { Select } from '@/components/atoms/Select';
import { Text } from '@/components/atoms/Text';
import { Textarea } from '@/components/atoms/Textarea';
import { Alert } from '@/components/molecules/Alert';
import { ConfirmDialog } from '@/components/molecules/ConfirmDialog';
import { DatePicker } from '@/components/molecules/DatePicker';
import { FormField } from '@/components/molecules/FormField';
import { FormFieldset } from '@/components/molecules/FormFieldset';
import { LOAN_REQUESTS_TEXT } from '@/content/loan-requests';
import { LOANS_TEXT } from '@/content/loans';
import type { LoanRequest } from '@/features/loan-requests/endpoints';
import { useReviewLoanRequest } from '@/features/loan-requests/use-review-loan-request';

const FREQUENCIES = LoanFrequencySchema.options;

/**
 * Aceptar una solicitud (con los ajustes que el administrador quiera hacer a lo que pidió el cobrador) o
 * rechazarla con un motivo opcional. Solo diseño; la lógica vive en `useReviewLoanRequest`.
 */
export function LoanRequestReviewForm({ request }: Readonly<{ request: LoanRequest }>) {
  const { values, reason, setText, setAmount, setStartDate, changeReason, pending, error, notice, approve, reject } =
    useReviewLoanRequest(request);
  const text = LOAN_REQUESTS_TEXT.review;
  const busy = pending !== null;
  const [confirming, setConfirming] = useState<'approve' | 'reject' | null>(null);
  const dialog = confirming ? text.confirm[confirming] : null;
  const confirm = () => {
    const decision = confirming === 'approve' ? approve : reject;
    setConfirming(null);
    void decision();
  };

  return (
    <div className="flex flex-col gap-4">
      {error && <Alert tone="error">{error}</Alert>}
      {notice && <Alert tone="success">{notice}</Alert>}

      {request.newClient !== null && (
        <FormFieldset>
          <Text variant="label" weight="bold">
            {text.sectionClient}
          </Text>
          <FormField label={text.fullName}>
            <Input name="fullName" value={values.fullName} onChange={setText('fullName')} disabled={busy} />
          </FormField>
          <FormField label={text.occupation}>
            <Input name="occupation" value={values.occupation} onChange={setText('occupation')} disabled={busy} />
          </FormField>
          <FormField label={text.phone}>
            <Input name="phone" inputMode="tel" value={values.phone} onChange={setText('phone')} disabled={busy} />
          </FormField>
          <FormField label={text.address}>
            <Input name="address" value={values.address} onChange={setText('address')} disabled={busy} />
          </FormField>
        </FormFieldset>
      )}

      <FormFieldset>
        <Text variant="label" weight="bold">
          {text.sectionLoan}
        </Text>
        <FormField label={text.principalAmount}>
          <AmountInput size="field" name="principalAmount" value={values.principalAmount} onValueChange={setAmount('principalAmount')} disabled={busy} />
        </FormField>
        <FormField label={text.installmentCount}>
          <Input name="installmentCount" inputMode="numeric" autoComplete="off" value={values.installmentCount} onChange={setText('installmentCount')} disabled={busy} />
        </FormField>
        <FormField label={text.installmentValue}>
          <AmountInput size="field" name="installmentValue" value={values.installmentValue} onValueChange={setAmount('installmentValue')} disabled={busy} />
        </FormField>
        <FormField label={text.totalPayable}>
          <AmountInput size="field" name="totalPayable" value={values.totalPayable} onValueChange={setAmount('totalPayable')} disabled={busy} />
        </FormField>
        <FormField label={text.frequency}>
          <Select name="frequency" value={values.frequency} onChange={setText('frequency')} disabled={busy}>
            {FREQUENCIES.map((frequency) => (
              <option key={frequency} value={frequency}>
                {LOANS_TEXT.frequency[frequency]}
              </option>
            ))}
          </Select>
        </FormField>
        <FormField label={text.startDate}>
          <DatePicker name="startDate" value={values.startDate} onValueChange={setStartDate} disabled={busy} />
        </FormField>
      </FormFieldset>

      <FormField label={text.reasonLabel}>
        <Textarea name="reason" placeholder={text.reasonPlaceholder} value={reason} onChange={changeReason} maxLength={200} disabled={busy} />
      </FormField>

      <div className="flex gap-3">
        <Button variant="outline" loading={pending === 'reject'} disabled={busy} onClick={() => setConfirming('reject')} className="flex-1">
          {text.reject}
        </Button>
        <Button loading={pending === 'approve'} disabled={busy} onClick={() => setConfirming('approve')} className="flex-1">
          {text.approve}
        </Button>
      </div>
      <ConfirmDialog
        open={dialog !== null}
        title={dialog?.confirmTitle ?? ''}
        description={dialog?.confirmDescription ?? ''}
        confirmLabel={dialog?.confirmLabel}
        onCancel={() => setConfirming(null)}
        onConfirm={confirm}
      />
    </div>
  );
}
