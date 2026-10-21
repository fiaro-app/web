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
    <section id={id} aria-labelledby={headingId} className="mx-3 flex flex-col items-center gap-10 rounded-[32px] bg-[#14112b] px-6 py-16 text-white lg:mx-6 lg:px-16 lg:py-24">
      <div className="flex max-w-175 flex-col items-center gap-3 text-center">
        <Text id={headingId} variant="section" className="text-[clamp(2rem,4.5vw,3.5rem)] leading-[1.05] tracking-[-0.03em] text-white">
          {content.title}
        </Text>
        <Text variant="body" className="text-white/80">
          {content.subtitle}
        </Text>
      </div>

      <fieldset className="inline-flex rounded-full border-0 bg-white/10 p-1">
        <legend className="sr-only">{content.title}</legend>
        {(['notebook', 'fiaro'] as const).map((key) => (
          <button
            key={key}
            type="button"
            aria-pressed={mode === key}
            onClick={() => setMode(key)}
            className={cn(
              'h-11 rounded-full px-5 text-label font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-dashed focus-visible:outline-offset-2 focus-visible:outline-white',
              mode === key ? 'bg-white text-[#14112b]' : 'text-white/80 hover:text-white',
            )}
          >
            {content.modes[key]}
          </button>
        ))}
      </fieldset>

      {mode === 'notebook' ? (
        <div className="grid w-full max-w-5xl items-center gap-8 lg:grid-cols-2">
          <div className="rotate-[-1deg] rounded-md border border-foreground/10 bg-warning-soft p-6 font-mono text-foreground shadow-sm">
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
              <li key={problem} className="flex items-start gap-3 text-body text-white/90">
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
                    'h-11 rounded-md px-4 text-label font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-dashed focus-visible:outline-offset-2 focus-visible:outline-white',
                    index === step ? 'bg-white text-[#14112b]' : 'bg-white/10 text-white/85 hover:bg-white/20',
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
              <Text variant="h3" as="h3" className="text-[26px] tracking-[-0.02em] text-white">
                {current.title}
              </Text>
              <Text variant="body" className="text-white/80">
                {current.description}
              </Text>
            </div>
            <ButtonLink href={content.cta.href} variant="inverse" className="w-fit rounded-full px-8">
              {content.cta.label}
            </ButtonLink>
          </div>

          <div aria-live="polite" className="rounded-[24px] bg-background p-5 text-foreground shadow-[0_30px_80px_-20px_rgb(0_0_0/0.6)]">
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
