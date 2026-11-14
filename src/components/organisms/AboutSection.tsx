import { Text } from '@/components/atoms/Text';

export interface AboutColumn {
  readonly title: string;
  readonly items: readonly string[];
}

export interface AboutSectionProps {
  readonly id: string;
  readonly eyebrow: string;
  readonly title: string;
  readonly subtitle: string;
  readonly columns: readonly AboutColumn[];
}

/** «Qué es Fiaro»: lo que hace, lo que no hace y cómo cuida los datos, en tres columnas sobrias. */
export function AboutSection({ id, eyebrow, title, subtitle, columns }: Readonly<AboutSectionProps>) {
  const headingId = `${id}-title`;

  return (
    <section id={id} aria-labelledby={headingId} className="flex flex-col items-center gap-12 border-b border-foreground/8 bg-surface px-6 py-16 lg:px-16 lg:py-24">
      <div className="flex max-w-175 flex-col items-center gap-3 text-center">
        <p className="font-mono text-caption font-medium tracking-[0.08em] text-primary uppercase">{eyebrow}</p>
        <Text id={headingId} variant="section" className="text-[clamp(1.75rem,3.4vw,2.5rem)] leading-[1.1] tracking-[-0.02em]">
          {title}
        </Text>
        <Text variant="lead" className="max-w-150 text-foreground/70">
          {subtitle}
        </Text>
      </div>
      <div className="mx-auto grid w-full max-w-7xl gap-px overflow-hidden rounded-md border border-foreground/10 bg-foreground/10 lg:grid-cols-3">
        {columns.map((column) => (
          <div key={column.title} className="flex flex-col gap-4 bg-surface p-8">
            <Text variant="h3">{column.title}</Text>
            <ul className="flex flex-col gap-3 text-foreground/75">
              {column.items.map((item) => (
                <li key={item} className="flex gap-3">
                  <span aria-hidden="true" className="mt-2 size-1.5 shrink-0 rounded-full bg-primary" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
