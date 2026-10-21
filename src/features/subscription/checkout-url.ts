import type { Checkout } from '@/features/subscription/checkout-endpoints';

/**
 * La dirección de la página de pago de Wompi con los campos del Web Checkout. La firma de
 * integridad la calculó la API con su secreto: aquí solo se copia.
 *
 * `redirect-url` apunta a la página de retorno de ESTA orden (`/plan/retorno/<referencia>`): Wompi
 * solo agrega el id de su transacción, así que sin la referencia en la ruta no sabríamos qué orden
 * consultar. No entra en la firma, por lo que cambiarlo no la invalida.
 *
 * @param checkout - La orden que devolvió la API.
 * @param origin - El origen de la web (`window.location.origin`).
 */
export function buildCheckoutUrl(checkout: Checkout, origin: string): string {
  const { checkout: params, reference } = checkout;
  const query = new URLSearchParams({
    'public-key': params.publicKey,
    currency: params.currency,
    'amount-in-cents': String(params.amountInCents),
    reference: params.reference,
    'signature:integrity': params.signatureIntegrity,
    'redirect-url': `${origin}/plan/retorno/${encodeURIComponent(reference)}`,
  });
  return `${params.url}?${query.toString()}`;
}
