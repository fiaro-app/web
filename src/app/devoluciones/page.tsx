import { LegalPage, legalMetadata } from '@/components/templates/LegalPage';
import { REFUND_POLICY } from '@/content/legal-subscription';

export const metadata = legalMetadata(REFUND_POLICY);

/** Documento legal público: indexable y enlazado desde el pie de página. */
export default function Page() {
  return <LegalPage document={REFUND_POLICY} />;
}
