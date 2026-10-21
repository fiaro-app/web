import { describe, expect, it } from 'vitest';
import type { Checkout } from './checkout-endpoints';
import { buildCheckoutUrl } from './checkout-url';

const CHECKOUT: Checkout = {
  reference: 'fiaro-abc',
  planCode: 'PRO',
  months: 1,
  checkout: {
    url: 'https://checkout.wompi.co/p/',
    publicKey: 'pub_test_abc',
    currency: 'COP',
    amountInCents: 6_900_000,
    reference: 'fiaro-abc',
    signatureIntegrity: 'firma-del-servidor',
    redirectUrl: 'https://otra.example/plan',
  },
};

describe('buildCheckoutUrl', () => {
  it('copia los campos del checkout tal como los firmó la API', () => {
    const url = new URL(buildCheckoutUrl(CHECKOUT, 'https://app.fiaro.co'));

    expect(`${url.origin}${url.pathname}`).toBe('https://checkout.wompi.co/p/');
    expect(Object.fromEntries(url.searchParams)).toMatchObject({
      'public-key': 'pub_test_abc',
      currency: 'COP',
      'amount-in-cents': '6900000',
      reference: 'fiaro-abc',
      'signature:integrity': 'firma-del-servidor',
    });
  });

  it('vuelve a la página de retorno de esa orden, en el origen de la web', () => {
    const url = new URL(buildCheckoutUrl(CHECKOUT, 'https://app.fiaro.co'));

    expect(url.searchParams.get('redirect-url')).toBe('https://app.fiaro.co/plan/retorno/fiaro-abc');
  });
});
