'use client';

import { DatePicker } from '@/components/molecules/DatePicker';
import { ConfirmForm } from '@/components/molecules/ConfirmForm';
import { COMMON_TEXT } from '@/content/common';
import { Button } from '@/components/atoms/Button';
import { ButtonLink } from '@/components/atoms/ButtonLink';
import { AmountInput } from '@/components/atoms/AmountInput';
import { Input } from '@/components/atoms/Input';
import { Select } from '@/components/atoms/Select';
import { StateIcon } from '@/components/atoms/StateIcon';
import { Text } from '@/components/atoms/Text';
import { Alert } from '@/components/molecules/Alert';
import { FormWithAside } from '@/components/molecules/FormWithAside';
import { ClientRiskCard } from '@/components/organisms/ClientRiskCard';
import { EmptyState } from '@/components/molecules/EmptyState';
import { FormField } from '@/components/molecules/FormField';
import { FormFieldset } from '@/components/molecules/FormFieldset';
import { RISK_TEXT } from '@/content/risk';
import { useClientRisk } from '@/features/risk/use-client-risk';
import { LOANS_TEXT } from '@/content/loans';
import type { ClientOption } from '@/features/loans/get-client-names.server';
import type { CollectorOption } from '@/features/loans/get-loan.server';
import { useLoanForm } from '@/features/loans/use-loan-form';
import { LoanFrequencySchema } from '@fiaro-app/contracts';

const FREQUENCIES = LoanFrequencySchema.options;

/** Formulario "Registrar préstamo". Solo diseño: la lógica vive en `useLoanForm`. */
export interface LoanFormProps {
  readonly clients: readonly ClientOption[];
  readonly collectors: readonly CollectorOption[];
  /** Cliente que arranca elegido (viene de la ficha del cliente); vacío si ninguno. */
  readonly initialClientId?: string;
}

export function LoanForm({ clients, collectors, initialClientId }: Readonly<LoanFormProps>) {
  const { values, fieldErrors, formError, isSubmitting, createdLoanId, setText, setAmount, setStartDate, submit } = useLoanForm({ initialClientId });
  const text = LOANS_TEXT.form;
  const risk = useClientRisk(values.clientId);

  if (clients.length === 0) {
    return (
      <EmptyState
        icon={<StateIcon name="users" />}
        title={text.noClients.title}
        description={text.noClients.description}
        action={<ButtonLink href="/clientes/nuevo">{text.noClients.action}</ButtonLink>}
      />
    );
  }

  return (
    <FormWithAside aside={text.aside} belowAside={risk && <ClientRiskCard risk={risk} />}>
      <ConfirmForm
        confirmation={COMMON_TEXT.confirm.loan} onSubmit={submit} noValidate aria-label={text.title} className="flex max-w-lg flex-col gap-5">
        <div className="flex flex-col gap-1">
          <Text variant="title" as="h1" weight="bold" className="text-foreground">
            {text.title}
          </Text>
          <Text variant="label" className="text-foreground/70">
            {text.subtitle}
          </Text>
        </div>

        <FormFieldset>
          <FormField label={text.client.label} error={fieldErrors.clientId}>
            <Select name="clientId" value={values.clientId} onChange={setText('clientId')}>
              <option value="">{text.client.placeholder}</option>
              {clients.map((client) => (
                <option key={client.id} value={client.id}>
                  {client.label}
                </option>
              ))}
            </Select>
          </FormField>
          {risk?.level === 'VERY_HIGH' && <Alert tone="warning">{RISK_TEXT.loanWarning}</Alert>}
          <FormField label={text.principalAmount.label} error={fieldErrors.principalAmount}>
            <AmountInput size="field" name="principalAmount" value={values.principalAmount} onValueChange={setAmount('principalAmount')} />
          </FormField>
          <FormField label={text.installmentCount.label} error={fieldErrors.installmentCount}>
            <Input name="installmentCount" inputMode="numeric" autoComplete="off" placeholder={text.installmentCount.placeholder} value={values.installmentCount} onChange={setText('installmentCount')} />
          </FormField>
          <FormField label={text.installmentValue.label} error={fieldErrors.installmentValue}>
            <AmountInput size="field" name="installmentValue" value={values.installmentValue} onValueChange={setAmount('installmentValue')} />
          </FormField>
          <FormField label={text.totalPayable.label} hint={text.totalPayable.hint} error={fieldErrors.totalPayable}>
            <AmountInput size="field" name="totalPayable" value={values.totalPayable} onValueChange={() => undefined} readOnly tabIndex={-1} className="cursor-default bg-foreground/5" />
          </FormField>
          <FormField label={text.frequency.label} error={fieldErrors.frequency}>
            <Select name="frequency" value={values.frequency} onChange={setText('frequency')}>
              <option value="">{text.frequency.placeholder}</option>
              {FREQUENCIES.map((frequency) => (
                <option key={frequency} value={frequency}>
                  {LOANS_TEXT.frequency[frequency]}
                </option>
              ))}
            </Select>
          </FormField>
          <FormField label={text.startDate.label} error={fieldErrors.startDate}>
            <DatePicker name="startDate" value={values.startDate} onValueChange={setStartDate} />
          </FormField>
          {collectors.length > 0 && (
            <FormField label={text.collector.label} hint={text.collector.hint} error={fieldErrors.collectorId}>
              <Select name="collectorId" value={values.collectorId} onChange={setText('collectorId')}>
                <option value="">{text.collector.placeholder}</option>
                {collectors.map((collector) => (
                  <option key={collector.id} value={collector.id}>
                    {collector.name}
                  </option>
                ))}
              </Select>
            </FormField>
          )}
        </FormFieldset>

        {formError && <Alert tone="error">{formError}</Alert>}

        <div className="flex gap-3">
          <ButtonLink variant="outline" href="/prestamos" className="flex-1">
            {text.cancel}
          </ButtonLink>
          {createdLoanId ? (
            <ButtonLink href={`/prestamos/${createdLoanId}`} className="flex-1">
              {text.viewCreated}
            </ButtonLink>
          ) : (
            <Button type="submit" loading={isSubmitting} className="flex-1">
              {text.submit}
            </Button>
          )}
        </div>
      </ConfirmForm>
    </FormWithAside>
  );
}
