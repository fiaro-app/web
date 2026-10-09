import type { Portfolio } from '@fiaro-app/contracts';
import type { MembershipListEntry } from '@/features/memberships/endpoints';

/** Nombre que se muestra cuando el cobrador no tiene cartera (o no se pudo resolver). */
export const NO_PORTFOLIO_LABEL = 'Sin cartera';

/** Una fila de la tabla de cobradores, lista para pintar. */
export interface CollectorRow {
  readonly id: string;
  readonly fullName: string;
  /** Celular tal como lo guarda la API (E.164). */
  readonly phone: string;
  readonly portfolioName: string;
  readonly active: boolean;
}

export interface CollectorsViewModel {
  readonly rows: readonly CollectorRow[];
  readonly total: number;
  readonly page: number;
  readonly pageSize: number;
}

/** Datos de paginación que devuelve la API junto con la página. */
export interface PageInfo {
  readonly total: number;
  readonly page: number;
  readonly pageSize: number;
}

/**
 * Convierte el listado de colaboradores de la API en filas de la tabla. El listado no trae cédula
 * ni efectividad (el diseño original las mostraba): la tabla muestra lo que la API entrega.
 */
export function toCollectorsViewModel(
  entries: readonly MembershipListEntry[],
  portfolios: readonly Pick<Portfolio, 'id' | 'name'>[],
  pageInfo: PageInfo,
): CollectorsViewModel {
  const portfolioNames = new Map(portfolios.map((portfolio) => [portfolio.id, portfolio.name]));
  const rows = entries.map<CollectorRow>((entry) => ({
    id: entry.id,
    fullName: entry.fullName,
    phone: entry.phone,
    portfolioName: (entry.portfolioId !== null && portfolioNames.get(entry.portfolioId)) || NO_PORTFOLIO_LABEL,
    active: entry.status === 'ACTIVE',
  }));
  return { rows, ...pageInfo };
}
