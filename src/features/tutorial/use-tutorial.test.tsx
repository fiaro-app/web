import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';
import { buildTutorialSteps } from './tutorial-steps';
import { START_PAGE_GUIDE_EVENT, START_TUTORIAL_EVENT } from './tutorial-storage';
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

  it('starts the guide of the screen with its own steps', () => {
    const guide = [{ id: 'g1', target: '#x', title: 'Uno', body: 'Cuerpo' }];
    window.localStorage.setItem('fiaro:tutorial:v1:u1', 'x');
    const { result } = renderHook(() => useTutorial({ userId: 'u1', steps: STEPS, resolvePageGuide: () => guide }));

    act(() => {
      window.dispatchEvent(new Event(START_PAGE_GUIDE_EVENT));
    });
    expect(result.current).toMatchObject({ phase: 'tour', total: 1 });
    expect(result.current.step?.id).toBe('g1');
  });

  it('falls back to the general tour when the screen has no guide', () => {
    window.localStorage.setItem('fiaro:tutorial:v1:u1', 'x');
    const { result } = renderHook(() => useTutorial({ userId: 'u1', steps: STEPS, resolvePageGuide: () => [] }));

    act(() => {
      window.dispatchEvent(new Event(START_PAGE_GUIDE_EVENT));
    });
    expect(result.current.total).toBe(STEPS.length);
  });
});
