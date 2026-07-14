import { renderHook, act } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { DEFAULT_WATCHLIST, WATCHLIST_STORAGE_KEY } from '../constants/watchlist';
import { toggleWatchlistId } from '../utils/properties';
import { usePersistentState } from './usePersistentState';

const useWatchlistState = () => {
  const [watchlistIds, setWatchlistIds] = usePersistentState(
    WATCHLIST_STORAGE_KEY,
    DEFAULT_WATCHLIST,
  );

  const toggle = propertyId => {
    setWatchlistIds(currentIds => toggleWatchlistId(currentIds, propertyId));
  };

  return { watchlistIds, toggle };
};

describe('watchlist persistence', () => {
  afterEach(() => window.localStorage.clear());

  it('restores saved property ids in a new hook instance', () => {
    const firstRender = renderHook(() => useWatchlistState());
    act(() => firstRender.result.current.toggle(2));
    firstRender.unmount();

    const secondRender = renderHook(() => useWatchlistState());

    expect(secondRender.result.current.watchlistIds).toEqual([2]);
  });
});
