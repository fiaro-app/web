'use client';

import { useEffect, useState } from 'react';
import { riskEndpoints } from '@/features/risk/endpoints';
import { toRiskView, type RiskView } from '@/features/risk/risk-view-model';
import { callEndpoint } from '@/lib/api';

/**
 * El riesgo del cliente elegido, para avisar en el formulario de préstamo. Es solo un aviso: si la
 * consulta falla o no hay cliente, devuelve `null` y el formulario sigue igual.
 */
export function useClientRisk(clientId: string): RiskView | null {
  const [loaded, setLoaded] = useState<{ readonly clientId: string; readonly view: RiskView } | null>(null);

  useEffect(() => {
    if (clientId === '') return;
    const controller = new AbortController();
    callEndpoint(riskEndpoints.clients, { body: { clientIds: [clientId] }, signal: controller.signal })
      .then(({ data }) => {
        const [risk] = data;
        if (risk) setLoaded({ clientId, view: toRiskView(risk) });
      })
      .catch(() => undefined);
    return () => controller.abort();
  }, [clientId]);

  return loaded?.clientId === clientId ? loaded.view : null;
}
