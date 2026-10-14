import { useId, type ReactNode } from 'react';
import { Text } from '@/components/atoms/Text';
import { cn } from '@/lib/cn';

export interface SettingsSectionProps {
  readonly title: string;
  readonly description: string;
  readonly children: ReactNode;
  readonly className?: string;
}

/** Bloque de la pantalla de configuración: título, explicación y su formulario, sobre una tarjeta. */
export function SettingsSection({ title, description, children, className }: Readonly<SettingsSectionProps>) {
  const titleId = useId();
  return (
    <section aria-labelledby={titleId} className={cn('flex max-w-lg flex-col gap-4 rounded-md bg-surface p-6', className)}>
      <div className="flex flex-col gap-1">
        <Text as="h2" variant="h3" id={titleId}>
          {title}
        </Text>
        <Text variant="label" className="text-foreground/70">
          {description}
        </Text>
      </div>
      {children}
    </section>
  );
}
