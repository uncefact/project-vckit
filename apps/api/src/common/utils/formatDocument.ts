export const removePropertyFromObject = (
  object: Record<string, unknown>,
  propertyToRemove: string
) => {
  return JSON.parse(
    JSON.stringify(object, (key, value) =>
      key == propertyToRemove ? undefined : value
    )
  );
};
