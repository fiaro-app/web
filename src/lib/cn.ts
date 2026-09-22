/**
 * Joins truthy class names into a single string, skipping falsy values.
 *
 * @example
 * cn('btn', isActive && 'btn-active', undefined) // 'btn btn-active'
 */
export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(' ');
}
