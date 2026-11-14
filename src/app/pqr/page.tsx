import { LegalPage, legalMetadata } from '@/components/templates/LegalPage';
import { CLAIMS_POLICY } from '@/content/legal-subscription';

export const metadata = legalMetadata(CLAIMS_POLICY);

/** Documento legal público: indexable y enlazado desde el pie de página. */
export default function Page() {
  return <LegalPage document={CLAIMS_POLICY} />;
}
