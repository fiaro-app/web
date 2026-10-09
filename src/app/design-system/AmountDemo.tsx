'use client';

import { useState } from 'react';
import { AmountInput } from '@/components/atoms/AmountInput';

/** Los `AmountInput` del catálogo son controlados, así que necesitan estado de cliente. */
export function AmountDemo({ invalid = false, disabled = false }: Readonly<{ invalid?: boolean; disabled?: boolean }>) {
  const [value, setValue] = useState<number | null>(null);
  return (
    <div className="w-45">
      <AmountInput
        aria-label="Monto"
        value={value}
        onValueChange={setValue}
        invalid={invalid}
        disabled={disabled}
      />
    </div>
  );
}
