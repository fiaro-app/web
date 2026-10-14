export interface FormAsideProps {
  /** Título del panel (p. ej. «¿Qué pasa después?»). */
  readonly title: string;
  /** Pasos o puntos informativos, en orden. */
  readonly steps: readonly string[];
  /** Consejo corto que se muestra en el recuadro inferior. */
  readonly tip: { readonly title: string; readonly body: string };
}

/**
 * Panel informativo que acompaña a un formulario en escritorio. Se oculta bajo `lg`
 * (en móvil y tableta el formulario ocupa todo el ancho), como en los mockups.
 */
export function FormAside({ title, steps, tip }: Readonly<FormAsideProps>) {
  return (
    <aside aria-label={title} className="hidden flex-col gap-6 rounded-lg bg-surface p-8 lg:flex">
      <h2 className="text-lg font-semibold text-foreground">{title}</h2>
      <ol className="flex flex-col gap-5">
        {steps.map((step, index) => (
          <li key={step} className="flex items-start gap-4">
            <span
              aria-hidden="true"
              className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary text-label font-semibold text-primary-foreground"
            >
              {index + 1}
            </span>
            <p className="pt-1 text-label text-foreground/80">{step}</p>
          </li>
        ))}
      </ol>
      <div className="rounded-md bg-background p-5">
        <p className="text-label font-semibold text-foreground">{tip.title}</p>
        <p className="mt-1 text-small text-foreground/70">{tip.body}</p>
      </div>
    </aside>
  );
}
