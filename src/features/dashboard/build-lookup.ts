import type { Portfolio } from '@fiaro-app/contracts';
import type { SettlementLookup } from '@/features/dashboard/dashboard-view-model';
import type { MembershipListEntry } from '@/features/memberships/endpoints';

/**
 * Arma los nombres que completan los cuadres a partir del listado de cobradores y de las carteras:
 * `membershipId → nombre` y `membershipId → nombre de su cartera`.
 */
export function buildSettlementLookup(
  collectors: readonly MembershipListEntry[],
  portfolios: readonly Pick<Portfolio, 'id' | 'name'>[],
): SettlementLookup {
  const portfolioNames = new Map(portfolios.map((portfolio) => [portfolio.id, portfolio.name]));
  const collectorNames = new Map<string, string>();
  const collectorPortfolioNames = new Map<string, string>();

  for (const collector of collectors) {
    collectorNames.set(collector.id, collector.fullName);
    const portfolioName = collector.portfolioId === null ? undefined : portfolioNames.get(collector.portfolioId);
    if (portfolioName !== undefined) collectorPortfolioNames.set(collector.id, portfolioName);
  }
  return { collectorNames, collectorPortfolioNames };
}
