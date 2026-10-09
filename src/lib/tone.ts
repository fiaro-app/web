/** Intención semántica de un mensaje: éxito (musgo), aviso (ámbar), error (grana) o info (anil). */
export type Tone = 'success' | 'warning' | 'error' | 'info';

/** Texto en el color de la intención. Clases literales para que Tailwind las detecte. */
export const TONE_TEXT_CLASSES: Record<Tone, string> = {
  success: 'text-success',
  warning: 'text-warning',
  error: 'text-destructive',
  info: 'text-primary',
};

/** Texto + fondo translúcido al 12% de la intención (alertas). */
export const TONE_SURFACE_CLASSES: Record<Tone, string> = {
  success: 'bg-success/12 text-success',
  warning: 'bg-warning/12 text-warning',
  error: 'bg-destructive/12 text-destructive',
  info: 'bg-primary/12 text-primary',
};
