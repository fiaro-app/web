import 'server-only';
import { lenderEndpoints } from '@/features/lender/endpoints';
import { callEndpointAsUser } from '@/lib/api/server-call';

/** Una cartera elegible en el formulario de cobrador. */
export interface PortfolioOption {
  readonly id: string;
  readonly name: string;
}

/** Carteras del negocio, ya reducidas a lo que necesita el desplegable. */
export async function getPortfolioOptions(): Promise<readonly PortfolioOption[]> {
  const portfolios = await callEndpointAsUser(lenderEndpoints.portfolios, {});
  return portfolios.map(({ id, name }) => ({ id, name }));
}
