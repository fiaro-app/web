import type { Metadata } from 'next';
import { LegalDocumentView } from '@/components/organisms/LegalDocumentView';
import { LegalTemplate } from '@/components/templates/LegalTemplate';
import { PRIVACY } from '@/content/legal';

export const metadata: Metadata = {
  title: PRIVACY.title,
  description: PRIVACY.description,
  alternates: { canonical: PRIVACY.path },
  openGraph: { title: `${PRIVACY.title} · Fiaro`, description: PRIVACY.description, url: PRIVACY.path },
};

/** Documento legal público: indexable y enlazado desde el registro y el pie de página. */
export default function Page() {
  return (
    <LegalTemplate>
      <LegalDocumentView document={PRIVACY} />
    </LegalTemplate>
  );
}
