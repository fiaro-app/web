import type { LoanStatusTone } from '@/features/loans/loans-view-model';

/** Color del texto del estado de un préstamo. El texto siempre acompaña al color. */
export const LOAN_STATUS_CLASSES: Record<LoanStatusTone, string> = {
  info: 'text-foreground',
  success: 'text-success',
  muted: 'text-foreground/65',
};
