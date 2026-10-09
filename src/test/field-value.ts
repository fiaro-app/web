/** Valor que viajaría en el formulario para el campo `name` (los selectores propios lo guardan en un campo oculto). */
export function fieldValue(container: HTMLElement, name: string): string | undefined {
  return container.querySelector<HTMLInputElement | HTMLSelectElement>(`[name="${name}"]`)?.value;
}
