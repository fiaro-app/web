import { describe, expect, it } from 'vitest';
import { buildTutorialSteps, navTarget } from './tutorial-steps';

describe('buildTutorialSteps', () => {
  it('goes from the welcome through every menu option the person sees, to the account, sign out and the end', () => {
    const steps = buildTutorialSteps(['/resumen', '/clientes', '/prestamos']);

    expect(steps.map((step) => step.id)).toEqual(['welcome', 'nav/resumen', 'nav/clientes', 'nav/prestamos', 'account', 'sign-out', 'done']);
    expect(steps.map((step) => step.target)).toEqual([null, '[data-tour="nav/resumen"]', '[data-tour="nav/clientes"]', '[data-tour="nav/prestamos"]', '[data-tour="account"]', '[data-tour="sign-out"]', null]);
  });

  it('explains what each part is for', () => {
    const [, resumen] = buildTutorialSteps(['/resumen']);
    expect(resumen).toMatchObject({ title: 'Resumen' });
    expect(resumen?.body).toMatch(/Sirve para/);
  });

  it('only explains the options of the menu it is given, so a collector never hears about hidden modules', () => {
    const ids = buildTutorialSteps(['/clientes', '/prestamos']).map((step) => step.id);
    expect(ids).not.toContain('nav/cobradores');
    expect(ids).not.toContain('nav/estadisticas');
  });

  it('skips an option it has no explanation for', () => {
    expect(buildTutorialSteps(['/desconocida']).map((step) => step.id)).toEqual(['welcome', 'account', 'sign-out', 'done']);
  });

  it('builds the selector of a menu option', () => {
    expect(navTarget('/prestamos')).toBe('[data-tour="nav/prestamos"]');
  });
});
