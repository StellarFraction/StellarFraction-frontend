import { describe, expect, it } from 'vitest';
import { calculatePortfolioSnapshot } from './portfolio';

describe('calculatePortfolioSnapshot', () => {
  it('summarizes active positions and watchlist coverage', () => {
    const properties = [
      { id: 1, name: 'The Horizon Tower', apy: 8.5, value: 1000000, userShares: 120 },
      { id: 2, name: 'Oakridge Tech Hub', apy: 9.1, value: 800000, userShares: 80 },
      { id: 3, name: 'Omni Retail Center', apy: 7.8, value: 600000, userShares: 0 },
    ];

    const snapshot = calculatePortfolioSnapshot(properties, [1, 2], { connected: true, balanceUSDC: 5000 });

    expect(snapshot.totalStakedShares).toBe(200);
    expect(snapshot.totalProjectedAnnualIncome).toBeCloseTo(120 * 0.085 + 80 * 0.091);
    expect(snapshot.watchlistCoverage).toBeCloseTo(66.6666666667);
    expect(snapshot.topYieldName).toBe('Oakridge Tech Hub');
  });
});
