import 'server-only';
import type { Portfolio, Weekday } from '@fiaro-app/contracts';
import { ADMIN_LABEL } from '@/features/app-shell/role-label';
import { getShellContext } from '@/features/app-shell/get-shell-context.server';
import { requireUser } from '@/features/auth/session.server';
import { lenderEndpoints } from '@/features/lender/endpoints';
import { isApiRequestError } from '@/lib/api';
import { callEndpointAsUser } from '@/lib/api/server-call';

/** Lo que muestra la pantalla de Configuración. */
export interface SettingsView {
  readonly name: string;
  readonly logoUrl: string | null;
  readonly nonWorkingWeekdays: readonly Weekday[];
  readonly skipNationalHolidays: boolean;
  readonly portfolios: readonly Pick<Portfolio, 'id' | 'name' | 'isDefault'>[];
  /** Solo quien administra el negocio (Owner o Lender) puede cambiar la configuración. */
  readonly canEdit: boolean;
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
    const [lender, portfolios, shell] = await Promise.all([
      callEndpointAsUser(lenderEndpoints.get, {}),
      callEndpointAsUser(lenderEndpoints.portfolios, {}),
      getShellContext(user),
    ]);
    return {
      status: 'ok',
      settings: {
        name: lender.name,
        logoUrl: lender.logoUrl,
        nonWorkingWeekdays: lender.nonWorkingWeekdays,
        skipNationalHolidays: lender.skipNationalHolidays,
        portfolios: portfolios.map(({ id, name, isDefault }) => ({ id, name, isDefault })),
        canEdit: shell.roleLabel === ADMIN_LABEL,
      },
    };
  } catch (error) {
    if (isApiRequestError(error) && error.hasCode('FORBIDDEN')) return { status: 'forbidden' };
    throw error;
  }
}
