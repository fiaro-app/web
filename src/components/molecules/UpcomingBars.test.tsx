import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { UpcomingBars } from "./UpcomingBars";

const DAYS = [
  { date: "2026-10-04", label: "Mañana · dom 4", collected: 0, expected: 70000 },
  { date: "2026-10-05", label: "lun 5", collected: 0, expected: 35000 },
  { date: "2026-10-06", label: "mar 6", collected: 0, expected: 0 },
];

describe("UpcomingBars", () => {
  it("lista cada día con su cifra, y los días sin nada por cobrar lo dicen", () => {
    render(<UpcomingBars days={DAYS} label="Próximos 7 días" />);

    const items = within(screen.getByRole("list", { name: "Próximos 7 días" })).getAllByRole("listitem");
    expect(items).toHaveLength(3);
    expect(within(items[0]!).getByText("Mañana · dom 4")).toBeInTheDocument();
    expect(within(items[0]!).getByText("$70.000")).toBeInTheDocument();
    expect(within(items[2]!).getByText("Nada por cobrar")).toBeInTheDocument();
  });

  it("la barra de cada día es proporcional al mayor", () => {
    const { container } = render(<UpcomingBars days={DAYS} label="Próximos 7 días" />);

    const widths = [...container.querySelectorAll<HTMLElement>("li span[style]")].map((bar) => bar.style.width);
    expect(widths).toEqual(["100%", "50%", "0%"]);
  });

  it("sin días no se rompe", () => {
    render(<UpcomingBars days={[]} label="Vacía" />);

    expect(screen.getByRole("list", { name: "Vacía" })).toBeInTheDocument();
  });
});
