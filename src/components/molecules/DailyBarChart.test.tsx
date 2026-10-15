import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { DailyBarChart } from "./DailyBarChart";

const BARS = [
  { date: "2026-10-01", label: "01/10", collected: 60000, expected: 100000 },
  { date: "2026-10-02", label: "02/10", collected: 0, expected: 100000 },
];

describe("DailyBarChart", () => {
  it("dibuja la gráfica con su resumen, su leyenda y una tabla con los mismos datos para lectores de pantalla", () => {
    render(
      <DailyBarChart
        bars={BARS}
        label="Resumen del período"
        legendCollected="Cobrado"
        legendExpected="Lo que vencía"
      />,
    );

    expect(
      screen.getByRole("img", { name: "Resumen del período" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Cobrado")).toBeInTheDocument();
    expect(screen.getByText("Lo que vencía")).toBeInTheDocument();
    const rows = within(
      screen.getByRole("table", { hidden: true }),
    ).getAllByRole("row", { hidden: true });
    expect(rows).toHaveLength(2);
    expect(
      screen.getByText("01/10: cobrado $60.000, vencía $100.000"),
    ).toBeInTheDocument();
  });

  it("en la proyección no muestra «cobrado»", () => {
    render(
      <DailyBarChart
        bars={BARS}
        label="Proyección"
        legendCollected="Cobrado"
        legendExpected="Lo que vencía"
        showCollected={false}
      />,
    );

    expect(screen.queryByText("Cobrado")).not.toBeInTheDocument();
  });

  it("sin barras no se rompe", () => {
    render(
      <DailyBarChart
        bars={[]}
        label="Vacía"
        legendCollected="Cobrado"
        legendExpected="Lo que vencía"
      />,
    );

    expect(screen.getByRole("img", { name: "Vacía" })).toBeInTheDocument();
  });
});
