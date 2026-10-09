import type { Weekday } from '@fiaro-app/contracts';
import { lenderEndpoints } from '@/features/lender/endpoints';
import { callEndpoint } from '@/lib/api';

/** Cambia el nombre del negocio. */
export function updateBusinessName(name: string) {
  return callEndpoint(lenderEndpoints.update, { body: { name } });
}

/** Cambia el color de marca (`#RRGGBB`); `null` vuelve al color de Fiaro. */
export function updateBrandColor(brandColor: string | null) {
  return callEndpoint(lenderEndpoints.update, { body: { brandColor } });
}

/** Cambia los días sin cobro y si los festivos nacionales cuentan. */
export function updateCollectionDays(nonWorkingWeekdays: readonly Weekday[], skipNationalHolidays: boolean) {
  return callEndpoint(lenderEndpoints.update, { body: { nonWorkingWeekdays: [...nonWorkingWeekdays], skipNationalHolidays } });
}

/** Crea una cartera nueva. */
export function createPortfolio(name: string) {
  return callEndpoint(lenderEndpoints.createPortfolio, { body: { name } });
}

/** Cambia el nombre de una cartera. */
export function renamePortfolio(id: string, name: string) {
  return callEndpoint(lenderEndpoints.renamePortfolio, { params: { id }, body: { name } });
}

/** Borra una cartera (la de por defecto o con cobradores activos no se puede borrar). */
export function deletePortfolio(id: string) {
  return callEndpoint(lenderEndpoints.deletePortfolio, { params: { id } });
}

/** Pide la URL firmada para subir un logo del tipo dado. */
export function requestLogoUploadUrl(contentType: 'image/png' | 'image/jpeg') {
  return callEndpoint(lenderEndpoints.logoUploadUrl, { body: { contentType } });
}

/** Guarda la URL pública del logo ya subido; `null` lo quita. */
export function saveLogoUrl(logoUrl: string | null) {
  return callEndpoint(lenderEndpoints.update, { body: { logoUrl } });
}

/**
 * Sube el archivo del logo directo al almacenamiento con la URL firmada (no pasa por la API ni por
 * la web) y devuelve la URL pública. Lanza si el almacenamiento rechaza la subida.
 */
export async function uploadLogoFile(file: File): Promise<string> {
  const contentType = file.type === 'image/png' ? 'image/png' : 'image/jpeg';
  const { uploadUrl, publicUrl } = await requestLogoUploadUrl(contentType);
  const response = await fetch(uploadUrl, { method: 'PUT', headers: { 'Content-Type': contentType }, body: file });
  if (!response.ok) throw new Error(`Falló la subida del logo (${String(response.status)}).`);
  return publicUrl;
}
