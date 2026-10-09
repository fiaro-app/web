import type { Weekday } from '@fiaro-app/contracts';

/** Textos del módulo Configuración. */
export const SETTINGS_TEXT = {
  title: 'Configuración',
  forbidden: {
    title: 'No tienes acceso a esta sección',
    description: 'Tu cuenta no tiene un negocio activo desde el que ver la configuración.',
  },
  readOnly: 'Solo quien administra el negocio puede cambiar la configuración.',
  business: {
    title: 'Datos del negocio',
    description: 'El nombre con el que aparece tu financiera en Fiaro.',
    nameLabel: 'Nombre de la financiera',
    namePlaceholder: 'Ej: Financiera Buen Vecino',
    save: 'Guardar nombre',
  },
  days: {
    title: 'Días sin cobro',
    description: 'Los días en que tus cobradores no salen a cobrar. Las cuotas que caigan en uno pasan al siguiente día de cobro.',
    legend: 'Días de la semana sin cobro',
    holidays: 'Tampoco cobrar en festivos nacionales de Colombia',
    save: 'Guardar días',
  },
  portfolios: {
    title: 'Carteras',
    description: 'Agrupa a tus cobradores por zona o ruta. Cada cobrador pertenece a una cartera.',
    listLabel: 'Carteras del negocio',
    defaultBadge: 'Por defecto',
    nameLabel: 'Nueva cartera',
    namePlaceholder: 'Ej: Zona Norte',
    create: 'Crear cartera',
  },
  weekdays: {
    MONDAY: 'Lunes',
    TUESDAY: 'Martes',
    WEDNESDAY: 'Miércoles',
    THURSDAY: 'Jueves',
    FRIDAY: 'Viernes',
    SATURDAY: 'Sábado',
    SUNDAY: 'Domingo',
  } satisfies Record<Weekday, string>,
} as const;
