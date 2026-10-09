import type { ReactNode } from 'react';
import { Text } from '@/components/atoms/Text';

export interface AuthBrandPanelProps {
  readonly eyebrow: string;
  readonly title: string;
  readonly description: string;
  /** La ilustración bajo el texto (p. ej. `AuthPreviewCard`). */
  readonly children?: ReactNode;
}

/** Mitad de marca de las pantallas de acceso: fondo anil con el mensaje y una ilustración. */
export function AuthBrandPanel({ eyebrow, title, description, children }: Readonly<AuthBrandPanelProps>) {
  return (
    <div className="flex h-full flex-col justify-center gap-5 bg-primary py-16 pr-12 pl-16 text-primary-foreground">
      <Text variant="caption" as="p" weight="semibold" className="tracking-wide text-primary-foreground/70 uppercase">
        {eyebrow}
      </Text>
      {/* Es decorativo: el título de la página (h1) es el del formulario. */}
      <Text variant="price" as="p" className="max-w-150">
        {title}
      </Text>
      <Text variant="label" className="max-w-150 text-primary-foreground/85">
        {description}
      </Text>
      {children}
    </div>
  );
}
