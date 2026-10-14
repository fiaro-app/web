import { create } from 'zustand';
import { darken } from '@/lib/color';

/** El color de marca por defecto (anil de Fiaro), igual al valor estático de `globals.css`. */
export const DEFAULT_PRIMARY_COLOR = '#3b3382';

interface ThemeState {
  readonly primaryColor: string;
  /** @param hex - A `#rrggbb` brand color; applied immediately, not just stored. */
  setPrimaryColor: (hex: string) => void;
  resetPrimaryColor: () => void;
}

/**
 * The Lender's brand color (PROTOTIPO-FLUJOS.md §4.9, "Configuración de compañía"): not a
 * Tailwind build-time setting, since it changes per tenant at runtime. `--primary`/`--ring` and
 * their derived `--primary-hover` are plain CSS variables (`globals.css`'s `@theme inline` maps
 * them to `bg-primary`/`ring-primary` etc.); this store is the only thing allowed to overwrite
 * them, via `document.documentElement.style`, never by editing that file.
 *
 * @remarks
 * The API has no `Lender.brandColor` field yet (D-102 shipped the logo upload, not this) — call
 * `setPrimaryColor` once that field exists and is fetched after login; until then every session
 * just keeps the default.
 */
export const useThemeStore = create<ThemeState>((set) => ({
  primaryColor: DEFAULT_PRIMARY_COLOR,
  setPrimaryColor: (hex) => {
    applyPrimaryColor(hex);
    set({ primaryColor: hex });
  },
  resetPrimaryColor: () => {
    applyPrimaryColor(DEFAULT_PRIMARY_COLOR);
    set({ primaryColor: DEFAULT_PRIMARY_COLOR });
  },
}));

function applyPrimaryColor(hex: string): void {
  const root = document.documentElement.style;
  root.setProperty('--primary', hex);
  root.setProperty('--primary-hover', darken(hex, 0.1));
  root.setProperty('--ring', hex);
}
