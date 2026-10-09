import type { SVGProps } from "react";

/** Los dibujos de los estados vacíos, de error y de acceso. */
export type StateIconName =
  | "users"
  | "user-plus"
  | "wallet"
  | "clipboard"
  | "bell"
  | "chart"
  | "lock"
  | "search"
  | "alert";

/** Trazos de cada icono (cuadrícula de 24px, líneas de 1.6px). Se dibujan con `currentColor`. */
const PATHS: Record<StateIconName, readonly string[]> = {
  users: [
    "M16 19v-1.5a3.5 3.5 0 0 0-3.5-3.5h-5A3.5 3.5 0 0 0 4 17.5V19",
    "M10 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z",
    "M20 19v-1.5a3.5 3.5 0 0 0-2.5-3.35",
    "M15.5 5.2a3 3 0 0 1 0 5.6",
  ],
  "user-plus": [
    "M15 19v-1.5a3.5 3.5 0 0 0-3.5-3.5h-4A3.5 3.5 0 0 0 4 17.5V19",
    "M9.5 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z",
    "M19 8v6",
    "M16 11h6",
  ],
  wallet: [
    "M4 7.5A2.5 2.5 0 0 1 6.5 5H18v3",
    "M4 7.5V17a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2H6.5A2.5 2.5 0 0 1 4 7.5Z",
    "M16 13.5h.01",
  ],
  clipboard: [
    "M9 5H7a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2",
    "M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v0a2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2Z",
    "m9 13 2 2 4-4",
  ],
  bell: [
    "M6 9a6 6 0 1 1 12 0c0 5 2 6.5 2 6.5H4S6 14 6 9Z",
    "M10 19a2 2 0 0 0 4 0",
  ],
  chart: ["M4 20V4", "M4 20h16", "M8 16v-4", "M12 16V8", "M16 16v-6"],
  lock: [
    "M6 11h12a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1v-7a1 1 0 0 1 1-1Z",
    "M8 11V8a4 4 0 1 1 8 0v3",
    "M12 15v2",
  ],
  search: ["M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14Z", "m20 20-3.5-3.5"],
  alert: ["M12 4 3 19.5h18L12 4Z", "M12 10v4", "M12 17h.01"],
};

export interface StateIconProps extends Omit<
  SVGProps<SVGSVGElement>,
  "children"
> {
  readonly name: StateIconName;
}

/** Icono decorativo de un estado (el texto que lo acompaña dice lo mismo). Hereda el color del texto. */
export function StateIcon({
  name,
  className,
  ...props
}: Readonly<StateIconProps>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className ?? "size-16"}
      {...props}
    >
      {PATHS[name].map((path) => (
        <path key={path} d={path} />
      ))}
    </svg>
  );
}
