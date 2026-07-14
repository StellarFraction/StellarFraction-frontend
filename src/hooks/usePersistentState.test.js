import { act, renderHook } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { usePersistentState } from './usePersistentState';

describe('usePersistentState', () => {
  afterEach(() => {
    window.localStorage.clear();
  });

  it('uses and persists the default value when storage is empty', () => {
    const { result } = renderHook(() => usePersistentState('preference', []));

    expect(result.current[0]).toEqual([]);
    expect(window.localStorage.getItem('preference')).toBe('[]');
  });

  it('restores a value from local storage', () => {
    window.localStorage.setItem('preference', JSON.stringify([2, 3]));

    const { result } = renderHook(() => usePersistentState('preference', []));

    expect(result.current[0]).toEqual([2, 3]);
  });

  it('falls back to the default when stored JSON is malformed', () => {
    window.localStorage.setItem('preference', '{not-json');

    const { result } = renderHook(() => usePersistentState('preference', [1]));

    expect(result.current[0]).toEqual([1]);
    expect(window.localStorage.getItem('preference')).toBe('[1]');
  });

  it('persists state updates', () => {
    const { result } = renderHook(() => usePersistentState('preference', []));

    act(() => result.current[1]([1]));

    expect(window.localStorage.getItem('preference')).toBe('[1]');
  });

  it('falls back to the default value when localStorage is unavailable', async () => {
    const original = Object.getOwnPropertyDescriptor(window, 'localStorage');
    Object.defineProperty(window, 'localStorage', {
      configurable: true,
      get() {
        throw new Error('SecurityError');
      },
    });

    try {
      vi.resetModules();
      const { usePersistentState: hook } = await import('./usePersistentState');

      const { result } = renderHook(() => hook('preference', [7]));
      expect(result.current[0]).toEqual([7]);

      act(() => result.current[1]([8]));
      expect(result.current[0]).toEqual([8]);
    } finally {
      if (original) {
        Object.defineProperty(window, 'localStorage', original);
      } else {
        delete window.localStorage;
      }
    }
  });
});
