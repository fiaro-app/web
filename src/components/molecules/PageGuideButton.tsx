'use client';

import { TUTORIAL_TEXT } from '@/content/tutorial';
import { START_PAGE_GUIDE_EVENT } from '@/features/tutorial/tutorial-storage';

/** «Guía de esta pantalla»: explica los controles de la pantalla en que está la persona, uno por uno. */
export function PageGuideButton() {
  return (
    <button
      type="button"
      onClick={() => globalThis.dispatchEvent(new Event(START_PAGE_GUIDE_EVENT))}
      className="inline-flex min-h-11 items-center gap-2 self-start rounded-sm text-small font-semibold text-primary hover:underline focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
    >
      <span aria-hidden="true" className="grid size-5 place-items-center rounded-full border-[1.5px] border-current text-caption leading-none">
        ?
      </span>
      {TUTORIAL_TEXT.pageGuide.action}
    </button>
  );
}
