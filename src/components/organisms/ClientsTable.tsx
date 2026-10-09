import { ButtonLink } from '@/components/atoms/ButtonLink';
import { CLIENTS_TEXT } from '@/content/clients';
import type { ClientRow } from '@/features/clients/clients-view-model';
import { cn } from '@/lib/cn';

export interface ClientsTableProps {
  readonly rows: readonly ClientRow[];
  readonly className?: string;
}

/** Tabla de clientes (nombre, cédula, teléfono y oficio). Solo presentación. */
export function ClientsTable({ rows, className }: Readonly<ClientsTableProps>) {
  return (
    <div className={cn('overflow-x-auto rounded-md bg-surface', className)}>
      <table className="w-full min-w-150 border-collapse text-left text-label">
        <caption className="sr-only">{CLIENTS_TEXT.tableCaption}</caption>
        <thead>
          <tr className="border-b border-foreground/8">
            {CLIENTS_TEXT.headers.map((header) => (
              <th key={header} scope="col" className="px-5 py-3.5 text-caption font-semibold text-foreground/60">
                {header}
              </th>
            ))}
            <th scope="col" className="px-5 py-3.5">
              <span className="sr-only">Acciones</span>
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-foreground/8">
          {rows.map((row) => (
            <tr key={row.id}>
              <th scope="row" className="px-5 py-5 font-normal">
                {row.fullName}
              </th>
              <td className="px-5 py-5">{row.nationalId}</td>
              <td className="px-5 py-5">{row.phone}</td>
              <td className="px-5 py-5">{row.occupation}</td>
              <td className="px-5 py-3.5 text-right">
                <ButtonLink variant="outline" href={`/clientes/${row.id}`} aria-label={`${CLIENTS_TEXT.edit} ${row.fullName}`}>
                  {CLIENTS_TEXT.edit}
                </ButtonLink>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
