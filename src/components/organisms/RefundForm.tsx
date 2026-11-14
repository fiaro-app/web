'use client';

import { Alert } from '@/components/molecules/Alert';
import { Button } from '@/components/atoms/Button';
import { Input } from '@/components/atoms/Input';
import { Select } from '@/components/atoms/Select';
import { Textarea } from '@/components/atoms/Textarea';
import { FormField } from '@/components/molecules/FormField';
import { PLATFORM_PAYMENTS_TEXT } from '@/content/platform-payments';
import { REFUND_MODES, type RefundMode } from '@/features/platform-payments/endpoints';
import { useRefund } from '@/features/platform-payments/use-refund';

/** Formulario para devolver un pago: cómo, la referencia de la devolución y el motivo. La lógica vive en `useRefund`. */
export function RefundForm({ reference, business, onCancel }: Readonly<{ reference: string; business: string; onCancel: () => void }>) {
  const text = PLATFORM_PAYMENTS_TEXT.refund;
  const { mode, setMode, refundReference, setRefundReference, reason, setReason, error, isSubmitting, submit } = useRefund(reference);

  return (
    <form onSubmit={(event) => void submit(event)} noValidate aria-label={text.title(business)} className="flex flex-col gap-4 py-2">
      <FormField label={text.mode}>
        <Select
          value={mode}
          onChange={(event) => {
            setMode(event.target.value as RefundMode);
          }}
        >
          {REFUND_MODES.map((value) => (
            <option key={value} value={value}>
              {text.modes[value]}
            </option>
          ))}
        </Select>
      </FormField>
      <FormField label={text.reference}>
        <Input
          value={refundReference}
          onChange={(event) => {
            setRefundReference(event.target.value);
          }}
          maxLength={120}
        />
      </FormField>
      <FormField label={text.reason} required>
        <Textarea
          value={reason}
          onChange={(event) => {
            setReason(event.target.value);
          }}
          maxLength={500}
        />
      </FormField>
      {error && <Alert tone="error">{error}</Alert>}
      <div className="flex gap-3">
        <Button type="submit" loading={isSubmitting}>
          {text.submit}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          {text.cancel}
        </Button>
      </div>
    </form>
  );
}
