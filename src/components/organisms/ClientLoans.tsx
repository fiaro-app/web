import { ButtonLink } from '@/components/atoms/ButtonLink';
import { Link } from '@/components/atoms/Link';
import { LOAN_STATUS_CLASSES } from '@/components/organisms/loan-status-classes';
import { CLIENTS_TEXT } from '@/content/clients';
import type { LoanRow } from '@/features/loans/loans-view-model';
import { cn } from '@/lib/cn';

export interface ClientLoansProps {
  readonly clientId: string;
  readonly loans: readonly LoanRow[];
}

/** Préstamos de un cliente en su ficha, con el atajo para registrarle uno nuevo. Solo presentación. */
export function ClientLoans({ clientId, loans }: Readonly<ClientLoansProps>) {
  const text = CLIENTS_TEXT.loans;

  return (
    <section aria-labelledby="client-loans-title" className="flex max-w-lg flex-col gap-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 id="client-loans-title" className="text-lg font-semibold text-foreground">
          {text.title}
        </h2>
        <ButtonLink href={`/prestamos/nuevo?cliente=${clientId}`} size="sm">
          {text.newLoan}
        </ButtonLink>
      </div>
      {loans.length === 0 ? (
        <p className="rounded-md bg-surface p-5 text-label text-foreground/70">{text.empty}</p>
      ) : (
        <ul aria-label={text.listLabel} className="flex flex-col divide-y divide-foreground/8 overflow-hidden rounded-md bg-surface">
          {loans.map((loan) => (
            <li key={loan.id} className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 text-label">
              <div className="flex flex-col">
                <span className="font-medium">{loan.principal}</span>
                <span className="text-foreground/70">{text.line(loan.installments, loan.balance)}</span>
              </div>
              <div className="flex items-center gap-4">
                <span className={cn('font-semibold', LOAN_STATUS_CLASSES[loan.statusTone])}>{loan.status}</span>
                <Link href={`/prestamos/${loan.id}`} aria-label={`${text.view} préstamo de ${loan.principal}`}>
                  {text.view}
                </Link>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
