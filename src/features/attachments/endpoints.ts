import { IdSchema, defineEndpoint } from '@fiaro-app/contracts';
import { z } from 'zod';

const ParamsSchema = z.object({ id: IdSchema });
const UploadBodySchema = z.strictObject({ contentType: z.enum(['image/png', 'image/jpeg']), sizeBytes: z.number().int().positive() });
const UploadUrlSchema = z.object({ uploadUrl: z.url(), key: z.string(), expiresAt: z.string() });
const ViewSchema = z.object({ url: z.url().nullable(), expiresAt: z.string().nullable() });

/** Lo que se adjunta: la foto de un cliente o el comprobante de un pago (D-145 de la API). */
export type AttachmentTarget = 'clientPhoto' | 'paymentProof';

/** Los cuatro endpoints de un archivo privado que cuelga de `base` (`/clients/:id/photo`). */
function endpointsFor<Upload extends `/${string}`, Base extends `/${string}`>(uploadPath: Upload, base: Base) {
  return {
    uploadUrl: defineEndpoint({ method: 'POST', path: uploadPath, summary: 'URL firmada para subir la imagen.', params: ParamsSchema, body: UploadBodySchema, response: UploadUrlSchema }),
    attach: defineEndpoint({ method: 'POST', path: base, summary: 'Guarda la imagen ya subida.', params: ParamsSchema, body: z.strictObject({ key: z.string().min(1) }), response: z.undefined() }),
    view: defineEndpoint({ method: 'GET', path: base, summary: 'URL firmada para ver la imagen, o null.', params: ParamsSchema, response: ViewSchema }),
    remove: defineEndpoint({ method: 'DELETE', path: base, summary: 'Quita la imagen.', params: ParamsSchema, response: z.undefined() }),
  } as const;
}

export const attachmentEndpoints = {
  clientPhoto: endpointsFor('/clients/:id/photo/upload-url', '/clients/:id/photo'),
  paymentProof: endpointsFor('/payments/:id/proof/upload-url', '/payments/:id/proof'),
} as const;
