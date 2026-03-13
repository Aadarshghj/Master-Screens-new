export const MenuTree = {
  create: () =>"/api/v1/master/menu-details",
  getTree: () => "/api/v1/master/menu-details",
  delete: (identity: string) => `/api/v1/menu-details/${identity}`,
  update: (identity: string) => `/api/v1/menu-details/${identity}`,
  getById: (identity: string) => `/api/v1/menu-details/${identity}`,
  getParents:()=>"/api/v1/master/menu-details/parent-menus"
};
