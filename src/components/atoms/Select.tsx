'use client';

import { Children, isValidElement, useId, useRef, useState, type KeyboardEvent, type ReactElement, type ReactNode, type Ref, type SelectHTMLAttributes } from 'react';
import { cn } from '@/lib/cn';
import { fieldClasses } from '@/lib/field-styles';
import { useDismiss } from '@/lib/use-dismiss';

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  readonly invalid?: boolean;
  /** Apunta al `<select>` oculto que guarda el valor (el que leen los formularios). */
  readonly ref?: Ref<HTMLSelectElement>;
}

interface OptionItem {
  readonly value: string;
  readonly label: string;
  readonly disabled: boolean;
}

/** Opciones a partir de los `<option>` hijos (el mismo contrato que un `<select>` nativo). */
function readOptions(children: ReactNode): OptionItem[] {
  return Children.toArray(children).flatMap((child) => {
    if (!isValidElement(child) || child.type !== 'option') return [];
    const option = child as ReactElement<{ value?: string | number; disabled?: boolean; children?: ReactNode }>;
    const label = Children.toArray(option.props.children)
      .filter((part): part is string | number => typeof part === 'string' || typeof part === 'number')
      .join('');
    return [{ value: String(option.props.value ?? label), label, disabled: option.props.disabled === true }];
  });
}

/**
 * Menú desplegable de Fiaro (no el del navegador): un botón con el valor y una lista con las
 * opciones, marcada la elegida. Conserva el contrato de `<select>`: se usa con `<option>` hijos, `value`
 * o `defaultValue` y `onChange(event)`; por debajo hay un `<select>` oculto que guarda el valor para
 * los formularios. Teclado: flechas, Inicio/Fin, Enter o Espacio para elegir y Esc para cerrar.
 *
 * @example
 * <Select aria-label="Cobrador"><option value="">Todos los cobradores</option></Select>
 */
export function Select({
  ref,
  invalid = false,
  className,
  children,
  id,
  value,
  defaultValue,
  onChange,
  disabled,
  'aria-label': ariaLabel,
  'aria-describedby': ariaDescribedBy,
  ...props
}: Readonly<SelectProps>) {
  const options = readOptions(children);
  const listId = useId();
  const containerRef = useRef<HTMLSpanElement>(null);
  const nativeRef = useRef<HTMLSelectElement | null>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const [internal, setInternal] = useState(String(defaultValue ?? options[0]?.value ?? ''));
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);

  const current = value === undefined ? internal : String(value);
  const selectedIndex = Math.max(0, options.findIndex((option) => option.value === current));
  const close = () => setOpen(false);
  useDismiss(open, containerRef, close);

  const optionId = (index: number) => `${listId}-${String(index)}`;

  const openList = () => {
    setActive(selectedIndex);
    setOpen(true);
  };

  /** Elige una opción: cambia el `<select>` oculto y avisa con un evento `change` real (lo oyen React y los formularios). */
  const choose = (index: number) => {
    const option = options[index];
    const native = nativeRef.current;
    setOpen(false);
    triggerRef.current?.focus();
    if (!option || option.disabled || !native || option.value === current) return;
    const setter = Object.getOwnPropertyDescriptor(HTMLSelectElement.prototype, 'value')?.set;
    setter?.call(native, option.value);
    native.dispatchEvent(new Event('change', { bubbles: true }));
  };

  const move = (step: number, absolute = false) => {
    const last = options.length - 1;
    setActive((index) => Math.min(last, Math.max(0, absolute ? step : index + step)));
  };

  const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    const keys: Record<string, () => void> = {
      ArrowDown: () => (open ? move(1) : openList()),
      ArrowUp: () => (open ? move(-1) : openList()),
      Home: () => open && move(0, true),
      End: () => open && move(options.length - 1, true),
      Escape: () => open && close(),
      Enter: () => (open ? choose(active) : openList()),
      ' ': () => (open ? choose(active) : openList()),
    };
    const run = keys[event.key];
    if (!run) return;
    if (event.key === 'Escape' && !open) return;
    event.preventDefault();
    run();
  };

  return (
    <span ref={containerRef} className={cn('relative inline-flex w-full', className)}>
      <select
        {...props}
        ref={(node) => {
          nativeRef.current = node;
          if (typeof ref === 'function') ref(node);
          else if (ref) ref.current = node;
        }}
        value={current}
        disabled={disabled}
        aria-hidden="true"
        tabIndex={-1}
        className="sr-only"
        onChange={(event) => {
          setInternal(event.target.value);
          onChange?.(event);
        }}
      >
        {children}
      </select>
      <button
        ref={triggerRef}
        id={id}
        type="button"
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? listId : undefined}
        aria-activedescendant={open ? optionId(active) : undefined}
        aria-label={ariaLabel}
        aria-describedby={ariaDescribedBy}
        aria-invalid={invalid}
        disabled={disabled}
        onClick={() => (open ? close() : openList())}
        onKeyDown={onKeyDown}
        className={cn(fieldClasses(invalid), 'flex cursor-pointer items-center justify-between gap-2 pr-3 text-left text-label', open && 'border-primary ring-1 ring-primary')}
      >
        <span className="truncate">{options[selectedIndex]?.label ?? ''}</span>
        <svg
          aria-hidden="true"
          viewBox="0 0 16 16"
          className={cn('pointer-events-none size-4 shrink-0 text-foreground transition-transform', open && 'rotate-180')}
        >
          <path d="M3.5 6l4.5 4.5L12.5 6" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      {open && (
        <div
          id={listId}
          role="listbox"
          aria-label={ariaLabel}
          className="absolute top-full right-0 left-0 z-30 mt-1.5 flex max-h-64 flex-col gap-0.5 overflow-auto rounded-md border border-foreground/12 bg-surface p-1.5 shadow-[0_12px_32px_-4px_rgb(28_27_46/0.2)]"
        >
          {options.map((option, index) => {
            const selected = index === selectedIndex;
            return (
              <button
                key={option.value}
                id={optionId(index)}
                type="button"
                role="option"
                tabIndex={-1}
                aria-selected={selected}
                disabled={option.disabled}
                onPointerEnter={() => setActive(index)}
                onClick={() => choose(index)}
                className={cn(
                  'flex min-h-10 w-full cursor-pointer items-center justify-between gap-3 rounded-sm px-3 text-left text-label text-foreground disabled:cursor-not-allowed disabled:opacity-40',
                  index === active && 'bg-foreground/5',
                  selected && 'bg-primary/10 font-semibold text-primary',
                )}
              >
                <span className="truncate">{option.label}</span>
                {selected && (
                  <svg aria-hidden="true" viewBox="0 0 16 16" className="size-4 shrink-0">
                    <path d="M3 8.5l3.2 3.2L13 4.8" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </button>
            );
          })}
        </div>
      )}
    </span>
  );
}
