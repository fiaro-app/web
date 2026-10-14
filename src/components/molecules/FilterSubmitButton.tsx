'use client';

import { Button, type ButtonProps } from '@/components/atoms/Button';
import { useFilterFormState } from '@/components/molecules/FilterForm';

/**
 * Botón de enviar de un filtro. Sólido y con el color de marca cuando hay cambios por aplicar; apagado y sin poder
 * pulsarse cuando no hay nada nuevo (antes de hidratar siempre está activo para que funcione sin JavaScript).
 */
export function FilterSubmitButton({ children, ...props }: Readonly<Omit<ButtonProps, 'type' | 'disabled'>>) {
  const { ready, dirty } = useFilterFormState();
  return (
    <Button type="submit" disabled={ready && !dirty} {...props}>
      {children}
    </Button>
  );
}
