import { LegalPage, legalMetadata } from '@/components/templates/LegalPage';
import { TERMS } from '@/content/legal';

export const metadata = legalMetadata(TERMS);

/** Documento legal público: indexable y enlazado desde el registro y el pie de página. */
export default function Page() {
  return <LegalPage document={TERMS} />;
}
