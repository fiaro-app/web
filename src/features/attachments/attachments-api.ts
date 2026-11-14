import { attachmentEndpoints, type AttachmentTarget } from '@/features/attachments/endpoints';
import { callEndpoint } from '@/lib/api';

/** La URL firmada para ver la imagen (vence en minutos), o `null` si no hay. */
export async function getAttachmentUrl(target: AttachmentTarget, id: string): Promise<string | null> {
  const { url } = await callEndpoint(attachmentEndpoints[target].view, { params: { id } });
  return url;
}

/**
 * Sube la imagen directo al almacenamiento con la URL firmada (no pasa por la API) y la guarda.
 * Lanza si el almacenamiento rechaza la subida.
 */
export async function uploadAttachment(target: AttachmentTarget, id: string, file: File): Promise<void> {
  const contentType = file.type === 'image/png' ? 'image/png' : 'image/jpeg';
  const endpoints = attachmentEndpoints[target];
  const { uploadUrl, key } = await callEndpoint(endpoints.uploadUrl, { params: { id }, body: { contentType, sizeBytes: file.size } });
  const response = await fetch(uploadUrl, { method: 'PUT', headers: { 'Content-Type': contentType }, body: file });
  if (!response.ok) throw new Error(`Falló la subida de la imagen (${String(response.status)}).`);
  await callEndpoint(endpoints.attach, { params: { id }, body: { key } });
}

/** Quita la imagen; repetirlo no falla. */
export function removeAttachment(target: AttachmentTarget, id: string) {
  return callEndpoint(attachmentEndpoints[target].remove, { params: { id } });
}
