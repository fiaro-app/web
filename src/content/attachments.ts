/** Textos del comprobante de un pago. */
export const ATTACHMENTS_TEXT = {
  paymentProof: {
    title: 'Comprobante del pago',
    description: 'La captura de Nequi o de la transferencia. La ven quienes administran el negocio y quien hizo el cobro. PNG o JPG, máximo 5 MB.',
    alt: (date: string) => `Comprobante del pago del ${date}`,
    none: 'Este pago no tiene comprobante.',
    action: 'Comprobante',
    close: 'Cerrar',
  },
  loading: 'Cargando imagen…',
  error: 'No pudimos cargar la imagen.',
  retry: 'Reintentar',
  upload: 'Subir imagen',
  change: 'Cambiar imagen',
  remove: 'Quitar imagen',
  confirmTitle: '¿Quitar la imagen?',
  confirmDescription: 'Se borra del almacenamiento. Puedes subir otra cuando quieras.',
  confirmLabel: 'Quitar',
} as const;
