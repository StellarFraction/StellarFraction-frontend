export const findPropertyById = (properties, propertyId) => (
  properties.find(property => property.id === Number(propertyId))
);

export const toggleWatchlistId = (watchlistIds, propertyId) => (
  watchlistIds.includes(propertyId)
    ? watchlistIds.filter(id => id !== propertyId)
    : [...watchlistIds, propertyId]
);

export const pruneUnavailableWatchlistIds = (watchlistIds, properties) => {
  const availableIds = new Set(properties.map(property => property.id));
  const validIds = watchlistIds.filter(id => availableIds.has(id));

  return validIds.length === watchlistIds.length ? watchlistIds : validIds;
};

export const buildWatchlistComparison = (properties, watchlistIds, investmentAmount) => {
  const amount = Math.max(0, Number(investmentAmount) || 0);
  const savedProperties = watchlistIds
    .map(propertyId => findPropertyById(properties, propertyId))
    .filter(Boolean);
  const bestApy = Math.max(0, ...savedProperties.map(property => property.apy));

  return savedProperties.map(property => {
    const annualIncome = amount * (property.apy / 100);

    return {
      ...property,
      annualIncome,
      monthlyIncome: annualIncome / 12,
      ownershipPercent: property.value > 0 ? (amount / property.value) * 100 : 0,
      isYieldLeader: property.apy === bestApy,
    };
  });
};
