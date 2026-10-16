'use client';

import { useEffect, useState } from 'react';
import { ButtonLink } from '@/components/atoms/ButtonLink';
import { StatePill, type StatePillTone } from '@/components/atoms/StatePill';
import { Text } from '@/components/atoms/Text';
import { cn } from '@/lib/cn';

interface MockRow {
  readonly name: string;
  readonly detail: string;
  readonly tag: string;
  readonly tone: StatePillTone;
}

export interface DayFlowContent {
  readonly title: string;
  readonly subtitle: string;
  readonly modes: { readonly notebook: string; readonly fiaro: string };
  readonly notebook: {
    readonly heading: string;
    readonly lines: readonly { readonly text: string; readonly note: string }[];
    readonly problems: readonly string[];
  };
  readonly stepsLabel: string;
  readonly steps: readonly {
    readonly tab: string;
    readonly title: string;
    readonly description: string;
    readonly mock: { readonly heading: string; readonly rows: readonly MockRow[]; readonly footer: { readonly label: string; readonly value: string } };
  }[];
  readonly cta: { readonly label: string; readonly href: string };
}

export interface DayFlowSectionProps {
  readonly id: string;
  readonly content: DayFlowContent;
}

/** Cada cuántos milisegundos avanza sola la demostración (se detiene si la persona interactúa o prefiere menos movimiento). */
const AUTO_ADVANCE_MS = 5000;

/**
 * «Un día con Fiaro»: alterna entre el cuaderno (lo que no sabes) y el recorrido ruta → cobro → cuadre → decisión (lo que sí
 * sabes). Los pasos avanzan solos y se detienen apenas la persona toca algo. Los datos son de ejemplo.
 */
export function DayFlowSection({ id, content }: Readonly<DayFlowSectionProps>) {
  const [mode, setMode] = useState<'notebook' | 'fiaro'>('notebook');
  const [step, setStep] = useState(0);
  const [auto, setAuto] = useState(true);
  const headingId = `${id}-title`;
  const current = content.steps[step] ?? content.steps[0];

  useEffect(() => {
    if (mode !== 'fiaro' || !auto || globalThis.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const timer = setInterval(() => setStep((value) => (value + 1) % content.steps.length), AUTO_ADVANCE_MS);
    return () => clearInterval(timer);
  }, [mode, auto, content.steps.length]);

  const pickStep = (index: number) => {
    setAuto(false);
    setStep(index);
  };

  return (
    <section id={id} aria-labelledby={headingId} className="flex flex-col items-center gap-10 bg-surface px-6 py-16 lg:px-16 lg:py-24">
      <div className="flex max-w-175 flex-col items-center gap-3 text-center">
        <Text id={headingId} variant="section">
          {content.title}
        </Text>
        <Text variant="body" className="text-foreground/75">
          {content.subtitle}
        </Text>
      </div>

      <fieldset className="inline-flex rounded-full border-0 bg-surface-2 p-1">
        <legend className="sr-only">{content.title}</legend>
        {(['notebook', 'fiaro'] as const).map((key) => (
          <button
            key={key}
            type="button"
            aria-pressed={mode === key}
            onClick={() => setMode(key)}
            className={cn(
              'h-11 rounded-full px-5 text-label font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
              mode === key ? 'bg-primary text-primary-foreground' : 'text-foreground/75 hover:text-foreground',
            )}
          >
            {content.modes[key]}
          </button>
        ))}
      </fieldset>

      {mode === 'notebook' ? (
        <div className="grid w-full max-w-5xl items-center gap-8 lg:grid-cols-2">
          <div className="rotate-[-1deg] rounded-md border border-foreground/10 bg-warning-soft/30 p-6 font-mono shadow-sm">
            <p className="mb-4 text-label font-semibold">{content.notebook.heading}</p>
            <ul className="flex flex-col gap-4">
              {content.notebook.lines.map((line) => (
                <li key={line.text} className="border-b border-dashed border-foreground/25 pb-2 text-label">
                  {line.text}
                  <span className="block text-caption text-destructive">{line.note}</span>
                </li>
              ))}
            </ul>
          </div>
          <ul className="flex flex-col gap-4">
            {content.notebook.problems.map((problem) => (
              <li key={problem} className="flex items-start gap-3 text-body text-foreground/85">
                <span aria-hidden="true" className="mt-1 flex size-6 shrink-0 items-center justify-center rounded-full bg-destructive/10 text-caption font-bold text-destructive">
                  ?
                </span>
                {problem}
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div className="grid w-full max-w-5xl items-start gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
          <div className="flex flex-col gap-4">
            <div role="tablist" aria-label={content.stepsLabel} className="flex flex-wrap gap-2">
              {content.steps.map((item, index) => (
                <button
                  key={item.tab}
                  type="button"
                  role="tab"
                  id={`${id}-tab-${String(index)}`}
                  aria-selected={index === step}
                  aria-controls={`${id}-panel`}
                  onClick={() => pickStep(index)}
                  className={cn(
                    'h-11 rounded-md px-4 text-label font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
                    index === step ? 'bg-primary text-primary-foreground' : 'bg-surface-2 text-foreground/80 hover:bg-surface-3',
                  )}
                >
                  <span aria-hidden="true" className="mr-2 opacity-70">
                    {index + 1}
                  </span>
                  {item.tab}
                </button>
              ))}
            </div>
            <div id={`${id}-panel`} role="tabpanel" aria-labelledby={`${id}-tab-${String(step)}`} className="flex flex-col gap-3">
              <Text variant="h3" as="h3">
                {current.title}
              </Text>
              <Text variant="body" className="text-foreground/75">
                {current.description}
              </Text>
            </div>
            <ButtonLink href={content.cta.href} className="w-fit">
              {content.cta.label}
            </ButtonLink>
          </div>

          <div aria-live="polite" className="rounded-lg bg-background p-5 shadow-[0_20px_50px_-10px_rgb(28_27_46/0.2)]">
            <p className="mb-3 text-label font-semibold">{current.mock.heading}</p>
            <ul key={step} className="flex flex-col gap-2">
              {current.mock.rows.map((row, index) => (
                <li
                  key={row.name}
                  style={{ animationDelay: `${String(index * 90)}ms` }}
                  className="flex items-center justify-between gap-3 rounded-sm bg-surface p-3 motion-safe:animate-[fade-up_.35s_ease-out_both]"
                >
                  <span className="flex min-w-0 flex-col">
                    <span className="truncate text-label font-semibold">{row.name}</span>
                    <span className="truncate text-caption text-foreground/70">{row.detail}</span>
                  </span>
                  <StatePill tone={row.tone}>{row.tag}</StatePill>
                </li>
              ))}
            </ul>
            <p className="mt-3 flex items-center justify-between border-t border-foreground/10 pt-3 text-label">
              <span className="text-foreground/70">{current.mock.footer.label}</span>
              <span className="font-semibold">{current.mock.footer.value}</span>
            </p>
          </div>
        </div>
      )}
    </section>
  );
}
