import { describe, expect, it, vi } from 'vitest';
import { hasSeenTutorial, markTutorialSeen } from './tutorial-storage';

const memory = () => {
  const data = new Map<string, string>();
  return { getItem: (key: string) => data.get(key) ?? null, setItem: (key: string, value: string) => void data.set(key, value) };
};

describe('tutorial storage', () => {
  it('offers the tutorial until the person decides, and then remembers it per person', () => {
    const storage = memory();
    expect(hasSeenTutorial('u1', storage)).toBe(false);

    markTutorialSeen('u1', storage);
    expect(hasSeenTutorial('u1', storage)).toBe(true);
    expect(hasSeenTutorial('u2', storage)).toBe(false);
  });

  it('does not insist when the storage is not available', () => {
    expect(hasSeenTutorial('u1', null)).toBe(true);
    expect(() => markTutorialSeen('u1', null)).not.toThrow();
  });

  it('does not break when the storage throws', () => {
    const broken = { getItem: vi.fn(() => { throw new Error('bloqueado'); }), setItem: vi.fn(() => { throw new Error('bloqueado'); }) };
    expect(hasSeenTutorial('u1', broken)).toBe(true);
    expect(() => markTutorialSeen('u1', broken)).not.toThrow();
  });
});
