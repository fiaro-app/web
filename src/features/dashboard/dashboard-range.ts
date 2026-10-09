/** Período pedido en la URL del Resumen (`?desde=&hasta=`); vacío es solo hoy. */
export interface DashboardRange {
  readonly from: string;
  readonly to: string;
}

export const EMPTY_DASHBOARD_RANGE: DashboardRange = { from: '', to: '' };
