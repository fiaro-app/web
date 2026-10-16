import { StatTile } from "@/components/molecules/StatTile";
import { DailyBarChart } from "@/components/molecules/DailyBarChart";
import { UpcomingBars } from "@/components/molecules/UpcomingBars";
import { ProportionBar } from "@/components/molecules/ProportionBar";
import { INSIGHTS_TEXT as T } from "@/content/insights";
import type { InsightsViewModel } from "@/features/insights/insights-view-model";

function Card({
  id,
  title,
  children,
}: Readonly<{ id: string; title: string; children: React.ReactNode }>) {
  return (
    <section
      aria-labelledby={id}
      className="flex flex-col gap-3 rounded-md bg-surface p-5"
    >
      <h3 id={id} className="text-lg font-semibold text-foreground">
        {title}
      </h3>
      {children}
    </section>
  );
}

const Note = ({ children }: Readonly<{ children: React.ReactNode }>) => (
  <p className="text-label text-foreground/70">{children}</p>
);

/**
 * «Cómo va tu negocio»: lo que entra y cuándo, cuánto es ganancia, cuánto se prestó, cómo trabajan los cobradores
 * y lo que vence en la próxima semana. Con gráficas simples y una frase que las explica. Solo presentación.
 */
export function InsightsSection({
  insights,
}: Readonly<{ insights: InsightsViewModel }>) {
  return (
    <section aria-labelledby="insights-title" className="flex flex-col gap-4">
      <h2 id="insights-title" className="text-xl font-semibold text-foreground">
        {T.title}
      </h2>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {insights.kpis.map((kpi) => (
          <StatTile
            key={kpi.id}
            label={kpi.label}
            value={kpi.value}
            tone={kpi.tone}
            trend={kpi.trend}
          />
        ))}
      </div>

      <Card id="insights-daily" title={T.daily.title}>
        <Note>{insights.dailySummary}</Note>
        {insights.dailyProgress !== null && (
          <div
            role="meter"
            aria-label={insights.dailySummary}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(insights.dailyProgress * 100)}
            className="h-3 w-full overflow-hidden rounded-full bg-foreground/10"
          >
            <div
              className={insights.dailyProgress >= 1 ? "h-3 rounded-full bg-success" : "h-3 rounded-full bg-primary"}
              style={{ width: `${String(Math.round(insights.dailyProgress * 100))}%` }}
            />
          </div>
        )}
        <DailyBarChart
          bars={insights.daily}
          label={insights.dailySummary}
          legendCollected={T.daily.legendCollected}
          legendExpected={T.daily.legendExpected}
        />
        <Note>{T.daily.hint}</Note>
      </Card>

      <div className="grid gap-4 xl:grid-cols-2">
        <Card id="insights-income" title={T.income.title}>
          {insights.income.length === 0 ? (
            <Note>{T.income.empty}</Note>
          ) : (
            <ProportionBar segments={insights.income} label={T.income.title} />
          )}
        </Card>
        <Card id="insights-methods" title={T.methods.title}>
          {insights.methods.length === 0 ? (
            <Note>{T.income.empty}</Note>
          ) : (
            <ProportionBar
              segments={insights.methods}
              label={T.methods.title}
            />
          )}
          {insights.methods.length > 0 && <Note>{T.methods.hint}</Note>}
        </Card>
        <Card id="insights-lending" title={T.lending.title}>
          {insights.lending === null ? (
            <Note>{T.lending.empty}</Note>
          ) : (
            <ul className="flex flex-col gap-1 text-label text-foreground">
              <li className="font-semibold">{insights.lending.loans}</li>
              {insights.lending.ticket && (
                <li className="text-foreground/70">
                  {insights.lending.ticket}
                </li>
              )}
              {insights.lending.interest && (
                <li className="text-foreground/70">
                  {insights.lending.interest}
                </li>
              )}
            </ul>
          )}
        </Card>
        <Card id="insights-visits" title={T.visits.title}>
          {insights.visits === null ? (
            <Note>{T.visits.empty}</Note>
          ) : (
            <>
              <Note>{insights.visits.summary}</Note>
              <ProportionBar
                segments={insights.visits.segments}
                label={T.visits.title}
              />
            </>
          )}
        </Card>
        <Card id="insights-settlements" title={T.settlements.title}>
          {insights.settlements === null ? (
            <Note>{T.settlements.empty}</Note>
          ) : (
            <ul className="flex flex-col gap-1 text-label text-foreground/80">
              {insights.settlements.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
          )}
        </Card>
        <Card id="insights-forecast" title={T.forecast.title}>
          <Note>{insights.forecast.total}</Note>
          <UpcomingBars days={insights.forecast.days} label={`${T.forecast.title}. ${insights.forecast.total}`} />
        </Card>
      </div>
    </section>
  );
}
