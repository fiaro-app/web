import type { Metadata } from 'next';
import { LegalDocumentView } from '@/components/organisms/LegalDocumentView';
import { LegalTemplate } from '@/components/templates/LegalTemplate';
import type { LegalDocument } from '@/content/legal';

/** Metadatos de una página legal: título, descripción y canónica propios, indexable. */
export function legalMetadata(document: LegalDocument): Metadata {
  return {
    title: document.title,
    description: document.description,
    alternates: { canonical: document.path },
    openGraph: { title: `${document.title} · Fiaro`, description: document.description, url: document.path },
  };
}

/** Una página legal completa: la barra y el pie públicos con el documento en medio. */
export function LegalPage({ document }: Readonly<{ document: LegalDocument }>) {
  return (
    <LegalTemplate>
      <LegalDocumentView document={document} />
    </LegalTemplate>
  );
}
