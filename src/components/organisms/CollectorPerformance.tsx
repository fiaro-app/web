import { Text } from '@/components/atoms/Text';
import { StatTile } from '@/components/molecules/StatTile';
import { COLLECTORS_TEXT } from '@/content/collectors';
import type { CollectorStatsView } from '@/features/collectors/collector-stats-view-model';

/** Desempeño del cobrador en el mes (`Detalle de cobrador — Efectividad`): lo esperado, lo cobrado y la mora de su cartera. Solo presentación. */
export function CollectorPerformance({ stats }: Readonly<{ stats: CollectorStatsView }>) {
  const text = COLLECTORS_TEXT.performance;

  return (
    <section aria-labelledby="performance-title" className="flex max-w-2xl flex-col gap-4">
      <div className="flex flex-col gap-1">
        <Text variant="h3" as="h2" id="performance-title">
          {text.title}
        </Text>
        <p className="text-label text-foreground/70">{text.period(stats.period)}</p>
      </div>
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
        <StatTile label={text.effectiveness} value={stats.effectiveness} tone={stats.effectivenessTone} />
        <StatTile label={text.collected} value={stats.collected} />
        <StatTile label={text.expected} value={stats.expected} />
        <StatTile label={text.visits} value={stats.visits} />
        <StatTile label={text.overdue} value={stats.overdue} tone={stats.overdueTone} />
      </div>
    </section>
  );
}
