import { SUBSCRIPTION_TEXT } from '@/content/subscription';

/**
 * Texto de un `PLAN_LIMIT_REACHED`. La API comparte ese código entre cuatro topes y los distingue
 * con `errorCode`: cobradores (`M003A`), administradores (`M007A`), préstamos activos (`L004A`) y
 * carteras (`B007A`). Un código que no conoce (un tope nuevo) cae al mensaje general.
 */
export function describePlanLimit(errorCode: string | null): string {
  const text = SUBSCRIPTION_TEXT.limitReached;
  switch (errorCode) {
    case 'M003A':
      return text.collectors;
    case 'M007A':
      return text.admins;
    case 'L004A':
      return text.loans;
    case 'B007A':
      return text.portfolios;
    default:
      return text.generic;
  }
}
