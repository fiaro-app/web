import { INSIGHTS_TEXT as T } from "@/content/insights";
import type { Insights } from "@/features/insights/endpoints";
import { formatCop, formatCopCompact, formatPercent } from "@/lib/amount";
import { formatBusinessDate } from "@/lib/dates";
import type { FigureTone } from "@/lib/tone";
import { relativeTrend, type Trend } from "@/lib/trend";

/** Un indicador con su cambio frente al período anterior. */
export interface InsightKpi {
  readonly id: string;
  readonly label: string;
  readonly value: string;
  readonly tone: FigureTone;
  readonly trend: Trend | null;
}

/** Un tramo de una barra de proporciones. */
export interface Segment {
  readonly id: string;
  readonly label: string;
  readonly value: number;
  readonly amount: string;
  readonly tone: "primary" | "success" | "warning" | "destructive" | "muted";
}

/** Un día de la gráfica de cobro. */
export interface DailyBar {
  readonly date: string;
  readonly label: string;
  readonly collected: number;
  readonly expected: number;
}

/** Lo que dibuja la sección «Cómo va tu negocio». */
export interface InsightsViewModel {
  readonly kpis: readonly InsightKpi[];
  readonly daily: readonly DailyBar[];
  readonly dailySummary: string;
  readonly income: readonly Segment[];
  readonly methods: readonly Segment[];
  readonly lending: {
    readonly loans: string;
    readonly ticket: string | null;
    readonly interest: string | null;
  } | null;
  readonly visits: {
    readonly summary: string;
    readonly segments: readonly Segment[];
  } | null;
  readonly settlements: readonly string[] | null;
  readonly forecast: {
    readonly days: readonly DailyBar[];
    readonly total: string;
  };
}

const segment = (
  id: string,
  label: string,
  value: number,
  tone: Segment["tone"],
): Segment => ({ id, label, value, amount: formatCop(value), tone });

function lending(
  origination: Insights["origination"],
): InsightsViewModel["lending"] {
  if (origination.loansCreated === 0) return null;
  return {
    loans: T.lending.loans(origination.loansCreated),
    ticket:
      origination.averageTicket === null
        ? null
        : T.lending.ticket(formatCop(origination.averageTicket)),
    interest: T.lending.interest(formatCop(origination.agreedInterest)),
  };
}

function visits(data: Insights["visits"]): InsightsViewModel["visits"] {
  if (data.total === 0) return null;
  return {
    summary: T.visits.summary(
      data.total,
      formatPercent(data.contactRate),
      formatPercent(data.paidRate),
    ),
    segments: [
      {
        ...segment("PAID", T.visits.PAID, data.PAID, "success"),
        amount: String(data.PAID),
      },
      {
        ...segment(
          "RESCHEDULED",
          T.visits.RESCHEDULED,
          data.RESCHEDULED,
          "primary",
        ),
        amount: String(data.RESCHEDULED),
      },
      {
        ...segment("REFUSED", T.visits.REFUSED, data.REFUSED, "warning"),
        amount: String(data.REFUSED),
      },
      {
        ...segment(
          "NOT_FOUND",
          T.visits.NOT_FOUND,
          data.NOT_FOUND,
          "destructive",
        ),
        amount: String(data.NOT_FOUND),
      },
    ],
  };
}

function settlements(data: Insights["settlements"]): readonly string[] | null {
  if (data.submitted === 0) return null;
  return [
    T.settlements.submitted(data.submitted),
    T.settlements.balanced(data.balanced),
    ...(data.withDifference > 0
      ? [
          T.settlements.difference(
            data.withDifference,
            formatCop(data.shortfall),
            formatCop(data.surplus),
          ),
        ]
      : []),
  ];
}

const dayLabel = (date: string) => formatBusinessDate(date).slice(0, 5);

/** Convierte lo que responde la API en lo que pinta la sección. */
export function toInsightsViewModel(data: Insights): InsightsViewModel {
  const expectedTotal = data.daily.reduce((sum, day) => sum + day.expected, 0);
  const upcoming = data.forecast.reduce((sum, day) => sum + day.expected, 0);
  return {
    kpis: [
      {
        id: "collected",
        label: T.kpis.collected,
        value: formatCopCompact(data.income.collected),
        tone: "neutral",
        trend: relativeTrend(
          data.income.collected,
          data.previous.collected,
          "higher-is-better",
        ),
      },
      {
        id: "interest",
        label: T.kpis.interest,
        value: formatCopCompact(data.income.interest),
        tone: "good",
        trend: relativeTrend(
          data.income.interest,
          data.previous.interest,
          "higher-is-better",
        ),
      },
      {
        id: "lent",
        label: T.kpis.lent,
        value: formatCopCompact(data.origination.amountLent),
        tone: "neutral",
        trend: relativeTrend(
          data.origination.amountLent,
          data.previous.amountLent,
          "neutral",
        ),
      },
      {
        id: "contact",
        label: T.kpis.contact,
        value: formatPercent(data.visits.contactRate),
        tone: "neutral",
        trend: null,
      },
    ],
    daily: data.daily.map((day) => ({ ...day, label: dayLabel(day.date) })),
    dailySummary: T.daily.summary(
      formatCop(data.income.collected),
      formatCop(expectedTotal),
    ),
    income:
      data.income.collected === 0
        ? []
        : [
            segment(
              "principal",
              T.income.principal,
              data.income.principalRecovered,
              "primary",
            ),
            segment(
              "interest",
              T.income.interest,
              data.income.interest,
              "success",
            ),
          ],
    methods:
      data.income.collected === 0
        ? []
        : [
            segment(
              "CASH",
              T.methods.CASH,
              data.income.byMethod.CASH,
              "warning",
            ),
            segment(
              "NEQUI",
              T.methods.NEQUI,
              data.income.byMethod.NEQUI,
              "primary",
            ),
            segment(
              "TRANSFER",
              T.methods.TRANSFER,
              data.income.byMethod.TRANSFER,
              "success",
            ),
          ],
    lending: lending(data.origination),
    visits: visits(data.visits),
    settlements: settlements(data.settlements),
    forecast: {
      days: data.forecast.map((day) => ({
        date: day.date,
        label: dayLabel(day.date),
        collected: 0,
        expected: day.expected,
      })),
      total: T.forecast.total(formatCop(upcoming)),
    },
  };
}
