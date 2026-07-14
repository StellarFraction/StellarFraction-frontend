import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { INITIAL_PROPERTIES } from '../data/properties';
import PropertyCard from './PropertyCard';

const disconnectedWallet = {
  address: '',
  balanceUSDC: 0,
  balanceShares: 0,
  connected: false,
};

const renderCatalog = (watchlistIds = []) => {
  const onToggleWatchlist = vi.fn();

  render(
    <PropertyCard
      properties={INITIAL_PROPERTIES}
      wallet={disconnectedWallet}
      watchlistIds={watchlistIds}
      onToggleWatchlist={onToggleWatchlist}
      onClearWatchlist={vi.fn()}
      onInvest={vi.fn()}
      onWithdrawShares={vi.fn()}
    />,
  );

  return { onToggleWatchlist };
};

describe('PropertyCard watchlist', () => {
  it('announces and toggles a saved property', async () => {
    const user = userEvent.setup();
    const { onToggleWatchlist } = renderCatalog([1]);
    const saveButton = screen.getByRole('button', {
      name: /remove the horizon tower from watchlist/i,
    });

    expect(saveButton).toHaveAttribute('aria-pressed', 'true');
    await user.click(saveButton);

    expect(onToggleWatchlist).toHaveBeenCalledWith(1);
  });

  it('filters the catalog to saved properties', async () => {
    const user = userEvent.setup();
    renderCatalog([2]);

    await user.click(screen.getByRole('button', { name: /^saved$/i }));

    expect(screen.getByRole('heading', { name: 'Oakridge Tech Hub' })).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: 'The Horizon Tower' })).not.toBeInTheDocument();
  });

  it('shows guidance for an empty saved filter', async () => {
    const user = userEvent.setup();
    renderCatalog();

    await user.click(screen.getByRole('button', { name: /^saved$/i }));

    expect(screen.getByRole('heading', { name: /your watchlist is empty/i })).toBeInTheDocument();
  });
});
