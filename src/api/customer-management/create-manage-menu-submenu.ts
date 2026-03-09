export const menuSubmenu = {
  save: () => "/api/v1/master/menu-details",
  get: () => "/api/v1/master/menu-details",
  delete: (identity: string) => `/api/v1/${identity}/menu-details`,
  update: (identity: string) => `/api/v1/menu-details/${identity}`,
  getById: (identity: string) => `/api/v1/menu-details/${identity}`,
  parent:()=>"/api/v1/master/menu-details/parent-menus"
};

