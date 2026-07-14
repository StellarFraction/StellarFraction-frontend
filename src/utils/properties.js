export const findPropertyById = (properties, propertyId) => (
  properties.find(property => property.id === Number(propertyId))
);

export const toggleWatchlistId = (watchlistIds, propertyId) => (
  watchlistIds.includes(propertyId)
    ? watchlistIds.filter(id => id !== propertyId)
    : [...watchlistIds, propertyId]
);
