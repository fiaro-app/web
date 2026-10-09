import { BrandColorSchema, BusinessNameSchema, IdSchema, LenderSchema, PortfolioSchema, WeekdaySchema, defineEndpoint } from '@fiaro-app/contracts';
import { z } from 'zod';

// El prestamista ya trae `brandColor` (D-110) en `LenderSchema` de `@fiaro-app/contracts`.
export { BrandColorSchema } from '@fiaro-app/contracts';
export const LenderResponseSchema = LenderSchema;
export type LenderResponse = z.infer<typeof LenderResponseSchema>;

/** Cuerpo de `PATCH /lender`: un campo ausente no se toca y debe venir al menos uno. */
export const UpdateLenderBodySchema = z
  .strictObject({
    name: BusinessNameSchema.optional(),
    logoUrl: z.url().nullable().optional(),
    nonWorkingWeekdays: z.array(WeekdaySchema).optional(),
    skipNationalHolidays: z.boolean().optional(),
    brandColor: BrandColorSchema.nullable().optional(),
  })
  .refine((body) => Object.values(body).some((value) => value !== undefined), {
    message: 'Debes enviar al menos un campo para actualizar.',
  });

/** Cuerpo de `POST /lender/logo-upload-url`: el logo solo puede ser PNG o JPEG. */
export const LogoUploadUrlBodySchema = z.strictObject({
  contentType: z.enum(['image/png', 'image/jpeg']),
});

/** Respuesta de `POST /lender/logo-upload-url`: a dónde subir el archivo y cuál será su URL pública. */
export const LogoUploadUrlSchema = z.object({
  uploadUrl: z.url(),
  publicUrl: z.url(),
  expiresAt: z.iso.datetime({ offset: true }),
});

/** Cuerpo de `POST /portfolios`: el nombre es único dentro del prestamista. */
export const CreatePortfolioBodySchema = z.strictObject({ name: BusinessNameSchema });

/** Cuerpo de `PATCH /portfolios/:id`: el nuevo nombre, que tampoco puede repetirse. */
export const RenamePortfolioBodySchema = z.strictObject({ name: BusinessNameSchema });

/**
 * Datos del prestamista de la sesión. `@fiaro-app/contracts` 0.6.0 publica los schemas
 * (`LenderSchema`, `PortfolioSchema`) pero no los endpoints: se declaran aquí con los mismos
 * schemas (mismo plan de migración que `features/auth/endpoints.ts`).
 */
export const lenderEndpoints = {
  get: defineEndpoint({
    method: 'GET',
    path: '/lender',
    summary: 'Datos públicos del prestamista de la sesión (nombre, logo, color de marca, días sin cobro).',
    response: LenderResponseSchema,
  }),
  update: defineEndpoint({
    method: 'PATCH',
    path: '/lender',
    summary: 'Actualiza los campos enviados del prestamista (solo Owner y Lender).',
    body: UpdateLenderBodySchema,
    response: LenderResponseSchema,
  }),
  logoUploadUrl: defineEndpoint({
    method: 'POST',
    path: '/lender/logo-upload-url',
    summary: 'URL firmada para subir el logo directo al almacenamiento (solo Owner y Lender).',
    body: LogoUploadUrlBodySchema,
    response: LogoUploadUrlSchema,
  }),
  portfolios: defineEndpoint({
    method: 'GET',
    path: '/portfolios',
    summary: 'Todas las carteras del prestamista, sin paginar.',
    response: z.array(PortfolioSchema),
  }),
  createPortfolio: defineEndpoint({
    method: 'POST',
    path: '/portfolios',
    summary: 'Crea una cartera (solo Owner y Lender); el nombre no puede repetirse.',
    body: CreatePortfolioBodySchema,
    response: PortfolioSchema,
  }),
  renamePortfolio: defineEndpoint({
    method: 'PATCH',
    path: '/portfolios/:id',
    summary: 'Renombra una cartera, la de por defecto incluida (solo Owner y Lender); el nombre no puede repetirse.',
    params: z.object({ id: IdSchema }),
    body: RenamePortfolioBodySchema,
    response: PortfolioSchema,
  }),
  deletePortfolio: defineEndpoint({
    method: 'DELETE',
    path: '/portfolios/:id',
    summary: 'Borra una cartera (solo Owner y Lender); 409 si es la de por defecto o tiene cobradores activos.',
    params: z.object({ id: IdSchema }),
    response: z.undefined(),
  }),
} as const;
