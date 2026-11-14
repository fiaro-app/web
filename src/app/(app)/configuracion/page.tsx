import { StateIcon } from '@/components/atoms/StateIcon';
import type { Metadata } from 'next';
import { EmptyState } from '@/components/molecules/EmptyState';
import { SettingsView } from '@/components/organisms/SettingsView';
import { SETTINGS_TEXT } from '@/content/settings';
import { getAccess } from '@/features/app-shell/get-access.server';
import { getSettings } from '@/features/lender/get-settings.server';

export const metadata: Metadata = { title: 'Configuración' };

/**
 * Configuración: trae los datos del negocio en el servidor y los entrega a la vista. Es de quien
 * administra el negocio: un cobrador ve que no tiene acceso (su cuenta personal está en «Cuenta»).
 */
export default async function SettingsPage() {
  if (!(await getAccess()).canManage) {
    return <EmptyState icon={<StateIcon name="lock" />} {...SETTINGS_TEXT.forbidden} />;
  }
  const result = await getSettings();

  if (result.status === 'forbidden') {
    return <EmptyState icon={<StateIcon name="lock" />} {...SETTINGS_TEXT.forbidden} />;
  }
  return <SettingsView settings={result.settings} />;
}
