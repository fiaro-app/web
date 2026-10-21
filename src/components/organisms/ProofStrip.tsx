export interface ProofStripProps {
  readonly items: readonly { readonly value: string; readonly label: string }[];
}

/** Tira de tres cifras bajo la portada: lo que cambia en la práctica. Solo presentación. */
export function ProofStrip({ items }: Readonly<ProofStripProps>) {
  return (
    <ul className="mx-auto grid w-full max-w-7xl divide-y divide-foreground/8 px-6 sm:grid-cols-3 sm:divide-x sm:divide-y-0 lg:px-16">
      {items.map((item) => (
        <li key={item.value} className="flex flex-col gap-1 px-0 py-8 sm:px-8 sm:first:pl-0">
          <span className="font-display text-[clamp(1.75rem,3vw,2.5rem)] leading-none font-semibold tracking-[-0.02em]">{item.value}</span>
          <span className="text-small text-foreground/65">{item.label}</span>
        </li>
      ))}
    </ul>
  );
}
