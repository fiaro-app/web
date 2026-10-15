import { CLIENTS_TEXT } from '@/content/clients';
import type { ClientListItem } from '@/features/clients/endpoints';
import type { RiskView } from '@/features/risk/risk-view-model';
import { formatCop } from '@/lib/amount';

/** Una fila de la tabla de clientes, lista para pintar. */
export interface ClientRow {
  readonly id: string;
  readonly fullName: string;
  readonly nationalId: string;
  /** Teléfono tal como lo guarda la API (E.164). */
  readonly phone: string;
  readonly occupation: string;
  /** Cuántos préstamos activos tiene. */
  readonly activeLoans: string;
  /** Lo que debe hoy, sumado sobre sus préstamos activos. */
  readonly balance: string;
  /** Mora: "Al día" o el mayor atraso entre sus préstamos ("12 días"). */
  readonly overdue: string;
  /** Lo vencido y sin pagar ("$60.000"); `null` si está al día. */
  readonly overdueAmount: string | null;
  /** `true` si tiene mora, para pintarla en rojo. */
  readonly isOverdue: boolean;
  /** Riesgo del cliente en el negocio; ausente si no se pudo consultar. */
  readonly risk?: RiskView;
}

export interface ClientsViewModel {
  readonly rows: readonly ClientRow[];
  readonly total: number;
  readonly page: number;
  readonly pageSize: number;
  /** Texto de búsqueda activo, para mostrarlo en el campo y en el estado vacío. */
  readonly search: string;
}

/** Convierte una página de clientes de la API en filas de la tabla. */
export function toClientsViewModel(
  clients: readonly ClientListItem[],
  pageInfo: { readonly total: number; readonly page: number; readonly pageSize: number },
  search: string,
): ClientsViewModel {
  const rows = clients.map<ClientRow>((client) => {
    const isOverdue = client.overdueDays > 0;
    return {
      id: client.id,
      fullName: client.fullName,
      nationalId: client.nationalId,
      phone: client.phone,
      occupation: client.occupation,
      activeLoans: String(client.activeLoans),
      balance: formatCop(client.balance),
      overdue: isOverdue ? CLIENTS_TEXT.overdueDays(client.overdueDays) : CLIENTS_TEXT.onTime,
      overdueAmount: isOverdue ? formatCop(client.overdueAmount) : null,
      isOverdue,
    };
  });
  return { rows, ...pageInfo, search };
}
