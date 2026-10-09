import { ActivityItem } from '@/components/molecules/ActivityItem';
import { KpiTile } from '@/components/molecules/KpiTile';
import { cn } from '@/lib/cn';

export interface AuthPreviewCardProps {
  readonly kpis: readonly { readonly label: string; readonly value: string; readonly valueClassName?: string }[];
  readonly activity: string;
  readonly className?: string;
}

/** Tarjeta ilustrativa del panel de marca de Login y Registro: tres indicadores y una actividad. Decorativa. */
export function AuthPreviewCard({ kpis, activity, className }: Readonly<AuthPreviewCardProps>) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        'flex w-full max-w-95 flex-col gap-2.5 rounded-md bg-surface p-5 text-foreground shadow-[0_20px_50px_-10px_rgb(28_27_46/0.35)]',
        className,
      )}
    >
      <div className="grid grid-cols-3 gap-2">
        {kpis.map((kpi) => (
          <KpiTile key={kpi.label} {...kpi} />
        ))}
      </div>
      <ActivityItem text={activity} />
    </div>
  );
}
