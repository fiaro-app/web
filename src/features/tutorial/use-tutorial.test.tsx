import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';
import { buildTutorialSteps } from './tutorial-steps';
import { START_TUTORIAL_EVENT } from './tutorial-storage';
import { useTutorial } from './use-tutorial';

const STEPS = buildTutorialSteps(['/resumen', '/clientes']);
const setup = () => renderHook(() => useTutorial({ userId: 'u1', steps: STEPS })).result;

beforeEach(() => window.localStorage.clear());

describe('useTutorial', () => {
  it('offers the tutorial to someone who has not seen it', () => {
    expect(setup().current.phase).toBe('invite');
  });

  it('does not offer it again after the person declined', () => {
    const result = setup();
    act(() => result.current.decline());
    expect(result.current.phase).toBe('idle');
    expect(setup().current.phase).toBe('idle');
  });

  it('walks the steps forward and back, and closes at the end', () => {
    const result = setup();
    act(() => result.current.accept());
    expect(result.current).toMatchObject({ phase: 'tour', index: 0, isFirst: true, total: STEPS.length });

    act(() => result.current.next());
    expect(result.current.step?.id).toBe('nav/resumen');
    act(() => result.current.previous());
    expect(result.current.isFirst).toBe(true);
    act(() => result.current.previous());
    expect(result.current.index).toBe(0);

    for (let i = 0; i < STEPS.length - 1; i += 1) act(() => result.current.next());
    expect(result.current.isLast).toBe(true);
    act(() => result.current.next());
    expect(result.current.phase).toBe('idle');
  });

  it('can be started on request, even if it was already seen', () => {
    window.localStorage.setItem('fiaro:tutorial:v1:u1', 'x');
    const result = setup();
    expect(result.current.phase).toBe('idle');

    act(() => {
      window.dispatchEvent(new Event(START_TUTORIAL_EVENT));
    });
    expect(result.current.phase).toBe('tour');
    expect(result.current.index).toBe(0);
  });
});
