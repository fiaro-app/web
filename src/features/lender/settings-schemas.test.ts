import { describe, expect, it } from 'vitest';
import { BusinessFormSchema, PortfolioFormSchema, WEEKDAYS, sameWeekdays, toggleWeekday } from './settings-schemas';

describe('BusinessFormSchema / PortfolioFormSchema', () => {
  it('trims and validates the business name', () => {
    expect(BusinessFormSchema.parse({ name: '  Buen Vecino ' }).name).toBe('Buen Vecino');
    const result = BusinessFormSchema.safeParse({ name: '' });
    expect(result.error?.issues[0]?.message).toBe('Escribe el nombre de tu financiera.');
  });

  it('requires a portfolio name', () => {
    expect(PortfolioFormSchema.safeParse({ name: '   ' }).error?.issues[0]?.message).toBe('Escribe el nombre de la cartera.');
    expect(PortfolioFormSchema.parse({ name: 'Zona Norte' }).name).toBe('Zona Norte');
  });
});

describe('toggleWeekday', () => {
  it('adds a day keeping the Monday-first order', () => {
    expect(toggleWeekday(['SUNDAY'], 'MONDAY', true)).toEqual(['MONDAY', 'SUNDAY']);
  });

  it('does not repeat a day that is already there', () => {
    expect(toggleWeekday(['SUNDAY'], 'SUNDAY', true)).toEqual(['SUNDAY']);
  });

  it('removes a day', () => {
    expect(toggleWeekday(['SATURDAY', 'SUNDAY'], 'SATURDAY', false)).toEqual(['SUNDAY']);
    expect(toggleWeekday([], 'SATURDAY', false)).toEqual([]);
  });

  it('knows the seven days of the week', () => {
    expect(WEEKDAYS).toHaveLength(7);
    expect(WEEKDAYS[0]).toBe('MONDAY');
  });
});

describe('sameWeekdays', () => {
  it('ignores the order', () => {
    expect(sameWeekdays(['SUNDAY', 'MONDAY'], ['MONDAY', 'SUNDAY'])).toBe(true);
  });

  it('detects different lists', () => {
    expect(sameWeekdays(['SUNDAY'], ['SUNDAY', 'MONDAY'])).toBe(false);
    expect(sameWeekdays(['SUNDAY'], ['MONDAY'])).toBe(false);
  });
});
