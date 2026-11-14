import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ClientRiskCard } from "@/components/organisms/ClientRiskCard";
import { toRiskView } from "@/features/risk/risk-view-model";

const BASE = { clientId: "c", loansCount: 2 };

describe("ClientRiskCard", () => {
  it("pinta el medidor, el nivel y una frase por factor", () => {
    const risk = toRiskView({
      ...BASE,
      score: 80,
      level: "VERY_HIGH",
      factors: [
        { code: "OVERDUE_DAYS", points: 70, value: 40 },
        { code: "PAID_LOANS", points: -5, value: 1 },
      ],
    });
    render(<ClientRiskCard risk={risk} />);

    expect(screen.getByRole("img", { name: "Riesgo muy alto: 80 de 100" })).toBeInTheDocument();
    expect(screen.getByText("muy alto")).toBeInTheDocument();
    expect(screen.getByText("Tiene un préstamo con 40 días de atraso.")).toBeInTheDocument();
    expect(screen.getByText("Ya pagó 1 préstamo (resta riesgo).")).toBeInTheDocument();
  });

  it("sin préstamos explica que no hay historial", () => {
    render(<ClientRiskCard risk={toRiskView({ ...BASE, loansCount: 0, score: 0, level: "LOW", factors: [] })} />);

    expect(screen.getByText(/sin historial/i)).toBeInTheDocument();
  });

  it("sin factores dice que no hay señales de riesgo", () => {
    render(<ClientRiskCard risk={toRiskView({ ...BASE, score: 0, level: "LOW", factors: [] })} />);

    expect(screen.getByText("Sin mora ni señales de riesgo.")).toBeInTheDocument();
  });
});
