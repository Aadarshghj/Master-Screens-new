import type { menuSubmenu, menuSubmenuDto, menuSubmenuResponseDto } from "@/types/customer-management/create-manage-menus-submenu.type";
import { apiInstance } from "../../api-instance";

import { api } from "@/api";

export const menuSubmenuApiService = apiInstance.injectEndpoints({
  endpoints: build => ({
    saveMenuSubmenu: build.mutation<
      menuSubmenu,
      menuSubmenuDto
    >({
      query: payload => ({
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
        response.map(item => ({
          menuName: item.menuName,
          menucode: item.menucode,
          description: item.description,
          menuOrder: item.menuOrder,
          parentMenu: item.parentMenu,
          url: item.url,
          pageurl: item.pageurl,
          isActive: item.isActive,
          menuIdentity: item.menuIdentity
        })),
    }),

    getMenuSubmenuById: build.query<menuSubmenu, string>({
      query: menuIdentity => ({
        url: api.menuSubmenu.getById(menuIdentity),
        method: "GET",
      }),
      providesTags: ["MenuSubMenu"],

      transformResponse: (
        response: menuSubmenuResponseDto
      ): menuSubmenu => ({
        menuName: response.menuName,
        menucode: response.menucode,
        description: response.description,
        menuOrder: response.menuOrder,
        parentMenu: response.parentMenu,
        url: response.url,
        pageurl: response.pageurl,
        menuIdentity: response.menuIdentity,
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
      query: roleName => ({
        url: api.menuSubmenu.delete(roleName),
        method: "DELETE",
      }),
      invalidatesTags: ["MenuSubMenu"],
    }),
  }),
});

export const {
  useSaveMenuSubmenuMutation,
  useUpdateMenuSubmenuMutation,
  useLazyGetMenuSubmenuByIdQuery,
  useDeleteMenuSubmenuMutation,
  useGetMasterMenuSubmenuQuery
} = menuSubmenuApiService;




