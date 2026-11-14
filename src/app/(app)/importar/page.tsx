import { StateIcon } from '@/components/atoms/StateIcon';
import type { Metadata } from 'next';
import { ButtonLink } from '@/components/atoms/ButtonLink';
import { Text } from '@/components/atoms/Text';
import { EmptyState } from '@/components/molecules/EmptyState';
import { ImportView } from '@/components/organisms/ImportView';
import { IMPORTS_TEXT } from '@/content/imports';
import { getAccess } from '@/features/app-shell/get-access.server';
import { getSubscription } from '@/features/subscription/get-subscription.server';

export const metadata: Metadata = { title: 'Importar' };

/**
 * Importar clientes y préstamos en curso desde una hoja. Es de quien administra el negocio, y solo los
 * planes con importación (Pro, Team y la prueba) la traen: con Individual se ofrece subir de plan (D-152 de la API).
 */
export default async function ImportPage() {
  if (!(await getAccess()).canManage) {
    return <EmptyState icon={<StateIcon name="lock" />} {...IMPORTS_TEXT.forbidden} />;
  }
  const canImport = (await getSubscription())?.excelImport ?? true;
  if (!canImport) {
    return (
      <EmptyState
        icon={<StateIcon name="lock" />}
        title={IMPORTS_TEXT.upgrade.title}
        description={IMPORTS_TEXT.upgrade.description}
        action={<ButtonLink href="/plan">{IMPORTS_TEXT.upgrade.action}</ButtonLink>}
      />
    );
  }

  return (
    <>
      <Text variant="title" as="h1" weight="bold" className="text-foreground">
        {IMPORTS_TEXT.title}
      </Text>
      <ImportView />
    </>
  );
}
