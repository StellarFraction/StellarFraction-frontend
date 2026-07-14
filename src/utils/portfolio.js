export const calculatePortfolioSnapshot = (properties = [], watchlistIds = [], wallet = {}) => {
  const normalizedProperties = Array.isArray(properties) ? properties : [];
  const activeProperties = normalizedProperties.filter((property) => {
    const shares = Number(property?.userShares ?? 0);
    return Number.isFinite(shares) && shares > 0;
  });
  const normalizedWatchlist = (Array.isArray(watchlistIds) ? watchlistIds : []).filter((id) => Number.isFinite(Number(id)));

  const totalStakedShares = activeProperties.reduce((sum, property) => sum + Number(property?.userShares ?? 0), 0);
  const totalProjectedAnnualIncome = activeProperties.reduce((sum, property) => {
    const shares = Number(property?.userShares ?? 0);
    const apy = Number(property?.apy ?? 0);
    return sum + (shares * (apy / 100));
  }, 0);

  const highestYieldProperty = activeProperties.reduce((highest, property) => {
    const apy = Number(property?.apy ?? 0);
    if (!Number.isFinite(apy)) return highest;
    if (!highest || apy > Number(highest.apy ?? 0)) {
      return property;
    }
    return highest;
  }, null);

  const totalProperties = normalizedProperties.length || 1;
  const watchlistCoverage = normalizedWatchlist.length > 0
    ? (normalizedWatchlist.length / totalProperties) * 100
    : 0;

  const fallbackName = highestYieldProperty?.name || highestYieldProperty?.tokenCode || (highestYieldProperty?.id ? `Property ${highestYieldProperty.id}` : 'No active positions');

  return {
    totalStakedShares,
    totalProjectedAnnualIncome,
    availableCash: Number(wallet?.balanceUSDC ?? 0),
    watchlistCoverage,
    topYieldName: fallbackName,
  };
};
