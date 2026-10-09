import type { InputHTMLAttributes, Ref } from 'react';
import { cn } from '@/lib/cn';

export interface SearchInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  readonly ref?: Ref<HTMLInputElement>;
}

/**
 * Campo de búsqueda con lupa. Mismo aspecto y estados de foco que `Input`; `className` va en el
 * contenedor. Sin `aria-label` ni `Label`, usa su placeholder como nombre accesible.
 */
export function SearchInput({
  ref,
  className,
  placeholder = 'Buscar…',
  'aria-label': ariaLabel,
  ...props
}: Readonly<SearchInputProps>) {
  return (
    <label
      className={cn(
        'flex h-11 w-full cursor-text items-center gap-2 rounded-sm border border-foreground bg-surface px-4 transition-colors',
        'focus-within:border-primary focus-within:ring-1 focus-within:ring-primary',
        className,
      )}
    >
      <svg aria-hidden="true" viewBox="0 0 16 16" className="size-4 shrink-0 text-foreground/70">
        <circle cx="7" cy="7" r="4.5" fill="none" stroke="currentColor" strokeWidth="1.5" />
        <path d="M10.5 10.5L14 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
      <input
        ref={ref}
        type="search"
        placeholder={placeholder}
        aria-label={ariaLabel ?? placeholder}
        className="min-w-0 flex-1 bg-transparent text-body text-foreground outline-none placeholder:text-foreground/70"
        {...props}
      />
    </label>
  );
}
