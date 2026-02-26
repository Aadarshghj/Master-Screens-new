export const referralSources = {
  save: () => "/api/v1/master/referral_source",
  get: () => "/api/v1/master/referral_source",
  delete: (id: string) => `/api/v1/master/referral_source/${id}`,
};
