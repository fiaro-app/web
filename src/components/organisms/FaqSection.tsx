import { Text } from '@/components/atoms/Text';

export interface FaqItem {
  readonly question: string;
  readonly answer: string;
}

export interface FaqSectionProps {
  readonly id: string;
  readonly eyebrow: string;
  readonly title: string;
  readonly items: readonly FaqItem[];
}

/**
 * Preguntas frecuentes con `<details>` nativo: se abren y cierran sin JavaScript, con teclado y
 * lectores de pantalla. El mismo contenido alimenta el marcado `FAQPage` (ver `faqJsonLd`), que
 * debe coincidir con lo que ve la persona.
 */
export function FaqSection({ id, eyebrow, title, items }: Readonly<FaqSectionProps>) {
  const headingId = `${id}-title`;

  return (
    <section id={id} aria-labelledby={headingId} className="flex flex-col items-center gap-3 bg-background px-6 py-16 lg:px-16 lg:py-24">
      <Text variant="caption" as="p" weight="semibold" className="tracking-wide text-primary uppercase">
        {eyebrow}
      </Text>
      <Text id={headingId} variant="section" className="max-w-150 text-center">
        {title}
      </Text>
      <div className="mt-6 flex w-full max-w-3xl flex-col gap-3">
        {items.map((item) => (
          <details key={item.question} className="group rounded-md bg-surface px-6 py-4 open:shadow-sm">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 rounded-sm text-label font-semibold focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none">
              {item.question}
              <span aria-hidden="true" className="text-primary transition-transform group-open:rotate-45">
                +
              </span>
            </summary>
            <p className="mt-3 text-label text-foreground/75">{item.answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
