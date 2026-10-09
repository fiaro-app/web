import { Text } from '@/components/atoms/Text';
import { Alert } from '@/components/molecules/Alert';
import { BrandColorForm } from '@/components/organisms/BrandColorForm';
import { BusinessForm } from '@/components/organisms/BusinessForm';
import { CollectionDaysForm } from '@/components/organisms/CollectionDaysForm';
import { LogoForm } from '@/components/organisms/LogoForm';
import { PlanPanel } from '@/components/organisms/PlanPanel';
import { PortfoliosPanel } from '@/components/organisms/PortfoliosPanel';
import { SETTINGS_TEXT } from '@/content/settings';
import type { SettingsView as SettingsData } from '@/features/lender/get-settings.server';

/** Configuración: datos del negocio, logo, color de marca, días sin cobro y carteras. Los datos se leen en el servidor; cada bloque es un formulario. */
export function SettingsView({ settings }: Readonly<{ settings: SettingsData }>) {
  const { name, logoUrl, brandColor, subscription, logoUploadAvailable, nonWorkingWeekdays, skipNationalHolidays, portfolios, canEdit } = settings;

  return (
    <>
      <Text variant="title" as="h1" weight="bold" className="text-foreground">
        {SETTINGS_TEXT.title}
      </Text>
      {!canEdit && <Alert tone="info">{SETTINGS_TEXT.readOnly}</Alert>}
      {/* Dos columnas desde `xl`: cada bloque queda al lado del otro en vez de apilarse. */}
      <div className="grid items-start gap-7 xl:grid-cols-2 *:max-w-none">
        {subscription && <PlanPanel subscription={subscription} />}
        <BusinessForm name={name} canEdit={canEdit} />
        <LogoForm businessName={name} logoUrl={logoUrl} canEdit={canEdit} uploadAvailable={logoUploadAvailable} />
        <BrandColorForm brandColor={brandColor} canEdit={canEdit} />
        <CollectionDaysForm nonWorkingWeekdays={nonWorkingWeekdays} skipNationalHolidays={skipNationalHolidays} canEdit={canEdit} />
        <PortfoliosPanel portfolios={portfolios} canEdit={canEdit} />
      </div>
    </>
  );
}
