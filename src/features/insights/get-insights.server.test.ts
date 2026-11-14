import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));
const { callEndpointAsUser } = vi.hoisted(() => ({
  callEndpointAsUser: vi.fn(),
}));
vi.mock("@/lib/api/server-call", () => ({ callEndpointAsUser }));

import { getInsights } from "./get-insights.server";

const RESPONSE = {
  from: "2026-10-01",
  to: "2026-10-02",
  daily: [],
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
  forecast: [],
  previous: {
    from: "2026-09-29",
    to: "2026-09-30",
    collected: 0,
    interest: 0,
    loansCreated: 0,
    amountLent: 0,
  },
};

beforeEach(() => {
  callEndpointAsUser.mockReset();
});

describe("getInsights", () => {
  it("sin período pide el mes por defecto, y con período lo envía", async () => {
    callEndpointAsUser.mockResolvedValue(RESPONSE);

    await getInsights({ from: "", to: "", collectorId: "", portfolioId: "" });
    await getInsights({
      from: "2026-10-01",
      to: "2026-10-09",
      collectorId: "",
      portfolioId: "",
    });

    expect(callEndpointAsUser.mock.calls[0]?.[1]).toEqual({ body: {} });
    expect(callEndpointAsUser.mock.calls[1]?.[1]).toEqual({
      body: { dateRange: { from: "2026-10-01", to: "2026-10-09" } },
    });
  });

  it("si la API falla devuelve null para que Estadísticas se pinte igual", async () => {
    callEndpointAsUser.mockRejectedValue(new Error("caída"));

    await expect(
      getInsights({ from: "", to: "", collectorId: "", portfolioId: "" }),
    ).resolves.toBeNull();
  });
});
