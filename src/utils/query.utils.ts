export const objectToQuery = (
  params: Record<string, string | number | boolean | null | undefined>
): string => {
  const query = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      query.append(key, String(value));
    }
  });

  return query.toString() ? `?${query.toString()}` : "";
};
