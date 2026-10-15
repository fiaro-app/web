import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import type { InsightsViewModel } from "@/features/insights/insights-view-model";
import { InsightsSection } from "./InsightsSection";

const FULL: InsightsViewModel = {
  kpis: [
    {
      id: "collected",
      label: "Cobrado",
      value: "$80.000",
      tone: "neutral",
      trend: null,
    },
  ],
  daily: [{ date: "2026-10-01", label: "01/10", collected: 1, expected: 2 }],
  dailySummary:
    "En el período cobraste $80.000 de $200.000 que vencían según el calendario.",
  income: [
    {
      id: "principal",
      label: "Capital que regresa",
      value: 60,
      amount: "$60",
      tone: "primary",
    },
  ],
  methods: [
    {
      id: "CASH",
      label: "Efectivo",
      value: 60,
      amount: "$60",
      tone: "warning",
    },
  ],
  lending: {
    loans: "2 préstamos nuevos",
    ticket: "Promedio por préstamo: $250.000",
    interest: "Interés pactado: $100.000",
  },
  visits: {
    summary:
      "10 visitas · encontraron al cliente en 80 % y terminaron en pago en 60 %.",
    segments: [
      { id: "PAID", label: "Pagaron", value: 6, amount: "6", tone: "success" },
    ],
  },
  settlements: ["3 cuadres enviados", "1 cuadraron exacto"],
  forecast: {
    days: [
      { date: "2026-10-04", label: "04/10", collected: 0, expected: 70000 },
    ],
    total: "Total esperado: $70.000",
  },
};

describe("InsightsSection", () => {
  it("muestra todas las secciones con sus textos", () => {
    render(<InsightsSection insights={FULL} />);

    expect(
      screen.getByRole("heading", { name: "Cómo va tu negocio" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Cobro día a día" }),
    ).toBeInTheDocument();
    expect(screen.getByText("2 préstamos nuevos")).toBeInTheDocument();
    expect(screen.getByText("3 cuadres enviados")).toBeInTheDocument();
    expect(screen.getByText("Total esperado: $70.000")).toBeInTheDocument();
  });

  it("sin datos explica cada tarjeta en vez de dejarla vacía", () => {
    render(
      <InsightsSection
        insights={{
          ...FULL,
          income: [],
          methods: [],
          lending: null,
          visits: null,
          settlements: null,
        }}
      />,
    );

    expect(
      screen.getAllByText("Todavía no hay cobros en este período."),
    ).toHaveLength(2);
    expect(
      screen.getByText("No diste préstamos nuevos en este período."),
    ).toBeInTheDocument();
    expect(
      screen.getByText("No se registraron visitas en este período."),
    ).toBeInTheDocument();
    expect(
      screen.getByText("No se enviaron cuadres en este período."),
    ).toBeInTheDocument();
  });
});
