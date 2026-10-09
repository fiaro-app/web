/**
 * Clases para que una tabla se vea como tabla desde `md` y como una lista de tarjetas en pantallas
 * angostas (`Mobile / …` en Penpot): cada fila es una tarjeta y cada celda lleva su encabezado
 * delante (`data-label`). Clases literales para que Tailwind las detecte.
 */
export const RESPONSIVE_TABLE = {
  wrapper: 'rounded-md md:overflow-x-auto md:bg-surface',
  table: 'w-full border-collapse text-left text-label max-md:block',
  head: 'max-md:sr-only',
  body: 'divide-y divide-foreground/8 max-md:flex max-md:flex-col max-md:gap-3 max-md:divide-y-0',
  row: 'max-md:flex max-md:flex-col max-md:gap-2 max-md:rounded-md max-md:bg-surface max-md:p-4',
  rowHeader: 'px-5 py-5 font-normal max-md:p-0 max-md:text-body max-md:font-semibold',
  cell: 'px-5 py-5 max-md:flex max-md:items-center max-md:justify-between max-md:gap-4 max-md:p-0 max-md:before:text-caption max-md:before:text-foreground/60 max-md:before:content-[attr(data-label)]',
  action: 'px-5 py-3.5 text-right max-md:p-0 max-md:pt-2 max-md:[&>a]:w-full',
} as const;
