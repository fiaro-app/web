'use client';

import type { PaymentMethod, VisitOutcome } from '@fiaro-app/contracts';
import { Button } from '@/components/atoms/Button';
import { Radio } from '@/components/atoms/Radio';
import { Select } from '@/components/atoms/Select';
import { Text } from '@/components/atoms/Text';
import { AmountInput } from '@/components/atoms/AmountInput';
import { Alert } from '@/components/molecules/Alert';
import { ConfirmForm } from '@/components/molecules/ConfirmForm';
import { DatePicker } from '@/components/molecules/DatePicker';
import { FormField } from '@/components/molecules/FormField';
import { VISITS_TEXT } from '@/content/visits';
import { useCollectionForm } from '@/features/visits/use-collection-form';

const OUTCOMES: readonly VisitOutcome[] = ['PAID', 'RESCHEDULED', 'NOT_FOUND', 'REFUSED'];
const METHODS: readonly PaymentMethod[] = ['CASH', 'NEQUI', 'TRANSFER'];

export interface CollectionFormProps {
  readonly loanId: string;
  /** Valor de la cuota: es el monto que se propone cuando el cliente paga. */
  readonly installmentValue: number;
}

/**
 * «Registrar cobro»: lo que hace el cobrador en campo, desde la web. Elige qué pasó en la visita y, si el
 * cliente pagó, el monto y el medio; si reprogramó, la fecha prometida. Pide confirmar antes de registrar
 * porque un pago solo se corrige revirtiéndolo. Lógica en `useCollectionForm`.
 */
export function CollectionForm({ loanId, installmentValue }: Readonly<CollectionFormProps>) {
  const text = VISITS_TEXT.collect;
  const form = useCollectionForm({ loanId, installmentValue });

  return (
    <ConfirmForm
      confirmation={form.confirmation}
      onSubmit={form.submit}
      noValidate
      aria-label={text.title}
      className="flex max-w-lg flex-col gap-5 rounded-md bg-surface p-6"
    >
      <div className="flex flex-col gap-1">
        <Text variant="h3" as="h2">
          {text.title}
        </Text>
        <Text variant="label" className="text-foreground/70">
          {text.description}
        </Text>
      </div>

      <fieldset className="flex flex-col gap-3" disabled={form.isSubmitting}>
        <legend className="mb-1 text-label font-medium">{text.outcomeLabel}</legend>
        {OUTCOMES.map((option) => (
          <label key={option} className="flex cursor-pointer items-center gap-3 text-label">
            <Radio name="outcome" value={option} checked={form.outcome === option} onChange={() => form.chooseOutcome(option)} />
            {VISITS_TEXT.outcome[option]}
          </label>
        ))}
      </fieldset>

      {form.outcome === 'PAID' && (
        <>
          <FormField label={text.amountLabel} error={form.fieldErrors.amount}>
            <AmountInput size="field" name="amount" value={form.amount} onValueChange={form.setAmount} />
          </FormField>
          <FormField label={text.methodLabel}>
            <Select name="method" value={form.method} onChange={(event) => form.setMethod(event.target.value as PaymentMethod)}>
              {METHODS.map((method) => (
                <option key={method} value={method}>
                  {VISITS_TEXT.method[method]}
                </option>
              ))}
            </Select>
          </FormField>
        </>
      )}
      {form.outcome === 'RESCHEDULED' && (
        <FormField label={text.promisedLabel} error={form.fieldErrors.promisedDate}>
          <DatePicker name="promisedDate" value={form.promisedDate} onValueChange={form.setPromisedDate} />
        </FormField>
      )}

      {form.formError && <Alert tone="error">{form.formError}</Alert>}
      {form.notice && <Alert tone="success">{form.notice}</Alert>}
      <Button type="submit" loading={form.isSubmitting} className="self-start">
        {text.submit}
      </Button>
    </ConfirmForm>
  );
}
