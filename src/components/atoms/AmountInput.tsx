import type { InputHTMLAttributes, Ref } from 'react';
import { cn } from '@/lib/cn';
import { formatAmount, parseAmount } from '@/lib/amount';

export interface AmountInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'value' | 'defaultValue' | 'onChange' | 'type'> {
  /** Monto entero actual; `null` es "vacío" y muestra el `0` de relleno. */
  readonly value: number | null;
  readonly onValueChange: (value: number | null) => void;
  readonly currencySymbol?: string;
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
  invalid = false,
  disabled,
  className,
  ...props
}: Readonly<AmountInputProps>) {
  const text = formatAmount(value);

  return (
    <label
      className={cn(
        'flex h-16 w-full cursor-text items-center justify-center gap-1 rounded-md border bg-surface px-4 transition-colors',
        invalid
          ? 'border-destructive ring-1 ring-destructive'
          : 'border-skeleton focus-within:border-primary focus-within:ring-1 focus-within:ring-primary',
        disabled && 'cursor-not-allowed opacity-40',
        className,
      )}
    >
      <span aria-hidden="true" className="text-h2 font-semibold text-foreground">
        {currencySymbol}
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
        // En fuente monoespaciada 1ch es el ancho exacto de un carácter: el campo crece con el monto.
        style={{ width: `${Math.max(text.length, 1)}ch` }}
        className="min-w-0 bg-transparent font-mono text-h2 font-semibold text-foreground outline-none placeholder:text-foreground disabled:cursor-not-allowed"
        {...props}
      />
    </label>
  );
}
