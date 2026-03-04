export const sectoralPerformances = {
  save: () => "/api/v1/master/sectoral-performances",
  get: () => "/api/v1/master/sectoral-performances",
  delete: (identity: string) =>
    `/api/v1/master/${identity}/sectoral-performances`,
};
