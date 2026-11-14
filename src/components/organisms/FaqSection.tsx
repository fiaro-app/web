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
    <section id={id} aria-labelledby={headingId} className="px-6 py-12 lg:px-16 lg:py-16">
     <div className="mx-auto grid w-full max-w-288 gap-8 lg:grid-cols-[2fr_3fr] lg:gap-14">
      <div className="flex flex-col gap-3">
      <Text variant="caption" as="p" weight="semibold" className="font-mono tracking-[0.06em] text-primary uppercase">
        {eyebrow}
      </Text>
      <Text id={headingId} variant="section" className="max-w-md text-[clamp(1.75rem,3.4vw,2.5rem)] leading-[1.1] tracking-[-0.02em]">
        {title}
      </Text>
      </div>
      <div className="reveal flex w-full flex-col gap-3">
        {items.map((item) => (
          <details key={item.question} className="group rounded-md border border-foreground/10 bg-surface px-6 py-3 shadow-card transition-shadow hover:shadow-lift open:border-primary/40">
            <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-4 rounded-sm text-label font-semibold focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none">
              {item.question}
              <span aria-hidden="true" className="text-primary transition-transform group-open:rotate-45">
                +
              </span>
            </summary>
            <p className="mt-3 text-label text-foreground/75">{item.answer}</p>
          </details>
        ))}
      </div>
     </div>
    </section>
  );
}
