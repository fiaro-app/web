import { Text } from '@/components/atoms/Text';
import { LEGAL_NOTICE, type LegalDocument } from '@/content/legal';

export interface LegalDocumentViewProps {
  readonly document: LegalDocument;
}

/** Un documento legal: título, introducción y sus secciones numeradas. Solo presentación. */
export function LegalDocumentView({ document }: Readonly<LegalDocumentViewProps>) {
  return (
    <article className="mx-auto flex w-full max-w-3xl flex-col gap-8 px-6 py-12 lg:py-16">
      <header className="flex flex-col gap-3">
        <Text variant="section" as="h1">
          {document.title}
        </Text>
        <Text variant="caption" className="text-foreground/65">
          {LEGAL_NOTICE}
        </Text>
        <Text variant="body" className="text-foreground/80">
          {document.intro}
        </Text>
      </header>
      {document.sections.map((section) => (
        <section key={section.heading} className="flex flex-col gap-3">
          <Text variant="h3" as="h2">
            {section.heading}
          </Text>
          {section.paragraphs?.map((paragraph) => (
            <Text key={paragraph} variant="body" className="text-foreground/80">
              {paragraph}
            </Text>
          ))}
          {section.items && (
            <ul className="flex list-disc flex-col gap-2 pl-5 text-body text-foreground/80">
              {section.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          )}
        </section>
      ))}
    </article>
  );
}
