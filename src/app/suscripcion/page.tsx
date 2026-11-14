import { LegalPage, legalMetadata } from '@/components/templates/LegalPage';
import { SUBSCRIPTION_TERMS } from '@/content/legal-subscription';

export const metadata = legalMetadata(SUBSCRIPTION_TERMS);

/** Documento legal público: indexable y enlazado desde el pie de página. */
export default function Page() {
  return <LegalPage document={SUBSCRIPTION_TERMS} />;
}
