import type {
  menuSubmenu,
  menuSubmenuDto,
  menuSubmenuResponseDto,
  ParentMenu,
  ParentMenuResponseDto,
} from "@/types/customer-management/create-manage-menus-submenu.type";

import { apiInstance } from "../../api-instance";
import { api } from "@/api";


export const menuSubmenuApiService = apiInstance.injectEndpoints({
  endpoints: (build) => ({
    
 
    saveMenuSubmenu: build.mutation<menuSubmenu, menuSubmenuDto>({
      query: (payload) => ({
        url: api.menuSubmenu.save(),
        method: "POST",
        data: payload,
      }),
      invalidatesTags: ["MenuSubMenu"],
    }),

    
    getMasterMenuSubmenu: build.query<menuSubmenu[], void>({
      query: () => ({
        url: api.menuSubmenu.get(),
        method: "GET",
      }),

      providesTags: ["MenuSubMenu"],

      transformResponse: (
        response: menuSubmenuResponseDto[]
      ): menuSubmenu[] =>
        response.map((item) => ({
          menuName: item.menuName,
          menuCode: item.menuCode,
          description: item.description,
          menuOrder: item.menuOrder,
          parentMenu: item.parent?.identity,
          isUrl: item.isUrl,
          pageUrl: item.pageUrl,
          isActive: item.isActive,
           identity: item.identity, 
        })),
    }),

    getMenuSubmenuById: build.query<menuSubmenu, string>({
      query: (menuIdentity) => ({
        url: api.menuSubmenu.getById(menuIdentity),
        method: "GET",
      }),

      providesTags: ["MenuSubMenu"],

      transformResponse: (
        response: menuSubmenuResponseDto
      ): menuSubmenu => ({
        menuName: response.menuName,
        menuCode: response.menuCode,
        description: response.description,
        menuOrder: response.menuOrder,
        parentMenu: response.parent?.identity,
        isUrl: response.isUrl,
        pageUrl: response.pageUrl,
       identity: response.identity,
        isActive: response.isActive,
      }),
    }),

    updateMenuSubmenu: build.mutation<
      menuSubmenuResponseDto,
      { menuIdentity: string; payload: menuSubmenuDto }
    >({
      query: ({ menuIdentity, payload }) => ({
        url: api.menuSubmenu.update(menuIdentity),
        method: "PUT",
        data: payload,
      }),
      invalidatesTags: ["MenuSubMenu"],
    }),


    deleteMenuSubmenu: build.mutation<void, string>({
      query: (menuIdentity) => ({
        url: api.menuSubmenu.delete(menuIdentity),
        method: "DELETE",
      }),
      invalidatesTags: ["MenuSubMenu"],
    }),

    getParentMenus: build.query<ParentMenu[], void>({
      query: () => ({
        url: api.menuSubmenu.parent(),
        method: "GET",
      }),

      providesTags: ["MenuSubMenu"],

      transformResponse: (
        response: ParentMenuResponseDto[]
      ): ParentMenu[] =>
        response.map((item) => ({
          identity: item.identity,
          menuName: item.menuName,
          parent: item.parent,
        })),
    }),

  }),
});

export const {
  useSaveMenuSubmenuMutation,
  useUpdateMenuSubmenuMutation,
  useLazyGetMenuSubmenuByIdQuery,
  useDeleteMenuSubmenuMutation,
  useGetMasterMenuSubmenuQuery,
  useGetParentMenusQuery,
} = menuSubmenuApiService;