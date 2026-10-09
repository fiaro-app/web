'use client';

import { ConfirmForm } from '@/components/molecules/ConfirmForm';
import { COMMON_TEXT } from '@/content/common';
import { Button } from '@/components/atoms/Button';
import { Select } from '@/components/atoms/Select';
import { Alert } from '@/components/molecules/Alert';
import { FormField } from '@/components/molecules/FormField';
import { LOANS_TEXT } from '@/content/loans';
import type { CollectorOption } from '@/features/loans/get-loan.server';
import { useAssignCollector } from '@/features/loans/use-assign-collector';

export interface AssignCollectorFormProps {
  readonly loanId: string;
  readonly collectors: readonly CollectorOption[];
}

/** Asignar o cambiar el cobrador de un préstamo activo. Solo diseño; la lógica vive en `useAssignCollector`. */
export function AssignCollectorForm({ loanId, collectors }: Readonly<AssignCollectorFormProps>) {
  const form = useAssignCollector(loanId);
  const text = LOANS_TEXT.detail.assign;

  if (collectors.length === 0) {
    return <p className="rounded-md bg-surface p-5 text-label text-foreground/70">{text.noCollectors}</p>;
  }

  return (
    <ConfirmForm
      confirmation={COMMON_TEXT.confirm.save} onSubmit={form.submit} noValidate aria-label={text.title} className="flex flex-col gap-3 rounded-md bg-surface p-5">
      <FormField label={text.label} hint={text.hint}>
        <Select name="collectorId" value={form.collectorId} onChange={form.changeCollector}>
          <option value="">{text.placeholder}</option>
          {collectors.map((collector) => (
            <option key={collector.id} value={collector.id}>
              {collector.name}
            </option>
          ))}
        </Select>
      </FormField>
      {form.error && <Alert tone="error">{form.error}</Alert>}
      {form.notice && <Alert tone="success">{form.notice}</Alert>}
      <Button type="submit" variant="outline" loading={form.isSubmitting}>
        {text.submit}
      </Button>
    </ConfirmForm>
  );
}
