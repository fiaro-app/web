import type { Metadata } from 'next';
import { CheckoutResult } from '@/components/organisms/CheckoutResult';

export const metadata: Metadata = { title: 'Confirmando tu pago' };

/**
 * A donde Wompi devuelve a la persona después de pagar (`/plan/retorno/<referencia>?id=<transacción>`).
 * El id de Wompi no se usa: quien confirma el pago es su aviso a la API, y esta página solo espera a que
 * la orden deje de estar pendiente.
 */
export default async function CheckoutReturnPage({ params }: Readonly<PageProps<'/plan/retorno/[reference]'>>) {
  const { reference } = await params;
  return <CheckoutResult reference={reference} />;
}
