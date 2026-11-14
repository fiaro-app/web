import { Text } from '@/components/atoms/Text';
import { CONSOLIDATED_TEXT } from '@/content/consolidated';
import type { ConsolidatedRow, ConsolidatedView } from '@/features/consolidated/consolidated-view-model';
import { cn } from '@/lib/cn';

function Row({ row, strong = false }: Readonly<{ row: ConsolidatedRow; strong?: boolean }>) {
  const cell = cn('px-4 py-3 text-right', strong && 'font-semibold');
  return (
    <tr className={strong ? 'bg-foreground/4' : undefined}>
      <th scope="row" className={cn('px-4 py-3 text-left', strong ? 'font-semibold' : 'font-medium')}>
        {row.name}
      </th>
      <td className={cell}>{row.portfolio}</td>
      <td className={cell}>{row.atRisk}</td>
      <td className={cell}>{row.arrears}</td>
      <td className={cell}>{row.collected}</td>
      <td className={cell}>{row.effectiveness}</td>
    </tr>
  );
}

/** «Todos tus negocios» (plan Team): la cartera y el cobro de cada negocio y el total. Solo presentación. */
export function ConsolidatedSection({ view }: Readonly<{ view: ConsolidatedView }>) {
  const text = CONSOLIDATED_TEXT;
  return (
    <section aria-labelledby="consolidated-title" className="flex flex-col gap-3 rounded-md bg-surface p-5">
      <div className="flex flex-col gap-1">
        <Text as="h2" variant="h3" id="consolidated-title">
          {text.title}
        </Text>
        <Text variant="label" className="text-foreground/70">
          {text.description}
        </Text>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-body">
          <thead>
            <tr className="text-foreground/70">
              <th scope="col" className="px-4 py-3 text-left font-medium">
                {text.columns.business}
              </th>
              {(['portfolio', 'atRisk', 'arrears', 'collected', 'effectiveness'] as const).map((key) => (
                <th key={key} scope="col" className="px-4 py-3 text-right font-medium">
                  {text.columns[key]}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-foreground/8">
            {view.rows.map((row) => (
              <Row key={row.id} row={row} />
            ))}
            <Row row={view.total} strong />
          </tbody>
        </table>
      </div>
    </section>
  );
}
