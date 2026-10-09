'use client';

import { useEffect, useId, useRef, useState, type KeyboardEvent } from 'react';
import { toBusinessDate } from '@fiaro-app/contracts';
import { COMMON_TEXT } from '@/content/common';
import { addDays, addMonths, dayLabel, formatDisplayDate, monthGrid, monthLabel, parseIsoDate, startOfMonth, WEEKDAY_LETTERS } from '@/lib/calendar';
import { cn } from '@/lib/cn';
import { fieldClasses } from '@/lib/field-styles';
import { useDismiss } from '@/lib/use-dismiss';

export interface DatePickerProps {
  /** Nombre del campo en el formulario (`?desde=`): guarda la fecha ISO `AAAA-MM-DD`. */
  readonly name?: string;
  /** Fecha elegida (modo controlado); `''` si no hay. */
  readonly value?: string;
  /** Fecha inicial (modo no controlado). */
  readonly defaultValue?: string;
  readonly onValueChange?: (value: string) => void;
  readonly id?: string;
  readonly invalid?: boolean;
  readonly disabled?: boolean;
  readonly 'aria-describedby'?: string;
  readonly className?: string;
}

/**
 * Selector de fecha de Fiaro (no el del navegador): un campo con la fecha como `dd/mm/aaaa` y un
 * calendario propio con el mes, los días en semanas de lunes a domingo, «Borrar» y «Hoy». El valor
 * viaja en un campo oculto con la fecha ISO. Teclado: flechas entre días, RePág/AvPág entre meses y Esc.
 */
