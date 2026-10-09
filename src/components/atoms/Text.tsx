import type { HTMLAttributes } from 'react';
import { cn } from '@/lib/cn';

export type TextVariant =
  | 'hero'
  | 'section'
  | 'price'
  | 'display'
  | 'h2'
  | 'h3'
  | 'lead'
  | 'body'
  | 'small'
  | 'label'
  | 'caption'
  | 'mono';
export type TextWeight = 'regular' | 'medium' | 'semibold' | 'bold';
export type TextElement = 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'span' | 'div' | 'strong';

/** Familia + tamaño de cada escala tipográfica (`font.*` y `size.*` del diseño). */
const VARIANT_CLASSES: Record<TextVariant, string> = {
  hero: 'font-display text-hero',
  section: 'font-display text-section',
  price: 'font-display text-price',
  display: 'font-display text-display',
  h2: 'font-display text-h2',
  h3: 'font-display text-h3',
  lead: 'font-sans text-lead',
  body: 'font-sans text-body',
  small: 'font-sans text-small',
  label: 'font-sans text-label',
  caption: 'font-sans text-caption',
  mono: 'font-mono text-label',
};

const DEFAULT_ELEMENT: Record<TextVariant, TextElement> = {
  hero: 'h1',
  section: 'h2',
  price: 'span',
  display: 'h1',
  h2: 'h2',
  h3: 'h3',
  lead: 'p',
  body: 'p',
  small: 'p',
  label: 'span',
  caption: 'span',
  mono: 'span',
};

/** Los títulos de marketing van en bold, los demás títulos en semibold y el resto en regular. */
const DEFAULT_WEIGHT: Record<TextVariant, TextWeight> = {
  hero: 'bold',
  section: 'bold',
  price: 'bold',
  display: 'semibold',
  h2: 'semibold',
  h3: 'semibold',
  lead: 'regular',
  body: 'regular',
  small: 'regular',
  label: 'regular',
  caption: 'regular',
  mono: 'regular',
};

const WEIGHT_CLASSES: Record<TextWeight, string> = {
  regular: 'font-normal',
  medium: 'font-medium',
  semibold: 'font-semibold',
  bold: 'font-bold',
};

export interface TextProps extends HTMLAttributes<HTMLElement> {
  readonly variant?: TextVariant;
  /** Por defecto `semibold` en los títulos (`display`/`h2`/`h3`) y `regular` en el resto. */
  readonly weight?: TextWeight;
  /** Etiqueta HTML; por defecto la que corresponde a la variante (`display` → `h1`, `body` → `p`…). */
  readonly as?: TextElement;
}

/**
 * Texto con la escala tipográfica del diseño: títulos en Fraunces, cuerpo en IBM Plex Sans y
 * cifras en IBM Plex Mono. La semántica HTML se elige con `as`, independiente del estilo.
 *
 * @example
 * <Text variant="h2" as="h1">Inicia sesión</Text>
 */
export function Text({
  variant = 'body',
  weight,
  as,
  className,
  ...props
}: Readonly<TextProps>) {
  const Component = as ?? DEFAULT_ELEMENT[variant];
  return (
    <Component
      className={cn(VARIANT_CLASSES[variant], WEIGHT_CLASSES[weight ?? DEFAULT_WEIGHT[variant]], className)}
      {...props}
    />
  );
}
