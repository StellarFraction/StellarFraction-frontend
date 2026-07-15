import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import PortfolioInsights from './PortfolioInsights';

describe('PortfolioInsights', () => {
  it('renders summary metrics for the portfolio pulse', () => {
    render(
      <PortfolioInsights
        snapshot={{
          totalStakedShares: 250,
          totalProjectedAnnualIncome: 48,
          topYieldName: 'Oakridge Tech Hub',
        }}
        wallet={{ balanceUSDC: 5000 }}
      />,
    );

    expect(screen.getByRole('heading', { name: /portfolio pulse/i })).toBeInTheDocument();
    expect(screen.getByText('250 shares')).toBeInTheDocument();
    expect(screen.getByText('Oakridge Tech Hub')).toBeInTheDocument();
  });
});
