export const findPropertyById = (properties, propertyId) => (
  properties.find(property => property.id === Number(propertyId))
);
