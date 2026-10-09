import { Text } from '@/components/atoms/Text';
import { Alert } from '@/components/molecules/Alert';
import { EmptyState } from '@/components/molecules/EmptyState';
import { StatTile } from '@/components/molecules/StatTile';
import { PendingSettlementsTable } from '@/components/organisms/PendingSettlementsTable';
import type { DashboardViewModel } from '@/features/dashboard/dashboard-view-model';

export interface DashboardViewProps {
  readonly dashboard: DashboardViewModel;
}

/** Resumen del negocio (`Screen / Web / Resumen`): indicadores, alertas y cuadres pendientes. Solo presentación. */
export function DashboardView({ dashboard }: Readonly<DashboardViewProps>) {
  const { kpis, alerts, pendingSettlements, isEmpty } = dashboard;

  return (
    <>
      <Text variant="title" as="h1" weight="bold" className="text-foreground">
        Resumen
      </Text>

      {isEmpty ? (
        <EmptyState
          icon="◔"
          title="Todavía no hay movimiento"
          description="Cuando registres cobradores, clientes y préstamos, aquí verás tu cartera, la mora y el cuadre del día."
        />
      ) : (
        <>
          <section aria-label="Indicadores" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
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
