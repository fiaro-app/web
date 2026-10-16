import type { Metadata } from 'next';
import { LegalDocumentView } from '@/components/organisms/LegalDocumentView';
import { LegalTemplate } from '@/components/templates/LegalTemplate';
import { TERMS } from '@/content/legal';

export const metadata: Metadata = {
  title: TERMS.title,
  description: TERMS.description,
  alternates: { canonical: TERMS.path },
  openGraph: { title: `${TERMS.title} · Fiaro`, description: TERMS.description, url: TERMS.path },
};

/** Documento legal público: indexable y enlazado desde el registro y el pie de página. */
export default function Page() {
  return (
    <LegalTemplate>
      <LegalDocumentView document={TERMS} />
    </LegalTemplate>
  );
}
