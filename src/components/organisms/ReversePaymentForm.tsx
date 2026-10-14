'use client';

import { Alert } from '@/components/molecules/Alert';
import { Button } from '@/components/atoms/Button';
import { Text } from '@/components/atoms/Text';
import { Textarea } from '@/components/atoms/Textarea';
import { FormField } from '@/components/molecules/FormField';
import { VISITS_TEXT } from '@/content/visits';
import { useReversePayment } from '@/features/visits/use-reverse-payment';

export interface ReversePaymentFormProps {
  readonly paymentId: string;
  readonly onCancel: () => void;
}

/** Formulario para revertir un pago con su motivo. Lógica en `useReversePayment`. */
export function ReversePaymentForm({ paymentId, onCancel }: Readonly<ReversePaymentFormProps>) {
  const text = VISITS_TEXT.reverse;
  const { reason, reasonError, error, isSubmitting, changeReason, submit } = useReversePayment(paymentId);

  return (
    <form onSubmit={(event) => void submit(event)} noValidate aria-label={text.title} className="flex max-w-lg flex-col gap-4 rounded-md bg-surface p-6">
      <div className="flex flex-col gap-1">
        <Text variant="h3" as="h3">
          {text.title}
        </Text>
        <Text variant="label" className="text-foreground/70">
          {text.description}
        </Text>
      </div>
      <FormField label={text.reason.label} error={reasonError}>
        <Textarea name="reason" rows={3} placeholder={text.reason.placeholder} value={reason} onChange={changeReason} />
      </FormField>
      {error && <Alert tone="error">{error}</Alert>}
      <div className="flex flex-wrap gap-3">
        <Button type="submit" loading={isSubmitting}>
          {text.submit}
        </Button>
        <Button type="button" variant="outline" disabled={isSubmitting} onClick={onCancel}>
          {text.cancel}
        </Button>
      </div>
    </form>
  );
}
