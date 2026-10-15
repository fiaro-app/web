import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ProportionBar } from "./ProportionBar";

const SEGMENTS = [
  {
    id: "a",
    label: "Capital",
    value: 75,
    amount: "$75",
    tone: "primary" as const,
  },
  {
    id: "b",
    label: "Interés",
    value: 25,
    amount: "$25",
    tone: "success" as const,
  },
  { id: "c", label: "Nada", value: 0, amount: "$0", tone: "muted" as const },
];

describe("ProportionBar", () => {
  it("nombra cada tramo con su cifra y su porcentaje, también el que vale cero", () => {
    render(<ProportionBar segments={SEGMENTS} label="Capital e interés" />);

    expect(
      screen.getByRole("img", { name: "Capital e interés" }),
    ).toBeInTheDocument();
    expect(screen.getByText("75 %")).toBeInTheDocument();
    expect(screen.getByText("25 %")).toBeInTheDocument();
    expect(screen.getByText("0 %")).toBeInTheDocument();
    expect(screen.getByText("$75")).toBeInTheDocument();
  });

  it("sin total no divide por cero", () => {
    render(
      <ProportionBar
        segments={[
          {
            id: "a",
            label: "Capital",
            value: 0,
            amount: "$0",
            tone: "primary",
          },
        ]}
        label="x"
      />,
    );

    expect(screen.getByText("0 %")).toBeInTheDocument();
  });
});
