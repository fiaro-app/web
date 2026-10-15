import { RiskGauge } from "@/components/molecules/RiskGauge";
import { RISK_TEXT } from "@/content/risk";
import type { RiskView } from "@/features/risk/risk-view-model";
import { TONE_TEXT_CLASSES } from "@/lib/tone";
import { cn } from "@/lib/cn";

export interface ClientRiskCardProps {
  readonly risk: RiskView;
}

/** El riesgo del cliente en su ficha: el medidor, el nivel y lo que lo explica. Solo presentación. */
export function ClientRiskCard({ risk }: Readonly<ClientRiskCardProps>) {
  return (
    <section aria-labelledby="client-risk-title" className="flex max-w-lg flex-col gap-3 rounded-md bg-surface p-5">
      <h2 id="client-risk-title" className="text-lg font-semibold text-foreground">
        {RISK_TEXT.title}
      </h2>
      {risk.hasHistory ? (
        <div className="flex items-center gap-5">
          <RiskGauge score={risk.score} tone={risk.tone} label={risk.ariaLabel} />
          <div className="flex flex-col gap-2">
            <p className={cn("text-body font-semibold capitalize", TONE_TEXT_CLASSES[risk.tone])}>{risk.levelLabel}</p>
            {risk.factors.length === 0 ? (
              <p className="text-label text-foreground/70">{RISK_TEXT.noFactors}</p>
            ) : (
              <ul className="flex list-disc flex-col gap-1 pl-5 text-label text-foreground/80">
                {risk.factors.map((factor) => (
                  <li key={factor}>{factor}</li>
                ))}
              </ul>
            )}
          </div>
        </div>
      ) : (
        <p className="text-label text-foreground/70">{RISK_TEXT.noHistory}</p>
      )}
    </section>
  );
}
