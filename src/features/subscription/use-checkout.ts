'use client';

import { useState } from 'react';
import { createCheckout } from '@/features/subscription/checkout-api';
import type { PurchasablePlanCode } from '@/features/subscription/checkout-endpoints';
import { buildCheckoutUrl } from '@/features/subscription/checkout-url';
import { describeCheckoutError } from '@/features/subscription/error-messages';

/**
 * Lógica de «Pagar con Wompi», sin diseño: pide la orden a la API y, si sale bien, lleva a la persona
 * a la página de pago. Mientras tanto (`payingPlan`) los botones quedan ocupados, así un segundo clic
 * no crea otra orden. Si falla, `error` dice por qué y los botones vuelven.
 */
export function useCheckout() {
  const [payingPlan, setPayingPlan] = useState<PurchasablePlanCode | null>(null);
  const [error, setError] = useState<string | null>(null);

  const pay = async (planCode: PurchasablePlanCode) => {
    if (payingPlan) return;
    setPayingPlan(planCode);
    setError(null);
    try {
      const checkout = await createCheckout(planCode);
      window.location.assign(buildCheckoutUrl(checkout, window.location.origin));
    } catch (failure) {
      setError(describeCheckoutError(failure).message);
      setPayingPlan(null);
    }
  };

  return { payingPlan, error, pay };
}
