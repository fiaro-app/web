'use client';

import { ConfirmForm } from '@/components/molecules/ConfirmForm';
import { COMMON_TEXT } from '@/content/common';
import { Button } from '@/components/atoms/Button';
import { Input } from '@/components/atoms/Input';
import { Alert } from '@/components/molecules/Alert';
import { FormField } from '@/components/molecules/FormField';
import { SettingsSection } from '@/components/molecules/SettingsSection';
import { PortfolioItem } from '@/components/organisms/PortfolioItem';
import { SETTINGS_TEXT } from '@/content/settings';
import type { SettingsView } from '@/features/lender/get-settings.server';
import { MAX_PORTFOLIOS } from '@/features/lender/portfolio-limit';
import { usePortfolioForm } from '@/features/lender/use-settings-forms';

export interface PortfoliosPanelProps {
  readonly portfolios: SettingsView['portfolios'];
  readonly canEdit: boolean;
}

/** "Carteras": las que existen (renombrables y borrables) y, para quien administra, un formulario para crear otra. */
export function PortfoliosPanel({ portfolios, canEdit }: Readonly<PortfoliosPanelProps>) {
  const form = usePortfolioForm();
  const text = SETTINGS_TEXT.portfolios;

  return (
    <SettingsSection title={text.title} description={text.description}>
      <ul
        aria-label={text.listLabel}
        className="flex flex-col divide-y divide-foreground/8 overflow-hidden rounded-sm border border-foreground/8"
      >
        {portfolios.map((portfolio) => (
          <PortfolioItem key={portfolio.id} portfolio={portfolio} canEdit={canEdit} />
        ))}
      </ul>
      {canEdit && portfolios.length >= MAX_PORTFOLIOS && <Alert tone="info">{text.limitReached(MAX_PORTFOLIOS)}</Alert>}
      {canEdit && portfolios.length < MAX_PORTFOLIOS && (
        <ConfirmForm
          confirmation={COMMON_TEXT.confirm.create} onSubmit={form.submit} noValidate aria-label={text.create} className="flex flex-col gap-4">
          <FormField label={text.nameLabel} error={form.fieldError}>
            <Input name="name" autoComplete="off" placeholder={text.namePlaceholder} value={form.name} onChange={form.changeName} />
          </FormField>
          {form.error && <Alert tone="error">{form.error}</Alert>}
          {form.notice && <Alert tone="success">{form.notice}</Alert>}
          <Button type="submit" variant="outline" loading={form.isSubmitting}>
            {text.create}
          </Button>
        </ConfirmForm>
      )}
    </SettingsSection>
  );
}
