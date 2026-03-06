export const menuSubmenu = {
  save: () => "/api/v1/master/menu-details  ",
  get: () => "/api/v1/master/menu-details",
  delete: (menuIdentity: string) => `/api/v1/${menuIdentity}/menu-details`,
  update: (menuIdentity: string) => ` /api/v1/menu-details/${menuIdentity}`,
  getById: (menuIdentity: string) => `/api/v1/menu-details/${menuIdentity}`,
};



