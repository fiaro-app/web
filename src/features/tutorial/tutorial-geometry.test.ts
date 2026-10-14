import { describe, expect, it } from 'vitest';
import { cardPosition, maskPanels, padBox } from './tutorial-geometry';

const VIEWPORT = { width: 1440, height: 900 };

describe('padBox', () => {
  it('adds a margin around the element without leaving the window', () => {
    expect(padBox({ top: 100, left: 24, width: 212, height: 37 }, VIEWPORT)).toEqual({ top: 94, left: 18, width: 224, height: 49 });
    expect(padBox({ top: 2, left: 2, width: 50, height: 20 }, VIEWPORT)).toEqual({ top: 0, left: 0, width: 58, height: 28 });
  });
});

describe('maskPanels', () => {
  it('covers the whole window except the hole', () => {
    const hole = { top: 100, left: 200, width: 300, height: 50 };
    const panels = maskPanels(hole, VIEWPORT);
    const area = panels.reduce((sum, panel) => sum + panel.width * panel.height, 0);

    expect(area).toBe(VIEWPORT.width * VIEWPORT.height - hole.width * hole.height);
  });
});

describe('cardPosition', () => {
  const card = { width: 352, height: 220 };

  it('goes to the right of the element when there is room (the menu is on the left)', () => {
    const target = { top: 300, left: 24, width: 212, height: 37 };
    expect(cardPosition(target, card, VIEWPORT)).toEqual({ top: 300 + 37 / 2 - 110, left: 24 + 212 + 16 });
  });

  it('goes below when it does not fit on the right, and above when it does not fit below', () => {
    const wide = { top: 100, left: 20, width: 1400, height: 40 };
    expect(cardPosition(wide, card, VIEWPORT)).toEqual({ top: 156, left: 20 });
    const bottom = { top: 800, left: 20, width: 1400, height: 40 };
    expect(cardPosition(bottom, card, VIEWPORT).top).toBe(800 - 16 - 220);
  });

  it('is centered without an element and never leaves the window', () => {
    expect(cardPosition(null, card, VIEWPORT)).toEqual({ top: 340, left: 544 });
    const narrow = { width: 375, height: 667 };
    expect(cardPosition(null, { width: 352, height: 220 }, narrow).left).toBeGreaterThanOrEqual(16);
  });
});
