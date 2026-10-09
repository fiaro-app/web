import { StateIcon } from '@/components/atoms/StateIcon';
import { Text } from '@/components/atoms/Text';
import { Alert } from '@/components/molecules/Alert';
import { EmptyState } from '@/components/molecules/EmptyState';
import { StatTile } from '@/components/molecules/StatTile';
import { DashboardPeriodFilter } from '@/components/organisms/DashboardPeriodFilter';
import { PendingSettlementsTable } from '@/components/organisms/PendingSettlementsTable';
import type { DashboardViewModel } from '@/features/dashboard/dashboard-view-model';
import { EMPTY_DASHBOARD_RANGE, type DashboardRange } from '@/features/dashboard/dashboard-range';

export interface DashboardViewProps {
  readonly dashboard: DashboardViewModel;
  /** Período pedido en la URL; vacío es solo hoy. */
  readonly range?: DashboardRange;
}

/** Resumen del negocio (`Screen / Web / Resumen`): indicadores, alertas y cuadres pendientes. Solo presentación. */
export function DashboardView({ dashboard, range = EMPTY_DASHBOARD_RANGE }: Readonly<DashboardViewProps>) {
  const { kpis, alerts, pendingSettlements, isEmpty, periodLabel } = dashboard;

  return (
    <>
      <div className="flex flex-col gap-1">
        <Text variant="title" as="h1" weight="bold" className="text-foreground">
          Resumen
        </Text>
        <Text variant="label" className="text-foreground/70">
          {periodLabel}
        </Text>
      </div>

      <DashboardPeriodFilter range={range} />

      {isEmpty ? (
        <EmptyState
          icon={<StateIcon name="chart" />}
          title="Todavía no hay movimiento"
          description="Cuando registres cobradores, clientes y préstamos, aquí verás tu cartera, la mora y el cuadre del día."
        />
      ) : (
        <>
          <section aria-label="Indicadores" className="grid grid-cols-2 gap-4 xl:grid-cols-5">
            {kpis.map((kpi) => (
              <StatTile key={kpi.id} label={kpi.label} value={kpi.value} tone={kpi.tone} />
            ))}
          </section>

          {alerts.length > 0 && (
            <section aria-labelledby="alerts-title" className="flex flex-col gap-3">
              <h2 id="alerts-title" className="text-lg font-semibold text-foreground">
                Alertas
              </h2>
              {alerts.map((alert) => (
                <Alert key={alert} tone="warning">
                  {alert}
                </Alert>
              ))}
            </section>
          )}

          <section aria-labelledby="settlements-title" className="flex flex-col gap-3">
            <h2 id="settlements-title" className="text-lg font-semibold text-foreground">
              Cuadres pendientes de aprobar
            </h2>
            {pendingSettlements.length > 0 ? (
              <PendingSettlementsTable settlements={pendingSettlements} />
            ) : (
              <p className="rounded-md bg-surface p-5 text-label text-foreground/70">No hay cuadres pendientes por ahora.</p>
            )}
          </section>
        </>
      )}
    </>
  );
}
