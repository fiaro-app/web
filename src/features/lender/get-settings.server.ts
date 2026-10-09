import 'server-only';
import type { Portfolio, Weekday } from '@fiaro-app/contracts';
import { ADMIN_LABEL } from '@/features/app-shell/role-label';
import { getShellContext } from '@/features/app-shell/get-shell-context.server';
import { requireUser } from '@/features/auth/session.server';
import { lenderEndpoints } from '@/features/lender/endpoints';
import { isApiRequestError } from '@/lib/api';
import { parseStorageOrigin } from '@/lib/security-headers';
import { getSubscription } from '@/features/subscription/get-subscription.server';
import type { SubscriptionView } from '@/features/subscription/subscription-view-model';
import { callEndpointAsUser } from '@/lib/api/server-call';

/** Lo que muestra la pantalla de Configuración. */
export interface SettingsView {
  readonly name: string;
  readonly logoUrl: string | null;
  /** Color de marca (`#RRGGBB`); `null` es el de Fiaro. */
  readonly brandColor: string | null;
  readonly nonWorkingWeekdays: readonly Weekday[];
  readonly skipNationalHolidays: boolean;
  readonly portfolios: readonly Pick<Portfolio, 'id' | 'name' | 'isDefault'>[];
  /** Solo quien administra el negocio (Owner o Lender) puede cambiar la configuración. */
  readonly canEdit: boolean;
  /** Si el entorno tiene el almacenamiento de archivos configurado (`STORAGE_ORIGIN`): sin él el logo no se puede subir. */
  readonly logoUploadAvailable: boolean;
  /** El plan del negocio; `null` si no se pudo traer (la pantalla sigue sin ese bloque). */
  readonly subscription: SubscriptionView | null;
}

export type SettingsResult =
  | { readonly status: 'ok'; readonly settings: SettingsView }
  /** La persona no tiene un negocio activo del que ver la configuración (403). */
  | { readonly status: 'forbidden' };

/**
 * Trae los datos del negocio y sus carteras, y si la persona puede editarlos. Un 403 es un estado
 * de la pantalla; cualquier otra falla se propaga al `error.tsx`.
 */
export async function getSettings(): Promise<SettingsResult> {
  try {
    const user = await requireUser();
    const [lender, portfolios, shell, subscription] = await Promise.all([
      callEndpointAsUser(lenderEndpoints.get, {}),
      callEndpointAsUser(lenderEndpoints.portfolios, {}),
      getShellContext(user),
      getSubscription(),
    ]);
    return {
      status: 'ok',
      settings: {
        name: lender.name,
        logoUrl: lender.logoUrl,
        brandColor: lender.brandColor ?? null,
        nonWorkingWeekdays: lender.nonWorkingWeekdays,
        skipNationalHolidays: lender.skipNationalHolidays,
        portfolios: portfolios.map(({ id, name, isDefault }) => ({ id, name, isDefault })),
        canEdit: shell.roleLabel === ADMIN_LABEL,
        logoUploadAvailable: parseStorageOrigin(process.env.STORAGE_ORIGIN) !== null,
        subscription,
      },
    };
  } catch (error) {
    if (isApiRequestError(error) && error.hasCode('FORBIDDEN')) return { status: 'forbidden' };
    throw error;
  }
}
