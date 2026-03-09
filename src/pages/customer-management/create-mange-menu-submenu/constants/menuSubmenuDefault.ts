import type { menuSubmenu } from "@/types/customer-management/create-manage-menus-submenu.type";

export const MENU_SUBMENU_DEFAULT_VALUES: menuSubmenu = {
  menuName: "",
  menuCode: "",
  description: "",
  menuOrder: "",
  parent: "",
  isUrl: false,
  pageUrl: "",
  isActive: true,
  identity: ""
};
