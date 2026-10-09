import { describe, expect, it } from 'vitest';
import { APP_NAV_ITEMS, isNavItemActive, visibleNavItems } from './app-nav';

describe('APP_NAV_ITEMS', () => {
  it('lists the modules of the design, all available', () => {
    expect(APP_NAV_ITEMS.map((item) => item.label)).toEqual([
      'Resumen',
      'Cobradores',
      'Clientes',
      'Préstamos',
      'Cobros',
      'Cuadres',
      'Notificaciones',
      'Estadísticas',
      'Configuración',
    ]);
    expect(APP_NAV_ITEMS.filter((item) => item.available).map((item) => item.href)).toEqual([
      '/resumen',
      '/cobradores',
      '/clientes',
      '/prestamos',
      '/cobros',
      '/cuadres',
      '/notificaciones',
      '/estadisticas',
      '/configuracion',
    ]);
  });
});

describe('isNavItemActive', () => {
  it('matches the route itself and its sub-routes', () => {
    expect(isNavItemActive('/clientes', '/clientes')).toBe(true);
    expect(isNavItemActive('/clientes/123', '/clientes')).toBe(true);
  });

  it('does not match a route that only starts with the same letters', () => {
    expect(isNavItemActive('/clientes-nuevos', '/clientes')).toBe(false);
    expect(isNavItemActive('/resumen', '/clientes')).toBe(false);
  });
});

describe('visibleNavItems', () => {
  it('gives a collector only the modules that are not administration', () => {
    expect(visibleNavItems(true).map((item) => item.label)).toEqual(['Resumen', 'Clientes', 'Préstamos', 'Cobros', 'Notificaciones']);
  });

  it('gives everyone else the whole menu', () => {
    expect(visibleNavItems(false)).toBe(APP_NAV_ITEMS);
  });
});
