import { toNumber } from './math';

const normalizePropertyId = (propertyId) => Number(propertyId);

const normalizeWatchlistIds = (watchlistIds = []) => (
  watchlistIds
    .map((id) => normalizePropertyId(id))
    .filter((id) => Number.isFinite(id))
);

/**
 * Finds a property by its identifier.
 *
 * @param {Array} [properties=[]] - List of properties.
 * @param {number|string} propertyId - Property identifier.
 * @returns {Object|undefined} The matching property if found.
 */
export const findPropertyById = (properties = [], propertyId) => (
  properties.find(property => property.id === normalizePropertyId(propertyId))
);


/**
 * Adds or removes a property ID from the watchlist.
 *
 * @param {Array} [watchlistIds=[]] - Current watchlist IDs.
 * @param {number|string} propertyId - Property identifier.
 * @returns {number[]} Updated watchlist IDs.
 */
export const toggleWatchlistId = (watchlistIds = [], propertyId) => {
  const targetId = normalizePropertyId(propertyId);
  const ids = normalizeWatchlistIds(watchlistIds);

  return ids.includes(targetId)
    ? ids.filter(id => id !== targetId)
    : [...ids, targetId];
};


/**
 * Removes watchlist IDs that no longer correspond to available properties.
 *
 * @param {Array} [watchlistIds=[]] - Current watchlist IDs.
 * @param {Array} [properties=[]] - Available properties.
 * @returns {Array} Filtered watchlist IDs.
 */
export const pruneUnavailableWatchlistIds = (watchlistIds = [], properties = []) => {
  const availableIds = new Set(properties.map(property => property.id));
  const normalizedIds = normalizeWatchlistIds(watchlistIds);
  const validIds = normalizedIds.filter(id => availableIds.has(id));
  const allIdsValid = normalizedIds.every(id => availableIds.has(id));

  return allIdsValid ? watchlistIds : validIds;
};


/**
 * Builds comparison data for properties in the user's watchlist.
 *
 * @param {Array} [properties=[]] - Available properties.
 * @param {Array} [watchlistIds=[]] - Selected watchlist IDs.
 * @param {number} investmentAmount - Investment amount.
 * @returns {Array} Comparison data for the selected properties.
 */
export const buildWatchlistComparison = (properties = [], watchlistIds = [], investmentAmount) => {
  const amount = Math.max(0, toNumber(investmentAmount));
  const normalizedIds = normalizeWatchlistIds(watchlistIds);
  const savedProperties = normalizedIds
    .map(propertyId => findPropertyById(properties, propertyId))
    .filter(Boolean);

  if (savedProperties.length === 0) {
    return [];
  }

  const bestApy = Math.max(0, ...savedProperties.map(property => toNumber(property.apy)));

  return savedProperties.map(property => {
    const annualIncome = amount * (toNumber(property.apy) / 100);

    return {
      ...property,
      annualIncome,
      monthlyIncome: annualIncome / 12,
      ownershipPercent: toNumber(property.value) > 0 ? (amount / toNumber(property.value)) * 100 : 0,
      isYieldLeader: toNumber(property.apy) === bestApy,
    };
  });
};
