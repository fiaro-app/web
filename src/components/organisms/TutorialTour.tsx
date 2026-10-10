'use client';

import { useEffect, useId, useLayoutEffect, useRef, useState } from 'react';
import { Button } from '@/components/atoms/Button';
import { Text } from '@/components/atoms/Text';
import { TUTORIAL_TEXT } from '@/content/tutorial';
import { cardPosition, maskPanels, padBox, type Size } from '@/features/tutorial/tutorial-geometry';
import type { TutorialStep } from '@/features/tutorial/tutorial-steps';
import { useTargetBox } from '@/features/tutorial/use-target-box';

export interface TutorialTourProps {
  readonly step: TutorialStep;
  readonly index: number;
  readonly total: number;
  readonly isFirst: boolean;
  readonly isLast: boolean;
  readonly onNext: () => void;
  readonly onPrevious: () => void;
  readonly onFinish: () => void;
}

/**
 * El recorrido guiado: todo el panel se ve borroso y atenuado salvo el elemento que explica el paso, que queda nítido
 * dentro de un marco; junto a él una tarjeta cuenta para qué sirve y por qué. Funciona con teclado (flechas y Esc)
 * y bloquea los clics del fondo mientras dura. Solo presentación: los pasos y su avance vienen de `useTutorial`.
 */
export function TutorialTour({ step, index, total, isFirst, isLast, onNext, onPrevious, onFinish }: Readonly<TutorialTourProps>) {
  const text = TUTORIAL_TEXT.controls;
  const titleId = useId();
  const bodyId = useId();
  const cardRef = useRef<HTMLDivElement>(null);
  const [cardSize, setCardSize] = useState<Size | null>(null);
  const { box, viewport } = useTargetBox(step.target);

  // La tarjeta se mide para poder ponerla junto al elemento sin salirse de la ventana.
  useLayoutEffect(() => {
    const card = cardRef.current;
    if (card) setCardSize({ width: card.offsetWidth, height: card.offsetHeight });
  }, [step.id, viewport.width]);

  // El foco pasa a la tarjeta en cada paso: quien usa lector de pantalla oye el paso nuevo.
  useEffect(() => {
    cardRef.current?.focus();
  }, [step.id]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onFinish();
      else if (event.key === 'ArrowRight') onNext();
      else if (event.key === 'ArrowLeft' && !isFirst) onPrevious();
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [isFirst, onFinish, onNext, onPrevious]);

  const hole = box === null ? null : padBox(box, viewport);
  const panels = hole === null ? [{ top: 0, left: 0, width: viewport.width, height: viewport.height }] : maskPanels(hole, viewport);
  const position = cardSize === null ? null : cardPosition(hole, cardSize, viewport);
  const veil = 'fixed bg-foreground/45 backdrop-blur-[3px]';

  return (
    <div className="fixed inset-0 z-[100]" data-testid="tutorial-tour">
      {panels.map((panel) => (
        <div key={`${String(panel.top)}-${String(panel.left)}`} aria-hidden="true" className={veil} style={panel} />
      ))}
      {hole && (
        <>
          {/* El elemento se ve pero no se puede pulsar durante el recorrido. */}
          <div aria-hidden="true" className="fixed rounded-md ring-2 ring-surface" style={hole} />
          <div aria-hidden="true" className="pointer-events-none fixed rounded-md shadow-[0_0_0_4px_rgb(255_255_255/0.9),0_8px_28px_rgb(0_0_0/0.25)]" style={hole} />
        </>
      )}
      <div
        ref={cardRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={bodyId}
        tabIndex={-1}
        className="fixed flex w-[22rem] max-w-[calc(100vw-2rem)] flex-col gap-4 rounded-lg bg-surface p-6 text-foreground shadow-[0_24px_64px_-8px_rgb(28_27_46/0.45)] focus:outline-none"
        style={position ?? { top: 0, left: 0, visibility: 'hidden' }}
      >
        <Text variant="caption" className="font-semibold text-primary">
          {text.step(index + 1, total)}
        </Text>
        <div className="flex flex-col gap-2">
          <Text id={titleId} variant="h3" as="h2">
            {step.title}
          </Text>
          <Text id={bodyId} className="text-foreground/75">
            {step.body}
          </Text>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3">
          {isLast ? (
            <span />
          ) : (
            <Button variant="text" size="sm" className="px-0" onClick={onFinish}>
              {text.skip}
            </Button>
          )}
          <span className="flex gap-2">
            {!isFirst && (
              <Button variant="outline" size="sm" onClick={onPrevious}>
                {text.previous}
              </Button>
            )}
            <Button size="sm" onClick={onNext}>
              {isLast ? text.finish : text.next}
            </Button>
          </span>
        </div>
      </div>
    </div>
  );
}
