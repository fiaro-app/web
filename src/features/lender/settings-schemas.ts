import { BusinessNameSchema, WeekdaySchema, type Weekday } from '@fiaro-app/contracts';
import { z } from 'zod';
import { contrastWithWhite, MIN_BRAND_CONTRAST } from '@/lib/color';

/** Formulario "Datos del negocio": solo el nombre (el logo se sube aparte). */
export const BusinessFormSchema = z.object({
  name: z.string().trim().min(2, 'Escribe el nombre de tu financiera.').max(120, 'El nombre es demasiado largo.').pipe(BusinessNameSchema),
});
export type BusinessField = 'name';

/** Formulario "Color de marca": un `#RRGGBB` con contraste suficiente para el texto blanco de los botones. */
export const BrandColorFormSchema = z.object({
  color: z
    .string()
    .regex(/^#[0-9a-fA-F]{6}$/, 'Elige un color válido.')
    .refine((hex) => contrastWithWhite(hex) >= MIN_BRAND_CONTRAST, 'Elige un color más oscuro para que el texto blanco se lea bien.'),
});

/** Formulario "Días sin cobro": qué días de la semana no se cobra y si los festivos cuentan. */
export const CollectionDaysFormSchema = z.object({
  nonWorkingWeekdays: z.array(WeekdaySchema),
  skipNationalHolidays: z.boolean(),
});
export type CollectionDaysValues = z.output<typeof CollectionDaysFormSchema>;

/** Formulario "Nueva cartera". */
export const PortfolioFormSchema = z.object({
  name: z.string().trim().min(1, 'Escribe el nombre de la cartera.').max(120, 'El nombre es demasiado largo.').pipe(BusinessNameSchema),
});
export type PortfolioField = 'name';

/** Días de la semana en el orden en que se muestran (lunes primero, como en Colombia). */
export const WEEKDAYS: readonly Weekday[] = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'];

/**
 * Agrega o quita un día de la lista de días sin cobro, sin repetidos y siempre en el orden de
 * `WEEKDAYS` (así la API recibe una lista estable y la comparación de cambios es exacta).
 */
export function toggleWeekday(current: readonly Weekday[], day: Weekday, checked: boolean): Weekday[] {
  const next = new Set(current);
  if (checked) next.add(day);
  else next.delete(day);
  return WEEKDAYS.filter((weekday) => next.has(weekday));
}

/** ¿Las dos listas de días son iguales sin importar el orden? */
export function sameWeekdays(a: readonly Weekday[], b: readonly Weekday[]): boolean {
  return a.length === b.length && a.every((day) => b.includes(day));
}
