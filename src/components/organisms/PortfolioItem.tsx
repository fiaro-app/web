'use client';

import { Button } from '@/components/atoms/Button';
import { Input } from '@/components/atoms/Input';
import { Alert } from '@/components/molecules/Alert';
import { ConfirmDialog } from '@/components/molecules/ConfirmDialog';
import { FormField } from '@/components/molecules/FormField';
import { SETTINGS_TEXT } from '@/content/settings';
import { usePortfolioActions } from '@/features/lender/use-portfolio-actions';

export interface PortfolioItemProps {
  readonly portfolio: { readonly id: string; readonly name: string; readonly isDefault: boolean };
  /** Solo quien administra puede renombrar o borrar. */
  readonly canEdit: boolean;
}

/** Una cartera en la lista: su nombre y, para quien administra, renombrarla o borrarla. Lógica en `usePortfolioActions`. */
export function PortfolioItem({ portfolio, canEdit }: Readonly<PortfolioItemProps>) {
  const text = SETTINGS_TEXT.portfolios;
  const actions = usePortfolioActions(portfolio);

  return (
    <li className="flex flex-col gap-3 px-4 py-3 text-body">
      {actions.isEditing ? (
        <form onSubmit={actions.submitRename} noValidate aria-label={text.rename.actionFor(portfolio.name)} className="flex flex-col gap-3">
          <FormField label={text.rename.label} error={actions.fieldError}>
            <Input name="name" autoComplete="off" value={actions.name} onChange={actions.changeName} />
          </FormField>
          <div className="flex gap-3">
            <Button type="submit" size="sm" loading={actions.isBusy}>
              {text.rename.save}
            </Button>
            <Button type="button" variant="text" size="sm" disabled={actions.isBusy} onClick={actions.cancelEditing}>
              {text.rename.cancel}
            </Button>
          </div>
        </form>
      ) : (
        <div className="flex flex-wrap items-center justify-between gap-3">
          <span className="flex items-center gap-2">
            {portfolio.name}
            {portfolio.isDefault && (
              <span className="rounded-full bg-primary/12 px-2 py-0.5 text-caption font-medium text-primary">{text.defaultBadge}</span>
            )}
          </span>
          {canEdit && (
            <span className="flex gap-2">
              <Button variant="outline" size="sm" aria-label={text.rename.actionFor(portfolio.name)} onClick={actions.startEditing}>
                {text.rename.action}
              </Button>
              {!portfolio.isDefault && (
                <Button variant="text" size="sm" aria-label={text.remove.actionFor(portfolio.name)} onClick={actions.askDelete}>
                  {text.remove.action}
                </Button>
              )}
            </span>
          )}
        </div>
      )}
      {actions.error && <Alert tone="error">{actions.error}</Alert>}
      <ConfirmDialog
        open={actions.isConfirmingDelete}
        title={text.remove.confirmTitle}
        description={text.remove.confirmDescription}
        confirmLabel={text.remove.confirmLabel}
        loading={actions.isBusy}
        onConfirm={() => void actions.confirmDelete()}
        onCancel={actions.cancelDelete}
      />
    </li>
  );
}
