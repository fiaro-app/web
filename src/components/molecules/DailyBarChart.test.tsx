import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { DailyBarChart } from "./DailyBarChart";

const BARS = [
  { date: "2026-10-01", label: "jue 1", collected: 60000, expected: 100000 },
  { date: "2026-10-02", label: "vie 2", collected: 120000, expected: 100000 },
  { date: "2026-10-03", label: "sáb 3", collected: 0, expected: 0 },
];

const chart = (bars = BARS) => (
  <DailyBarChart
    bars={bars}
    label="Resumen del período"
    legendCollected="Lo que cobraste"
    legendExpected="Lo que tocaba cobrar"
  />
);

describe("DailyBarChart", () => {
  it("dibuja la gráfica con su resumen, su leyenda y una tabla con los mismos datos para lectores de pantalla", () => {
    render(chart());

    expect(screen.getByRole("img", { name: "Resumen del período" })).toBeInTheDocument();
    expect(screen.getByText("Lo que cobraste")).toBeInTheDocument();
    expect(screen.getByText("Lo que tocaba cobrar")).toBeInTheDocument();
    expect(screen.getByText("Llegaste a la meta del día")).toBeInTheDocument();
    const rows = within(screen.getByRole("table", { hidden: true })).getAllByRole("row", { hidden: true });
    expect(rows).toHaveLength(3);
    expect(screen.getByText("jue 1: cobraste $60.000 de $100.000 que tocaba")).toBeInTheDocument();
  });

  it("pinta de verde el día que llegó a la meta y de azul el que se quedó corto", () => {
    const { container } = render(chart());

    expect(container.querySelectorAll("rect.fill-success")).toHaveLength(1);
    expect(container.querySelectorAll("rect.fill-primary")).toHaveLength(1);
    expect(container.querySelectorAll("rect.fill-foreground\\/12")).toHaveLength(2);
  });

  it("sin barras no se rompe", () => {
    render(chart([]));

    expect(screen.getByRole("img", { name: "Resumen del período" })).toBeInTheDocument();
  });
});
