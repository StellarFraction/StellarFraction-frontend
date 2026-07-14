import { describe, expect, it } from 'vitest';
import { toggleWatchlistId } from './properties';

describe('toggleWatchlistId', () => {
  it('adds a property that is not saved', () => {
    expect(toggleWatchlistId([1], 2)).toEqual([1, 2]);
  });

  it('removes a property that is already saved', () => {
    expect(toggleWatchlistId([1, 2], 1)).toEqual([2]);
  });
});
