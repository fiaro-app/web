import { PLAN_OFFERS, PLANS_TEXT } from '@/content/plans';

/** El nombre de un plan, o su código si el catálogo no lo conoce. */
export const planName = (code: string): string => PLAN_OFFERS.find((offer) => offer.code === code)?.name ?? code;

/** El medio de pago legible; el que no conocemos se muestra como llegó, y el pendiente como guion. */
export const methodName = (type: string | null): string =>
  type === null ? '—' : ((PLANS_TEXT.history.method as Readonly<Record<string, string>>)[type] ?? type);
