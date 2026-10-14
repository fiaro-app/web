import { StateIcon } from '@/components/atoms/StateIcon';
import type { Metadata } from 'next';
import { EmptyState } from '@/components/molecules/EmptyState';
import { SettingsView } from '@/components/organisms/SettingsView';
import { SETTINGS_TEXT } from '@/content/settings';
import { getSettings } from '@/features/lender/get-settings.server';

export const metadata: Metadata = { title: 'Configuración' };

/** Configuración: trae los datos del negocio en el servidor y los entrega a la vista. */
export default async function SettingsPage() {
  const result = await getSettings();

  if (result.status === 'forbidden') {
    return <EmptyState icon={<StateIcon name="lock" />} {...SETTINGS_TEXT.forbidden} />;
  }
  return <SettingsView settings={result.settings} />;
}
