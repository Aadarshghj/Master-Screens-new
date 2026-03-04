export const occupation = {
  save: () => "/api/v1/master/occupations",
  get: () => "/api/v1/master/occupations",
  delete: (occupationId: string) =>
    `/api/v1/master/occupations/${occupationId}`,
};
