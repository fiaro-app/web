'use client';

import { useState } from 'react';
import { Button } from '@/components/atoms/Button';
import { Link } from '@/components/atoms/Link';
import { Select } from '@/components/atoms/Select';
import { Text } from '@/components/atoms/Text';
import { Alert } from '@/components/molecules/Alert';
import { ConfirmForm } from '@/components/molecules/ConfirmForm';
import { COMMON_TEXT } from '@/content/common';
import { ConfirmDialog } from '@/components/molecules/ConfirmDialog';
import { FormField } from '@/components/molecules/FormField';
import { InfoRow } from '@/components/molecules/InfoRow';
import { COLLECTORS_TEXT } from '@/content/collectors';
import type { CollectorHandover } from '@/features/collectors/get-collector-handover.server';
import type { CollectorDetail } from '@/features/collectors/get-collector.server';
import type { PortfolioOption } from '@/features/collectors/get-portfolio-options.server';
import { useCollectorActions } from '@/features/collectors/use-collector-actions';

export interface CollectorManageProps {
  readonly collector: CollectorDetail;
  readonly portfolios: readonly PortfolioOption[];
  /** Sus préstamos activos y los cobradores que pueden recibirlos; `null` si no se pudieron revisar. */
  readonly handover?: CollectorHandover | null;
}

/** Acciones que piden confirmación. */
type Confirmable = 'reset-password' | 'deactivate' | 'reactivate' | 'remove';

const DIALOGS = {
  'reset-password': COLLECTORS_TEXT.manage.resetPassword,
  deactivate: COLLECTORS_TEXT.manage.deactivate,
  reactivate: COLLECTORS_TEXT.manage.reactivate,
  remove: COLLECTORS_TEXT.manage.remove,
} as const;

/** Gestión de un cobrador: cambiar su cartera, restablecer su contraseña, desactivarlo, reactivarlo o borrarlo. */
export function CollectorManage({ collector, portfolios, handover = { loans: [], destinations: [] } }: Readonly<CollectorManageProps>) {
  const text = COLLECTORS_TEXT.manage;
  const actions = useCollectorActions(collector, handover);
  const [destinationId, setDestinationId] = useState(handover?.destinations[0]?.id ?? '');
  const loanCount = handover?.loans.length ?? 0;
  const [confirming, setConfirming] = useState<Confirmable | null>(null);

  const confirm = () => {
    const action = {
      deactivate: () => actions.deactivate(destinationId),
      'reset-password': actions.resetPassword,
      reactivate: actions.reactivate,
      remove: actions.remove,
    }[confirming ?? 'reset-password'];
    setConfirming(null);
    void action();
  };
  const dialog = DIALOGS[confirming ?? 'reset-password'];

  return (
    <section aria-labelledby="manage-title" className="flex max-w-lg flex-col gap-5">
      <Link href="/cobradores">{text.back}</Link>
      <div className="flex flex-col gap-1">
        <Text variant="title" as="h1" weight="bold" id="manage-title" className="text-foreground">
          {collector.fullName}
        </Text>
        <Text variant="label" className="text-foreground/70">
          {text.title}
        </Text>
      </div>

      <div className="flex flex-col divide-y divide-foreground/8 overflow-hidden rounded-md">
        <InfoRow label="Teléfono" value={collector.phone} />
        <InfoRow label="Estado" value={collector.active ? COLLECTORS_TEXT.active : COLLECTORS_TEXT.inactive} />
      </div>

      {!collector.active && <Alert tone="warning">{text.deactivate.inactiveNotice}</Alert>}
      {actions.error && <Alert tone="error">{actions.error}</Alert>}
      {actions.notice && <Alert tone="success">{actions.notice}</Alert>}

      {actions.tempPassword !== null && (
        <div className="flex flex-col gap-1 rounded-md bg-surface p-5">
          <Text variant="caption" className="font-semibold text-foreground/65">
            {text.resetPassword.result}
          </Text>
          <output className="font-mono text-h3 font-semibold break-all text-foreground select-all">{actions.tempPassword}</output>
        </div>
      )}

      {collector.active && (
        <>
          <ConfirmForm
            confirmation={COMMON_TEXT.confirm.save}
            className="flex flex-col gap-3"
            onSubmit={(event) => {
              event.preventDefault();
              void actions.savePortfolio();
            }}
          >
            <FormField label={COLLECTORS_TEXT.form.portfolio.label}>
              <Select name="portfolioId" value={actions.portfolioId} onChange={(event) => actions.setPortfolioId(event.target.value)}>
                <option value="">{COLLECTORS_TEXT.form.portfolio.placeholder}</option>
                {portfolios.map((portfolio) => (
                  <option key={portfolio.id} value={portfolio.id}>
                    {portfolio.name}
                  </option>
                ))}
              </Select>
            </FormField>
            <Button type="submit" loading={actions.pending === 'portfolio'} disabled={actions.pending !== null}>
              {text.portfolio.save}
            </Button>
          </ConfirmForm>

          <div className="flex flex-col gap-3">
            <Button variant="outline" disabled={actions.pending !== null} onClick={() => setConfirming('reset-password')}>
              {text.resetPassword.action}
            </Button>
            <Button variant="text" disabled={actions.pending !== null} onClick={() => setConfirming('deactivate')} className="text-destructive">
              {text.deactivate.action}
            </Button>
          </div>

        </>
      )}

      {!collector.active && (
        <div className="flex flex-col gap-3">
          <Button disabled={actions.pending !== null} loading={actions.pending === 'reactivate'} onClick={() => setConfirming('reactivate')}>
            {text.reactivate.action}
          </Button>
        </div>
      )}
      {!collector.roles.includes('OWNER') && (
        <Button variant="text" disabled={actions.pending !== null} onClick={() => setConfirming('remove')} className="self-start text-destructive">
          {text.remove.action}
        </Button>
      )}

      <ConfirmDialog
        open={confirming !== null}
        title={dialog.confirmTitle}
        description={dialog.confirmDescription}
        confirmLabel={dialog.confirmLabel}
        onCancel={() => setConfirming(null)}
        onConfirm={confirm}
        confirmDisabled={confirming === 'deactivate' && (handover === null || (loanCount > 0 && destinationId === ''))}
      >
        {confirming === 'deactivate' && (
          <div className="flex flex-col gap-3">
            {handover === null && <Alert tone="error">{text.deactivate.handoverUnavailable}</Alert>}
            {handover !== null && loanCount > 0 && handover.destinations.length === 0 && <Alert tone="warning">{text.deactivate.noDestinations}</Alert>}
            {handover !== null && loanCount > 0 && handover.destinations.length > 0 && (
              <>
                <Text variant="label" className="text-foreground/75">
                  {text.deactivate.handoverIntro(loanCount)}
                </Text>
                <FormField label={text.deactivate.destinationLabel}>
                  <Select name="destination" value={destinationId} onChange={(event) => setDestinationId(event.target.value)}>
                    {handover.destinations.map((destination) => (
                      <option key={destination.id} value={destination.id}>
                        {destination.name}
                      </option>
                    ))}
                  </Select>
                </FormField>
              </>
            )}
          </div>
        )}
      </ConfirmDialog>
    </section>
  );
}
