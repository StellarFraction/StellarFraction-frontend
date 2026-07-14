import { describe, expect, it } from 'vitest';
import { calculatePendingReward } from './math';

describe('calculatePendingReward', () => {
  it('returns 0 when shares are zero', () => {
    expect(calculatePendingReward(0, 1e12, 0)).toBe(0);
  });

  it('returns 0 when shares are negative', () => {
    expect(calculatePendingReward(-5, 1e12, 0)).toBe(0);
  });

  it('returns 0 for non-numeric shares', () => {
    expect(calculatePendingReward('abc', 1e12, 0)).toBe(0);
    expect(calculatePendingReward(NaN, 1e12, 0)).toBe(0);
  });

  it('computes the pending reward with the default scale factor', () => {
    // accumulated = shares * accRewardPerShare / scaleFactor = 100 * 1e12 / 1e12 = 100
    expect(calculatePendingReward(100, 1e12, 0)).toBe(100);
  });

  it('subtracts the accumulated reward debt', () => {
    expect(calculatePendingReward(100, 1e12, 30)).toBe(70);
  });

  it('never returns a negative value when debt exceeds accumulated', () => {
    expect(calculatePendingReward(100, 1e12, 150)).toBe(0);
  });

  it('honours a custom scale factor', () => {
    // scaleFactor = 1e6 -> accumulated = 100 * 1e6 / 1e6 = 100
    expect(calculatePendingReward(100, 1e6, 0, 1e6)).toBe(100);
  });

  it('accepts stringified numeric inputs', () => {
    expect(calculatePendingReward('100', '1e12', '0')).toBe(100);
  });
});
