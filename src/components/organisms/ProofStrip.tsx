export interface ProofStripProps {
  readonly items: readonly { readonly value: string; readonly label: string }[];
}

/** Tira de tres cifras grandes bajo la portada: lo que cambia en la práctica. Solo presentación. */
export function ProofStrip({ items }: Readonly<ProofStripProps>) {
  return (
    <ul className="mx-auto grid w-full max-w-7xl gap-6 px-6 py-14 sm:grid-cols-3 lg:px-16">
      {items.map((item) => (
        <li key={item.value} className="flex flex-col gap-1 border-l-2 border-primary/25 pl-5">
          <span className="font-display text-[clamp(2.25rem,5vw,3.5rem)] leading-none font-bold tracking-[-0.03em] text-primary">{item.value}</span>
          <span className="font-mono text-caption tracking-[0.05em] text-foreground/70 uppercase">{item.label}</span>
        </li>
      ))}
    </ul>
  );
}
