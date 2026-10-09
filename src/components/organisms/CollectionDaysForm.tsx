'use client';

import type { Weekday } from '@fiaro-app/contracts';
import { Button } from '@/components/atoms/Button';
import { Checkbox } from '@/components/atoms/Checkbox';
import { Alert } from '@/components/molecules/Alert';
import { SettingsSection } from '@/components/molecules/SettingsSection';
import { SETTINGS_TEXT } from '@/content/settings';
import { WEEKDAYS } from '@/features/lender/settings-schemas';
import { useCollectionDaysForm } from '@/features/lender/use-settings-forms';

export interface CollectionDaysFormProps {
  readonly nonWorkingWeekdays: readonly Weekday[];
  readonly skipNationalHolidays: boolean;
  readonly canEdit: boolean;
}

/** "Días sin cobro": días de la semana y festivos. Solo diseño; la lógica vive en `useCollectionDaysForm`. */
export function CollectionDaysForm({ nonWorkingWeekdays, skipNationalHolidays, canEdit }: Readonly<CollectionDaysFormProps>) {
  const form = useCollectionDaysForm({ nonWorkingWeekdays, skipNationalHolidays });
  const text = SETTINGS_TEXT.days;

  return (
    <SettingsSection title={text.title} description={text.description}>
      <form onSubmit={form.submit} noValidate aria-label={text.title} className="flex flex-col gap-4">
        <fieldset className="flex flex-col gap-3" disabled={!canEdit}>
          <legend className="mb-1 text-caption font-medium text-foreground">{text.legend}</legend>
          {WEEKDAYS.map((day) => (
            <label key={day} className="flex items-center gap-3 text-body">
              <Checkbox name="nonWorkingWeekdays" value={day} checked={form.weekdays.includes(day)} onChange={form.toggleDay(day)} />
              {SETTINGS_TEXT.weekdays[day]}
            </label>
          ))}
          <label className="mt-2 flex items-center gap-3 text-body">
            <Checkbox name="skipNationalHolidays" checked={form.skipHolidays} onChange={form.toggleHolidays} />
            {text.holidays}
          </label>
        </fieldset>
        {form.error && <Alert tone="error">{form.error}</Alert>}
        {form.notice && <Alert tone="success">{form.notice}</Alert>}
        {canEdit && (
          <Button type="submit" loading={form.isSubmitting}>
            {text.save}
          </Button>
        )}
      </form>
    </SettingsSection>
  );
}
