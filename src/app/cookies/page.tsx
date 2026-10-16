import type { Metadata } from 'next';
import { LegalDocumentView } from '@/components/organisms/LegalDocumentView';
import { LegalTemplate } from '@/components/templates/LegalTemplate';
import { COOKIES } from '@/content/legal';

export const metadata: Metadata = {
  title: COOKIES.title,
  description: COOKIES.description,
  alternates: { canonical: COOKIES.path },
  openGraph: { title: `${COOKIES.title} · Fiaro`, description: COOKIES.description, url: COOKIES.path },
};

/** Documento legal público: indexable y enlazado desde el registro y el pie de página. */
export default function Page() {
  return (
    <LegalTemplate>
      <LegalDocumentView document={COOKIES} />
    </LegalTemplate>
  );
}
