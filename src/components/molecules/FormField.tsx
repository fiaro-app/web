import { cloneElement, useId, type ReactElement } from 'react';
import { Label } from '@/components/atoms/Label';

/** Props a `FormField` injects into its child control — any control used inside one must accept these. */
export interface FormFieldControlProps {
  readonly id?: string;
  readonly invalid?: boolean;
  readonly 'aria-describedby'?: string;
}

export interface FormFieldProps {
  readonly label: string;
  /** Shown instead of `hint`, in the destructive color, and flips the child control into its invalid state. */
  readonly error?: string;
  /** Helper text shown when there's no `error`. */
  readonly hint?: string;
  readonly required?: boolean;
  readonly children: ReactElement<FormFieldControlProps>;
}

/**
 * Pairs a `Label` with one form control (`Input` or similar) and an error/hint message, wiring
 * `id`/`aria-describedby`/`invalid` onto the control so every field gets consistent accessibility
 * without each screen repeating it by hand.
 *
 * @example
 * <FormField label="Correo" error={errors.email}>
 *   <Input type="email" />
 * </FormField>
 */
export function FormField({ label, error, hint, required, children }: Readonly<FormFieldProps>) {
  const id = useId();
  let describedBy: string | undefined;
  if (error) {
    describedBy = `${id}-error`;
  } else if (hint) {
    describedBy = `${id}-hint`;
  }

  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor={id} required={required}>
        {label}
      </Label>
      {cloneElement(children, { id, invalid: Boolean(error), 'aria-describedby': describedBy })}
      {error && (
        <p id={`${id}-error`} role="alert" className="text-sm text-destructive">
          {error}
        </p>
      )}
      {!error && hint && (
        <p id={`${id}-hint`} className="text-sm text-muted-foreground">
          {hint}
        </p>
      )}
    </div>
  );
}
