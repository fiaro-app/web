import type { InputHTMLAttributes, Ref } from 'react';
import { cn } from '@/lib/cn';
import { formatAmount, parseAmount } from '@/lib/amount';

/** `display`: cifra grande y centrada (cobros, montos protagonistas); `field`: campo de formulario, como un `Input`. */
export type AmountInputSize = 'display' | 'field';

const SIZE_CLASSES: Record<AmountInputSize, { readonly box: string; readonly text: string }> = {
  display: { box: 'h-16 justify-center rounded-md', text: 'font-mono text-h2 font-semibold' },
  field: { box: 'h-11 justify-start rounded-sm', text: 'font-sans text-body' },
};

export interface AmountInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'value' | 'defaultValue' | 'onChange' | 'type' | 'size'> {
  /** Monto entero actual; `null` es "vacío" y muestra el `0` de relleno. */
  readonly value: number | null;
  readonly onValueChange: (value: number | null) => void;
  readonly currencySymbol?: string;
  /** Tamaño; por defecto la cifra grande del diseño. */
  readonly size?: AmountInputSize;
  readonly invalid?: boolean;
  readonly ref?: Ref<HTMLInputElement>;
}

/**
 * Campo de un monto de dinero (`Input de monto`): cifra grande y centrada, con separador de
 * miles mientras se escribe. Solo admite enteros (pesos, sin centavos) y entrega el valor ya
 * convertido a número por `onValueChange`. Estados: reposo, foco, error y deshabilitado.
 * `className` va en el contenedor; el resto de props (`id`, `aria-describedby`…) al `<input>`.
 */
export function AmountInput({
  ref,
  value,
  onValueChange,
  currencySymbol = '$',
  size = 'display',
  invalid = false,
  disabled,
  className,
  ...props
}: Readonly<AmountInputProps>) {
  const text = formatAmount(value);
  const sizeClasses = SIZE_CLASSES[size];

  return (
    <label
      className={cn(
        'flex w-full cursor-text items-center gap-1 border bg-surface px-4 transition-colors',
        sizeClasses.box,
        invalid
          ? 'border-destructive ring-1 ring-destructive'
          : 'border-skeleton focus-within:border-primary focus-within:ring-1 focus-within:ring-primary',
        disabled && 'cursor-not-allowed opacity-40',
        className,
      )}
    >
      <span aria-hidden="true" className={cn(sizeClasses.text, 'font-semibold text-foreground')}>
        {currencySymbol}
      </span>
      {/* Truco de grid: el texto invisible da el ancho al campo, que crece con el monto. */}
      <span className="inline-grid">
        <span
          aria-hidden="true"
          className={cn('invisible col-start-1 row-start-1 whitespace-pre', sizeClasses.text)}
        >
          {text || '0'}
        </span>
        <input
          ref={ref}
          type="text"
          inputMode="numeric"
          autoComplete="off"
          placeholder="0"
          value={text}
          disabled={disabled}
          aria-invalid={invalid}
          onChange={(event) => onValueChange(parseAmount(event.target.value))}
          className={cn(
            'col-start-1 row-start-1 w-full min-w-0 bg-transparent text-foreground outline-none placeholder:text-foreground/65 disabled:cursor-not-allowed',
            sizeClasses.text,
          )}
          {...props}
        />
      </span>
    </label>
  );
}
