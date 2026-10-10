import { TUTORIAL_TEXT, type TutorialNavHref } from '@/content/tutorial';

/** Un paso del tutorial: qué se señala (o nada, si es un paso general) y qué se explica. */
export interface TutorialStep {
  readonly id: string;
  /** Valor de `data-tour` del elemento que queda a la vista; `null`: paso general, sin elemento. */
  readonly target: string | null;
  readonly title: string;
  readonly body: string;
}

/** Valor de `data-tour` de una opción del menú. */
export function navTarget(href: string): string {
  return `nav${href}`;
}

function isNavHref(href: string): href is TutorialNavHref {
  return href in TUTORIAL_TEXT.nav;
}

/**
 * Los pasos del recorrido para esta persona: bienvenida, cada opción del menú que realmente ve (según su
 * rol) en el orden del menú, su cuenta, cerrar sesión y el final. Una opción sin explicación se omite.
 *
 * @param navHrefs - Las rutas del menú visibles para la persona, en orden.
 */
export function buildTutorialSteps(navHrefs: readonly string[]): readonly TutorialStep[] {
  const navSteps = navHrefs.filter(isNavHref).map<TutorialStep>((href) => ({
    id: `nav${href}`,
    target: navTarget(href),
    ...TUTORIAL_TEXT.nav[href],
  }));
  return [
    { id: 'welcome', target: null, ...TUTORIAL_TEXT.welcome },
    ...navSteps,
    { id: 'account', target: 'account', ...TUTORIAL_TEXT.account },
    { id: 'sign-out', target: 'sign-out', ...TUTORIAL_TEXT.signOut },
    { id: 'done', target: null, ...TUTORIAL_TEXT.done },
  ];
}
