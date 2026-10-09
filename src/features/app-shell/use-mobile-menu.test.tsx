import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const { pathname } = vi.hoisted(() => ({ pathname: vi.fn<() => string>() }));
vi.mock('next/navigation', () => ({ usePathname: pathname }));

import { useMobileMenu } from './use-mobile-menu';

beforeEach(() => {
  pathname.mockReturnValue('/resumen');
  document.body.style.overflow = '';
});

describe('useMobileMenu', () => {
  it('starts closed, opens and closes', () => {
    const { result } = renderHook(() => useMobileMenu());
    expect(result.current.isOpen).toBe(false);

    act(() => result.current.open());
    expect(result.current.isOpen).toBe(true);

    act(() => result.current.close());
    expect(result.current.isOpen).toBe(false);
  });

  it('locks the page scroll while open and restores it after', () => {
    const { result } = renderHook(() => useMobileMenu());

    act(() => result.current.open());
    expect(document.body.style.overflow).toBe('hidden');

    act(() => result.current.close());
    expect(document.body.style.overflow).toBe('');
  });

  it('closes with Escape', () => {
    const { result } = renderHook(() => useMobileMenu());
    act(() => result.current.open());

    act(() => {
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    });

    expect(result.current.isOpen).toBe(false);
  });

  it('closes by itself when the route changes', () => {
    const { result, rerender } = renderHook(() => useMobileMenu());
    act(() => result.current.open());

    pathname.mockReturnValue('/clientes');
    rerender();

    expect(result.current.isOpen).toBe(false);
  });
});
