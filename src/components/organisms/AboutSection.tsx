import { Text } from '@/components/atoms/Text';

/** `do` lo que hace, `dont` lo que no hace y `care` el cuidado de los datos: cambia la marca de cada punto. */
export type AboutTone = 'do' | 'dont' | 'care';

const MARKS: Record<AboutTone, { readonly glyph: string; readonly className: string }> = {
  do: { glyph: '✓', className: 'bg-success/15 text-success' },
  dont: { glyph: '✕', className: 'bg-foreground/10 text-foreground/70' },
  care: { glyph: '●', className: 'bg-primary/12 text-primary' },
};

export interface AboutColumn {
  readonly tone?: AboutTone;
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

/** Sección de confianza «Qué es Fiaro»: lo que hace, lo que no hace y cómo cuida los datos, en tres tarjetas con marca propia por columna. */
export function AboutSection({ id, eyebrow, title, subtitle, columns }: Readonly<AboutSectionProps>) {
  const headingId = `${id}-title`;

  return (
    <section id={id} aria-labelledby={headingId} className="flex flex-col items-center gap-8 border-b border-foreground/8 bg-surface px-6 py-12 lg:px-16 lg:py-16">
      <div className="flex max-w-175 flex-col items-center gap-3 text-center">
        <p className="font-mono text-caption font-medium tracking-[0.08em] text-primary uppercase">{eyebrow}</p>
        <Text id={headingId} variant="section" className="text-[clamp(1.75rem,3.4vw,2.5rem)] leading-[1.1] tracking-[-0.02em]">
          {title}
        </Text>
        <Text variant="lead" className="max-w-150 text-foreground/70">
          {subtitle}
        </Text>
      </div>
      <div className="mx-auto grid w-full max-w-288 reveal gap-4 lg:grid-cols-3">
        {columns.map((column) => {
          const mark = MARKS[column.tone ?? 'care'];
          return (
            <div key={column.title} className="flex flex-col gap-4 lift rounded-lg border border-foreground/10 bg-surface p-6 shadow-card">
              <Text variant="h3">{column.title}</Text>
              <ul className="flex flex-col gap-3 text-foreground/75">
                {column.items.map((item) => (
                  <li key={item} className="flex gap-3">
                    <span aria-hidden="true" className={`mt-0.5 grid size-5 shrink-0 place-items-center rounded-full text-[11px] font-semibold ${mark.className}`}>
                      {mark.glyph}
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </section>
  );
}
