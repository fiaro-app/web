'use client';

import { Button } from '@/components/atoms/Button';
import { TUTORIAL_TEXT } from '@/content/tutorial';
import { START_TUTORIAL_EVENT } from '@/features/tutorial/tutorial-storage';

/** «Ver el tutorial»: vuelve a lanzar el recorrido de bienvenida desde cualquier pantalla. */
export function TutorialLauncher() {
  return (
    <Button type="button" variant="outline" className="self-start" onClick={() => window.dispatchEvent(new Event(START_TUTORIAL_EVENT))}>
      {TUTORIAL_TEXT.launcher.action}
    </Button>
  );
}
