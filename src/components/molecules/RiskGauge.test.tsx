import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { RiskGauge } from "@/components/molecules/RiskGauge";

describe("RiskGauge", () => {
  it("expone el puntaje y el nivel como imagen con nombre y pinta la cifra", () => {
    render(<RiskGauge score={80} tone="error" label="Riesgo muy alto: 80 de 100" />);

    expect(screen.getByRole("img", { name: "Riesgo muy alto: 80 de 100" })).toBeInTheDocument();
    expect(screen.getByText("80")).toBeInTheDocument();
  });

  it("limita el anillo entre 0 y 100", () => {
    const { container } = render(<RiskGauge score={250} tone="error" label="x" />);
    const [, ring] = container.querySelectorAll("circle");
    const [filled, total] = (ring?.getAttribute("stroke-dasharray") ?? "").split(" ");

    expect(filled).toBe(total);
  });
});