export function DatePicker({ name, value, defaultValue = '', onValueChange, id, invalid = false, disabled, 'aria-describedby': describedBy, className }: Readonly<DatePickerProps>) {
  const text = COMMON_TEXT.calendar;
  const dialogId = useId();
  const containerRef = useRef<HTMLSpanElement>(null);
  const hiddenRef = useRef<HTMLInputElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const [internal, setInternal] = useState(defaultValue);
  const [open, setOpen] = useState(false);
  const [focusedDay, setFocusedDay] = useState('');
  const [month, setMonth] = useState('');
  const dayRefs = useRef(new Map<string, HTMLButtonElement>());

  const selected = value ?? internal;
  const today = toBusinessDate(new Date());
  const close = () => setOpen(false);
  useDismiss(open, containerRef, close);

  const openCalendar = () => {
    const start = parseIsoDate(selected) ? selected : today;
    setMonth(startOfMonth(start));
    setFocusedDay(start);
    setOpen(true);
  };

  // Al abrir o al moverse con el teclado, el foco va al día activo.
  useEffect(() => {
    if (open) dayRefs.current.get(focusedDay)?.focus();
  }, [open, focusedDay, month]);

  /** Guarda la fecha y avisa con un evento `change` (lo oyen los formularios de filtros). */
  const commit = (next: string) => {
    setInternal(next);
    setOpen(false);
    triggerRef.current?.focus();
    const input = hiddenRef.current;
    if (input) {
      input.value = next;
      input.dispatchEvent(new Event('change', { bubbles: true }));
    }
    if (next !== selected) onValueChange?.(next);
  };

  const goTo = (day: string) => {
    setFocusedDay(day);
    setMonth(startOfMonth(day));
  };

  const onDayKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    const moves: Record<string, string> = {
      ArrowLeft: addDays(focusedDay, -1),
      ArrowRight: addDays(focusedDay, 1),
      ArrowUp: addDays(focusedDay, -7),
      ArrowDown: addDays(focusedDay, 7),
      PageUp: addMonths(focusedDay, -1),
      PageDown: addMonths(focusedDay, 1),
    };
    if (event.key === 'Escape') {
      event.preventDefault();
      close();
      triggerRef.current?.focus();
    } else if (moves[event.key]) {
      event.preventDefault();
      goTo(moves[event.key]!);
    }
  };

  const display = formatDisplayDate(selected);

  return (
    <span ref={containerRef} className={cn('relative inline-flex w-full', className)}>
      <input ref={hiddenRef} type="hidden" name={name} value={selected} readOnly />
      <button
        ref={triggerRef}
        id={id}
        type="button"
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls={open ? dialogId : undefined}
        aria-describedby={describedBy}
        disabled={disabled}
        onClick={() => (open ? close() : openCalendar())}
        className={cn(fieldClasses(invalid), 'flex cursor-pointer items-center justify-between gap-2 pr-3 text-left text-label', open && 'border-primary ring-1 ring-primary')}
      >
        <span className={cn('truncate', display === '' && 'text-foreground/70')}>{display === '' ? text.placeholder : display}</span>
        <svg aria-hidden="true" viewBox="0 0 20 20" className="size-5 shrink-0 text-foreground" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
          <rect x="2" y="4" width="16" height="14" rx="3" />
          <path d="M2 8.5h16M6.5 2v3.5M13.5 2v3.5" />
        </svg>
      </button>
      {open && (
        <div
          id={dialogId}
          role="dialog"
          aria-label={text.choose}
          className="absolute top-full left-0 z-30 mt-1.5 w-[19.5rem] max-w-[calc(100vw-2rem)] rounded-lg border border-foreground/12 bg-surface p-4 shadow-[0_12px_32px_-4px_rgb(28_27_46/0.2)]"
        >
          <div className="mb-3 flex items-center justify-between">
            <span aria-live="polite" className="font-semibold text-foreground">
              {monthLabel(month)}
            </span>
            <span className="flex gap-1.5">
              <button type="button" aria-label={text.previousMonth} onClick={() => setMonth(addMonths(month, -1))} className={navButton}>
                <Chevron direction="left" />
              </button>
              <button type="button" aria-label={text.nextMonth} onClick={() => setMonth(addMonths(month, 1))} className={navButton}>
                <Chevron direction="right" />
              </button>
            </span>
          </div>
          <div role="grid" aria-label={monthLabel(month)} className="flex flex-col gap-y-1 text-center">
            <div role="row" className="grid grid-cols-7">
              {WEEKDAY_LETTERS.map((letter) => (
                <span key={letter} role="columnheader" className="pb-1 text-caption font-semibold text-foreground/60">
                  {letter}
                </span>
              ))}
            </div>
            {weeksOf(monthGrid(month)).map((week) => (
              <div key={week[0]} role="row" className="grid grid-cols-7">
                {week.map((day) => {
                  const inMonth = day.slice(0, 7) === month.slice(0, 7);
                  const isSelected = day === selected;
                  return (
                    <button
                      key={day}
                      ref={(node) => {
                        if (node) dayRefs.current.set(day, node);
                        else dayRefs.current.delete(day);
                      }}
                      type="button"
                      role="gridcell"
                      aria-label={dayLabel(day)}
                      aria-selected={isSelected}
                      aria-current={day === today ? 'date' : undefined}
                      tabIndex={day === focusedDay ? 0 : -1}
                      onClick={() => commit(day)}
                      onKeyDown={onDayKeyDown}
                      className={cn(
                        'mx-auto grid size-9 place-items-center rounded-full text-label transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none',
                        inMonth ? 'text-foreground' : 'text-foreground/35',
                        day === today && !isSelected && 'ring-1 ring-primary',
                        isSelected ? 'bg-primary font-semibold text-primary-foreground' : 'hover:bg-foreground/8',
                      )}
                    >
                      {Number(day.slice(8, 10))}
                    </button>
                  );
                })}
              </div>
            ))}
          </div>
          <div className="mt-3 flex justify-between border-t border-foreground/10 pt-3 text-label font-semibold">
            <button type="button" onClick={() => commit('')} className={footerButton}>
              {text.clear}
            </button>
            <button type="button" onClick={() => commit(today)} className={footerButton}>
              {text.today}
            </button>
          </div>
        </div>
      )}
    </span>
  );
}

/** Parte los 42 días del mes en sus 6 semanas (filas del calendario). */
function weeksOf(days: readonly string[]): readonly (readonly string[])[] {
  return Array.from({ length: days.length / 7 }, (_, week) => days.slice(week * 7, week * 7 + 7));
}

const navButton =
  'grid size-8 place-items-center rounded-sm border border-foreground/15 text-foreground hover:bg-foreground/5 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none';
const footerButton = 'rounded-sm px-1 text-primary hover:underline focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none';

function Chevron({ direction }: Readonly<{ direction: 'left' | 'right' }>) {
  return (
    <svg aria-hidden="true" viewBox="0 0 16 16" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d={direction === 'left' ? 'M10 3.5L5.5 8l4.5 4.5' : 'M6 3.5L10.5 8 6 12.5'} />
    </svg>
  );
}
