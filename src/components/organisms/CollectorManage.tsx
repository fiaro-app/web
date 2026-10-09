'use client';

import { useState } from 'react';
import { Button } from '@/components/atoms/Button';
import { Link } from '@/components/atoms/Link';
import { Select } from '@/components/atoms/Select';
import { Text } from '@/components/atoms/Text';
import { Alert } from '@/components/molecules/Alert';
import { ConfirmDialog } from '@/components/molecules/ConfirmDialog';
import { FormField } from '@/components/molecules/FormField';
import { InfoRow } from '@/components/molecules/InfoRow';
import { COLLECTORS_TEXT } from '@/content/collectors';
import type { CollectorDetail } from '@/features/collectors/get-collector.server';
import type { PortfolioOption } from '@/features/collectors/get-portfolio-options.server';
import { useCollectorActions } from '@/features/collectors/use-collector-actions';

export interface CollectorManageProps {
  readonly collector: CollectorDetail;
  readonly portfolios: readonly PortfolioOption[];
}

/** Gestión de un cobrador: cambiar su cartera, restablecer su contraseña o desactivarlo. */
export function CollectorManage({ collector, portfolios }: Readonly<CollectorManageProps>) {
  const text = COLLECTORS_TEXT.manage;
  const actions = useCollectorActions(collector);
  const [confirming, setConfirming] = useState<'reset-password' | 'deactivate' | null>(null);

  const confirm = () => {
    const action = confirming === 'deactivate' ? actions.deactivate : actions.resetPassword;
    setConfirming(null);
    void action();
  };
  const dialog = confirming === 'deactivate' ? text.deactivate : text.resetPassword;

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
          <Text variant="caption" className="font-semibold text-foreground/60">
            {text.resetPassword.result}
          </Text>
          <output className="font-mono text-h3 font-semibold break-all text-foreground select-all">{actions.tempPassword}</output>
        </div>
      )}

      {collector.active && (
        <>
          <form
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
          </form>

          <div className="flex flex-col gap-3">
            <Button variant="outline" disabled={actions.pending !== null} onClick={() => setConfirming('reset-password')}>
              {text.resetPassword.action}
            </Button>
            <Button variant="text" disabled={actions.pending !== null} onClick={() => setConfirming('deactivate')} className="text-destructive">
              {text.deactivate.action}
            </Button>
          </div>

          <ConfirmDialog
            open={confirming !== null}
            title={dialog.confirmTitle}
            description={dialog.confirmDescription}
            confirmLabel={dialog.confirmLabel}
            onCancel={() => setConfirming(null)}
            onConfirm={confirm}
          />
        </>
      )}
    </section>
  );
}
