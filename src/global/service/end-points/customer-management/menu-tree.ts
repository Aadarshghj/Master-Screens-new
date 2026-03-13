import { MenuTree } from "@/api/customer-management/menu-tree";
import { apiInstance } from "../../api-instance";


import type {
  menuSubmenu,
  menuSubmenuDto,
  menuSubmenuResponseDto,
  ParentMenu,
  ParentMenuResponseDto,
} from "@/types/customer-management/create-manage-menus-submenu.type";

export const menuTreeApiService = apiInstance.injectEndpoints({
  endpoints: (build) => ({

    // GET MENU TREE
    getMenuTree: build.query<menuSubmenu[], void>({
      query: () => ({
        url: MenuTree.getTree(),
        method: "GET",
      }),

      providesTags: ["MenuTree"],
transformResponse: (response: menuSubmenuResponseDto[]): menuSubmenu[] =>
  response.map((item) => ({
    menuName: item.menuName,
    menuCode: item.menuCode,
    description: item.description,
    menuOrder: item.menuOrder,
    parent: item.parent,
    isUrl: item.isUrl,
    pageUrl: item.pageUrl,
    isActive: item.isActive,
    menuIdentity: item.identity,  
  })),
    }),

    // GET PARENT MENUS
    getParentMenus: build.query<ParentMenu[], void>({
      query: () => ({
        url: MenuTree.getParents(),
        method: "GET",
      }),

      providesTags: ["MenuTree"],

      transformResponse: (
        response: ParentMenuResponseDto[]
      ): ParentMenu[] =>
        response.map((item) => ({
          identity: item.identity,
          menuName: item.menuName,
          parent: item.parent,
        })),
    }),

    // CREATE MENU
    createMenu: build.mutation<menuSubmenu, menuSubmenuDto>({
      query: (payload) => ({
        url: MenuTree.create(),
        method: "POST",
        data: payload,
      }),
      invalidatesTags: ["MenuTree"],
    }),

    // UPDATE MENU
    updateMenu: build.mutation<
      menuSubmenuResponseDto,
      { identity: string; payload: menuSubmenuDto }
    >({
      query: ({ identity, payload }) => ({
        url: MenuTree.update(identity),
        method: "PUT",
        data: payload,
      }),
      invalidatesTags: ["MenuTree"],
    }),

    // DELETE MENU
    deleteMenu: build.mutation<void, string>({
      query: (identity) => ({
        url: MenuTree.delete(identity),
        method: "DELETE",
      }),
      invalidatesTags: ["MenuTree"],
    }),

  }),
});

export const {
  useGetMenuTreeQuery,
  useGetParentMenusQuery,
  useCreateMenuMutation,
  useUpdateMenuMutation,
  useDeleteMenuMutation,
} = menuTreeApiService;