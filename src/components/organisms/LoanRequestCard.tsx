'use client';

import { useState } from 'react';
import { Button } from '@/components/atoms/Button';
import { ButtonLink } from '@/components/atoms/ButtonLink';
import { StatePill, type StatePillTone } from '@/components/atoms/StatePill';
import { Text } from '@/components/atoms/Text';
import { LoanRequestReviewForm } from '@/components/organisms/LoanRequestReviewForm';
import { LOAN_REQUESTS_TEXT } from '@/content/loan-requests';
import type { LoanRequestRow } from '@/features/loan-requests/loan-requests-view-model';
import type { FigureTone } from '@/lib/tone';

/** Tono de la píldora según el tono de la cifra del estado. */
const PILL_TONE: Record<FigureTone, StatePillTone> = { good: 'success', warning: 'warning', bad: 'error', neutral: 'muted' };

/** Una solicitud: quién la sugirió, para qué cliente y con qué condiciones; si está pendiente, se abre para resolverla. */
export function LoanRequestCard({ row }: Readonly<{ row: LoanRequestRow }>) {
  const [open, setOpen] = useState(false);
  const text = LOAN_REQUESTS_TEXT;

  return (
    <article aria-label={row.clientLabel} className="flex flex-col gap-3 rounded-md bg-surface p-5">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="flex flex-col gap-0.5">
          <Text variant="label" weight="bold" className="text-foreground">
            {row.clientLabel}
          </Text>
          <Text variant="caption" className="text-foreground/70">
            {row.isNewClient ? text.card.newClient : text.card.existingClient} · {text.card.requestedBy(row.collectorName)}
          </Text>
        </div>
        <StatePill tone={PILL_TONE[row.statusTone]}>{row.status}</StatePill>
      </div>

      <Text variant="label">{row.summary}</Text>
      <Text variant="caption" className="text-foreground/70">
        {text.card.startsOn(row.startsOn)}
      </Text>

      {row.rejectionReason && (
        <Text variant="caption" className="text-foreground/70">
          {text.card.rejectionReason}: {row.rejectionReason}
        </Text>
      )}
      {row.loanHref && (
        <ButtonLink variant="outline" href={row.loanHref} className="self-start">
          {text.card.viewLoan}
        </ButtonLink>
      )}

      {row.reviewable && (
        <>
          <Button variant="outline" aria-expanded={open} onClick={() => setOpen((current) => !current)} className="self-start">
            {open ? text.review.close : text.review.open}
          </Button>
          {open && <LoanRequestReviewForm request={row.request} />}
        </>
      )}
    </article>
  );
}
