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
          menuCode: item.menuCode,
          description: item.description,
          menuOrder: item.menuOrder,
          parent: item.parent,
          isUrl: item.isUrl,
          pageUrl: item.pageUrl,
          isActive: item.isActive,
          identity: item.identity
        })),
    }),

    getMenuSubmenuById: build.query<menuSubmenu, string>({
      query: identity => ({
        url: api.menuSubmenu.getById(identity),
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
        parent: response.parent,
        isUrl: response.isUrl,
        pageUrl: response.pageUrl,
        identity: response.identity,
        isActive: response.isActive,
      }),
    }),

    updateMenuSubmenu: build.mutation<
      menuSubmenuResponseDto,
      { identity: string; payload: menuSubmenuDto }
    >({
      query: ({ identity, payload }) => ({
        url: api.menuSubmenu.update(identity),
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




