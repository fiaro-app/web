'use client';

import { useRouter } from 'next/navigation';
import { useState, type ChangeEvent, type FormEvent } from 'react';
import type { Weekday } from '@fiaro-app/contracts';
import { describeSettingsError } from '@/features/lender/error-messages';
import { createPortfolio, updateBrandColor, updateBusinessName, updateCollectionDays } from '@/features/lender/lender-api';
import {
  BrandColorFormSchema,
  BusinessFormSchema,
  PortfolioFormSchema,
  sameWeekdays,
  toggleWeekday,
} from '@/features/lender/settings-schemas';

/** Estado común de un formulario de configuración que guarda y refresca la página. */
function useSaveState() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  /** Ejecuta el guardado; devuelve `true` si salió bien (y refresca la página con los datos nuevos). */
  const save = async (operation: () => Promise<unknown>, success: string): Promise<boolean> => {
    setIsSubmitting(true);
    setError(null);
    setNotice(null);
    try {
      await operation();
    } catch (failure) {
      setError(describeSettingsError(failure).message);
      setIsSubmitting(false);
      return false;
    }
    setNotice(success);
    setIsSubmitting(false);
    router.refresh();
    return true;
  };

  return { isSubmitting, error, notice, setError, setNotice, save };
}

/** Lógica de "Datos del negocio" (el nombre), sin diseño. */
export function useBusinessForm(current: { readonly name: string }) {
  const [name, setName] = useState(current.name);
  const [fieldError, setFieldError] = useState<string | undefined>();
  const { isSubmitting, error, notice, setNotice, save } = useSaveState();

  const changeName = (event: ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
    setFieldError(undefined);
    setNotice(null);
  };

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSubmitting) return;
    const parsed = BusinessFormSchema.safeParse({ name });
    if (!parsed.success) {
      setFieldError(parsed.error.issues[0]?.message);
      return;
    }
    if (parsed.data.name === current.name) {
      setNotice('No hay cambios para guardar.');
      return;
    }
    await save(() => updateBusinessName(parsed.data.name), 'Nombre actualizado.');
  };

  return { name, fieldError, isSubmitting, error, notice, changeName, submit };
}

/** Lógica de "Días sin cobro" (días de la semana y festivos), sin diseño. */
export function useCollectionDaysForm(current: {
  readonly nonWorkingWeekdays: readonly Weekday[];
  readonly skipNationalHolidays: boolean;
}) {
  const [weekdays, setWeekdays] = useState<readonly Weekday[]>(current.nonWorkingWeekdays);
  const [skipHolidays, setSkipHolidays] = useState(current.skipNationalHolidays);
  const { isSubmitting, error, notice, setNotice, save } = useSaveState();

  const toggleDay = (day: Weekday) => (event: ChangeEvent<HTMLInputElement>) => {
    setWeekdays((days) => toggleWeekday(days, day, event.target.checked));
    setNotice(null);
  };
  const toggleHolidays = (event: ChangeEvent<HTMLInputElement>) => {
    setSkipHolidays(event.target.checked);
    setNotice(null);
  };

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSubmitting) return;
    if (sameWeekdays(weekdays, current.nonWorkingWeekdays) && skipHolidays === current.skipNationalHolidays) {
      setNotice('No hay cambios para guardar.');
      return;
    }
    await save(() => updateCollectionDays(weekdays, skipHolidays), 'Días sin cobro actualizados.');
  };

  return { weekdays, skipHolidays, isSubmitting, error, notice, toggleDay, toggleHolidays, submit };
}

/** Lógica de "Nueva cartera", sin diseño. Al crearla vacía el campo. */
export function usePortfolioForm() {
  const [name, setName] = useState('');
  const [fieldError, setFieldError] = useState<string | undefined>();
  const { isSubmitting, error, notice, setNotice, save } = useSaveState();

  const changeName = (event: ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
    setFieldError(undefined);
    setNotice(null);
  };

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSubmitting) return;
    const parsed = PortfolioFormSchema.safeParse({ name });
    if (!parsed.success) {
      setFieldError(parsed.error.issues[0]?.message);
      return;
    }
    if (await save(() => createPortfolio(parsed.data.name), 'Cartera creada.')) setName('');
  };

  return { name, fieldError, isSubmitting, error, notice, changeName, submit };
}

/** Color de Fiaro con el que arranca todo negocio nuevo (igual al de `globals.css`). */
export const DEFAULT_BRAND_COLOR = '#3b3382';

/** Lógica de "Color de marca", sin diseño. `brandColor` es el guardado (`null`: el de Fiaro). */
export function useBrandColorForm(current: { readonly brandColor: string | null }) {
  const [color, setColor] = useState(current.brandColor ?? DEFAULT_BRAND_COLOR);
  const [fieldError, setFieldError] = useState<string | undefined>();
  const { isSubmitting, error, notice, setNotice, save } = useSaveState();

  const changeColor = (event: ChangeEvent<HTMLInputElement>) => {
    setColor(event.target.value);
    setFieldError(undefined);
    setNotice(null);
  };

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSubmitting) return;
    const parsed = BrandColorFormSchema.safeParse({ color });
    if (!parsed.success) {
      setFieldError(parsed.error.issues[0]?.message);
      return;
    }
    const next = parsed.data.color.toUpperCase();
    if (next === (current.brandColor ?? DEFAULT_BRAND_COLOR).toUpperCase()) {
      setNotice('No hay cambios para guardar.');
      return;
    }
    await save(() => updateBrandColor(next), 'Color actualizado.');
  };

  /** Vuelve al color de Fiaro (guarda `null`). */
  const reset = async () => {
    if (isSubmitting) return;
    if (await save(() => updateBrandColor(null), 'Volvimos al color de Fiaro.')) setColor(DEFAULT_BRAND_COLOR);
  };

  return { color, fieldError, isSubmitting, error, notice, isCustom: current.brandColor !== null, changeColor, submit, reset };
}
