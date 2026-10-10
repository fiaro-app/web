'use client';

import { ConfirmDialog } from '@/components/molecules/ConfirmDialog';
import { TutorialTour } from '@/components/organisms/TutorialTour';
import { TUTORIAL_TEXT } from '@/content/tutorial';
import { buildTutorialSteps } from '@/features/tutorial/tutorial-steps';
import { useTutorial } from '@/features/tutorial/use-tutorial';
import { useMemo } from 'react';

export interface OnboardingTutorialProps {
  /** Quién es, para recordar que ya vio el tutorial. */
  readonly userId: string;
  /** Las rutas del menú que esta persona ve, en orden: el recorrido solo explica lo que existe para ella. */
  readonly navHrefs: readonly string[];
}

/**
 * El tutorial de bienvenida: a quien entra por primera vez le pregunta si quiere un recorrido y, si dice que sí, la
 * guía por cada parte del panel dejando a la vista solo la que se explica. Lógica en `useTutorial`.
 */
export function OnboardingTutorial({ userId, navHrefs }: Readonly<OnboardingTutorialProps>) {
  const steps = useMemo(() => buildTutorialSteps(navHrefs), [navHrefs]);
  const tutorial = useTutorial({ userId, steps });
  const invite = TUTORIAL_TEXT.invite;

  return (
    <>
      <ConfirmDialog
        open={tutorial.phase === 'invite'}
        title={invite.title}
        description={invite.description}
        confirmLabel={invite.start}
        cancelLabel={invite.skip}
        onConfirm={tutorial.accept}
        onCancel={tutorial.decline}
      />
      {tutorial.phase === 'tour' && tutorial.step && (
        <TutorialTour
          step={tutorial.step}
          index={tutorial.index}
          total={tutorial.total}
          isFirst={tutorial.isFirst}
          isLast={tutorial.isLast}
          onNext={tutorial.next}
          onPrevious={tutorial.previous}
          onFinish={tutorial.finish}
        />
      )}
    </>
  );
}
