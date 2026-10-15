import { describe, expect, it } from "vitest";
import type { Insights } from "./endpoints";
import { toInsightsViewModel } from "./insights-view-model";

const INSIGHTS: Insights = {
  from: "2026-10-01",
  to: "2026-10-03",
  daily: [
    { date: "2026-10-01", expected: 100000, collected: 60000 },
    { date: "2026-10-02", expected: 100000, collected: 0 },
    { date: "2026-10-03", expected: 0, collected: 20000 },
  ],
  income: {
    collected: 80000,
    byMethod: { CASH: 60000, NEQUI: 20000, TRANSFER: 0 },
    interest: 20000,
    principalRecovered: 60000,
    interestShare: 0.25,
  },
  origination: {
    loansCreated: 2,
    amountLent: 500000,
    averageTicket: 250000,
    agreedInterest: 100000,
  },
  visits: {
    PAID: 6,
    NOT_FOUND: 2,
    REFUSED: 1,
    RESCHEDULED: 1,
    total: 10,
    contactRate: 0.8,
    paidRate: 0.6,
  },
  settlements: {
    submitted: 3,
    balanced: 1,
    withDifference: 2,
    shortfall: 40000,
    surplus: 5000,
  },
  forecast: Array.from({ length: 7 }, (_, index) => ({
    date: `2026-10-${String(4 + index).padStart(2, "0")}`,
    expected: index === 0 ? 70000 : 0,
  })),
  previous: {
    from: "2026-09-28",
    to: "2026-09-30",
    collected: 40000,
    interest: 10000,
    loansCreated: 1,
    amountLent: 200000,
  },
};

describe("toInsightsViewModel", () => {
  it("arma los indicadores con su tendencia frente al período anterior", () => {
    const { kpis } = toInsightsViewModel(INSIGHTS);

    expect(kpis.map((kpi) => kpi.id)).toEqual([
      "collected",
      "interest",
      "lent",
      "contact",
    ]);
    expect(kpis[0]?.value).toBe("$80.000");
    expect(kpis[0]?.trend?.label).toBe("↑ 100 %");
    expect(kpis[1]?.trend?.tone).toBe("good");
    expect(kpis[2]?.trend?.tone).toBe("neutral");
    expect(kpis[3]?.value).toBe("80 %");
  });

  it("resume el período y deja una barra por día con su fecha corta", () => {
    const view = toInsightsViewModel(INSIGHTS);

    expect(view.dailySummary).toBe(
      "En el período cobraste $80.000 de $200.000 que vencían según el calendario.",
    );
    expect(view.daily.map((day) => day.label)).toEqual([
      "01/10",
      "02/10",
      "03/10",
    ]);
  });

  it("parte lo cobrado en capital e interés y por medio de pago", () => {
    const view = toInsightsViewModel(INSIGHTS);

    expect(view.income.map((segment) => [segment.id, segment.value])).toEqual([
      ["principal", 60000],
      ["interest", 20000],
    ]);
    expect(view.methods.map((segment) => segment.id)).toEqual([
      "CASH",
      "NEQUI",
      "TRANSFER",
    ]);
  });

  it("explica colocación, visitas, cuadres y proyección", () => {
    const view = toInsightsViewModel(INSIGHTS);

    expect(view.lending).toEqual({
      loans: "2 préstamos nuevos",
      ticket: "Promedio por préstamo: $250.000",
      interest: "Interés pactado: $100.000",
    });
    expect(view.visits?.summary).toBe(
      "10 visitas · encontraron al cliente en 80 % y terminaron en pago en 60 %.",
    );
    expect(view.visits?.segments[0]).toMatchObject({ id: "PAID", amount: "6" });
    expect(view.settlements).toEqual([
      "3 cuadres enviados",
      "1 cuadraron exacto",
      "2 con diferencia: faltaron $40.000 y sobraron $5.000",
    ]);
    expect(view.forecast.total).toBe("Total esperado: $70.000");
    expect(view.forecast.days).toHaveLength(7);
  });

  it("sin movimiento, las secciones vacías salen como null o vacías, no como ceros", () => {
    const empty: Insights = {
      ...INSIGHTS,
      income: {
        collected: 0,
        byMethod: { CASH: 0, NEQUI: 0, TRANSFER: 0 },
        interest: 0,
        principalRecovered: 0,
        interestShare: null,
      },
      origination: {
        loansCreated: 0,
        amountLent: 0,
        averageTicket: null,
        agreedInterest: 0,
      },
      visits: {
        PAID: 0,
        NOT_FOUND: 0,
        REFUSED: 0,
        RESCHEDULED: 0,
        total: 0,
        contactRate: null,
        paidRate: null,
      },
      settlements: {
        submitted: 0,
        balanced: 0,
        withDifference: 0,
        shortfall: 0,
        surplus: 0,
      },
    };

    const view = toInsightsViewModel(empty);

    expect(view.income).toEqual([]);
    expect(view.methods).toEqual([]);
    expect(view.lending).toBeNull();
    expect(view.visits).toBeNull();
    expect(view.settlements).toBeNull();
    expect(view.kpis[3]?.value).toBe("—");
  });

  it("con un solo préstamo usa el singular y sin diferencias no menciona faltantes", () => {
    const view = toInsightsViewModel({
      ...INSIGHTS,
      origination: {
        loansCreated: 1,
        amountLent: 100000,
        averageTicket: null,
        agreedInterest: 0,
      },
      settlements: {
        submitted: 1,
        balanced: 1,
        withDifference: 0,
        shortfall: 0,
        surplus: 0,
      },
    });

    expect(view.lending?.loans).toBe("1 préstamo nuevo");
    expect(view.lending?.ticket).toBeNull();
    expect(view.settlements).toEqual([
      "1 cuadre enviado",
      "1 cuadraron exacto",
    ]);
  });
});
