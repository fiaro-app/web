'use client';

import { Button } from '@/components/atoms/Button';
import { Input } from '@/components/atoms/Input';
import { Alert } from '@/components/molecules/Alert';
import { FormField } from '@/components/molecules/FormField';
import { SettingsSection } from '@/components/molecules/SettingsSection';
import { SETTINGS_TEXT } from '@/content/settings';
import type { SettingsView } from '@/features/lender/get-settings.server';
import { usePortfolioForm } from '@/features/lender/use-settings-forms';

export interface PortfoliosPanelProps {
  readonly portfolios: SettingsView['portfolios'];
  readonly canEdit: boolean;
}

/** "Carteras": las que existen y, para quien administra, un formulario para crear otra. */
export function PortfoliosPanel({ portfolios, canEdit }: Readonly<PortfoliosPanelProps>) {
  const form = usePortfolioForm();
  const text = SETTINGS_TEXT.portfolios;

  return (
    <SettingsSection title={text.title} description={text.description}>
      <ul aria-label={text.listLabel} className="flex flex-col divide-y divide-foreground/8 overflow-hidden rounded-sm border border-foreground/8">
        {portfolios.map((portfolio) => (
          <li key={portfolio.id} className="flex items-center justify-between gap-3 px-4 py-3 text-body">
            {portfolio.name}
            {portfolio.isDefault && (
              <span className="rounded-full bg-primary/12 px-2 py-0.5 text-caption font-medium text-primary">{text.defaultBadge}</span>
            )}
          </li>
        ))}
      </ul>
      {canEdit && (
        <form onSubmit={form.submit} noValidate aria-label={text.create} className="flex flex-col gap-4">
          <FormField label={text.nameLabel} error={form.fieldError}>
            <Input name="name" autoComplete="off" placeholder={text.namePlaceholder} value={form.name} onChange={form.changeName} />
          </FormField>
          {form.error && <Alert tone="error">{form.error}</Alert>}
          {form.notice && <Alert tone="success">{form.notice}</Alert>}
          <Button type="submit" variant="outline" loading={form.isSubmitting}>
            {text.create}
          </Button>
        </form>
      )}
    </SettingsSection>
  );
}
