import { Link } from '@/components/atoms/Link';
import { Text } from '@/components/atoms/Text';
import { InfoRow } from '@/components/molecules/InfoRow';
import { SettlementReviewForm } from '@/components/organisms/SettlementReviewForm';
import { SETTLEMENTS_TEXT } from '@/content/settlements';
import type { SettlementDetailView } from '@/features/settlements/settlements-view-model';
import { cn } from '@/lib/cn';
import { FIGURE_TEXT_CLASSES } from '@/lib/tone';

/** Detalle de un cuadre: montos por medio de pago, notas y, si está pendiente, el formulario de revisión. */
export function SettlementDetail({ settlement }: Readonly<{ settlement: SettlementDetailView }>) {
  const text = SETTLEMENTS_TEXT.detail;

  return (
    <section aria-labelledby="settlement-title" className="flex max-w-lg flex-col gap-5">
      <Link href="/cuadres">{text.back}</Link>
      <Text variant="title" as="h1" weight="bold" id="settlement-title" className="text-foreground">
        {text.title(settlement.collectorName)}
      </Text>

      <div className="flex flex-col divide-y divide-foreground/8 overflow-hidden rounded-md">
        <InfoRow label={text.rows.portfolio} value={settlement.portfolioName} />
        <InfoRow label={text.rows.date} value={settlement.date} />
        <InfoRow label={text.rows.expected} value={settlement.expected} />
        <InfoRow label={text.rows.cash} value={settlement.cash} />
        <InfoRow label={text.rows.nequi} value={settlement.nequi} />
        <InfoRow label={text.rows.transfer} value={settlement.transfer} />
        <InfoRow label={text.rows.collected} value={settlement.collected} />
        <InfoRow
          label={text.rows.difference}
          value={
            <span className={cn('font-semibold', FIGURE_TEXT_CLASSES[settlement.differenceTone])}>
              {settlement.difference ?? text.balanced}
            </span>
          }
        />
        <InfoRow
          label={text.rows.status}
          value={<span className={cn('font-semibold', FIGURE_TEXT_CLASSES[settlement.statusTone])}>{settlement.status}</span>}
        />
        <InfoRow label={text.rows.submittedAt} value={settlement.submittedAt} />
        {settlement.reviewedAt !== null && <InfoRow label={text.rows.reviewedAt} value={settlement.reviewedAt} />}
      </div>

      {settlement.collectorNote && (
        <div className="flex flex-col gap-1 rounded-md bg-surface p-5">
          <Text variant="caption" className="font-semibold text-foreground/60">
            {text.collectorNote}
          </Text>
          <Text variant="label">{settlement.collectorNote}</Text>
        </div>
      )}
      {settlement.reviewNote && (
        <div className="flex flex-col gap-1 rounded-md bg-surface p-5">
          <Text variant="caption" className="font-semibold text-foreground/60">
            {text.reviewNote}
          </Text>
          <Text variant="label">{settlement.reviewNote}</Text>
        </div>
      )}

      {settlement.reviewable && <SettlementReviewForm settlementId={settlement.id} />}
    </section>
  );
}
