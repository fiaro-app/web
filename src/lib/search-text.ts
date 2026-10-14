/** Texto para comparar al buscar: sin tildes, sin mayúsculas y sin espacios sobrantes. */
export function normalizeSearchText(value: string): string {
  return value.normalize('NFD').replaceAll(/\p{M}/gu, '').trim().toLowerCase();
}

/** ¿Alguno de los textos contiene lo buscado (sin importar tildes ni mayúsculas)? Una búsqueda vacía coincide con todo. */
export function matchesSearch(search: string, ...fields: readonly string[]): boolean {
  const needle = normalizeSearchText(search);
  return needle === '' || fields.some((field) => normalizeSearchText(field).includes(needle));
}
