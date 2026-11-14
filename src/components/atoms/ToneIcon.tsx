import type { Tone } from '@/lib/tone';

/** Trazos de cada intención (cuadrícula de 24px): círculo con marca, triángulo, círculo con equis y círculo con «i». */
const PATHS: Record<Tone, readonly string[]> = {
  success: ['M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z', 'm8.5 12.5 2.5 2.5 4.5-5'],
  warning: ['M12 4 3 19.5h18L12 4Z', 'M12 10v4', 'M12 17h.01'],
  error: ['M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z', 'm9.5 9.5 5 5', 'm14.5 9.5-5 5'],
  info: ['M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z', 'M12 11v5', 'M12 8h.01'],
};

export interface ToneIconProps {
  readonly tone: Tone;
  readonly className?: string;
}

/** Icono decorativo de una intención; el texto que lo acompaña dice lo mismo, así que no se anuncia. Hereda el color del texto. */
export function ToneIcon({ tone, className = 'size-5' }: Readonly<ToneIconProps>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={className}>
      {PATHS[tone].map((path) => (
        <path key={path} d={path} />
      ))}
    </svg>
  );
}
