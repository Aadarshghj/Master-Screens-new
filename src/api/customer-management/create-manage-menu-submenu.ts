export const menuSubmenu = {
  save: () =>"/api/v1/master/menu-details",
  get: () => "/api/v1/master/menu-details",
  delete: (identity: string) => `/api/v1/master/${identity}/menu-details`,
  update: (identity: string) => `/api/v1/master/menu-details/${identity}`,
  getById: (identity: string) => `/api/v1/master/menu-details/${identity}`,
  parent:()=>"/api/v1/master/menu-details/parent-menus"
};



