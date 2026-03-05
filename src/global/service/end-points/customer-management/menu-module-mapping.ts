import type {
  MenuModuleMappingRequestDto,
  MenuModuleMappingResponseDto,
  MenuDetailsResponseDto,
  ModuleResponseDto,
} from "@/types/customer-management/menu-module-mapping";
import { apiInstance } from "../../api-instance";
import { api } from "@/api";

export const menuModuleMappingApiService = apiInstance.injectEndpoints({
  endpoints: build => ({
    saveMenuModuleMapping: build.mutation<
      MenuModuleMappingResponseDto,
      MenuModuleMappingRequestDto
    >({
      query: payload => ({
        url: api.menuModuleMapping.save(),
        method: "POST",
        data: payload,
      }),
      invalidatesTags: ["MenuModuleMapping"],
    }),

    getMasterMenuModuleMapping: build.query<MenuModuleMappingResponseDto[], void>({
      query: () => ({
        url: api.menuModuleMapping.get(),
        method: "GET",
      }),
      providesTags: ["MenuModuleMapping"],

    }),

    deleteMenuModuleMapping: build.mutation<void, string>({
      query: id => ({
        url: api.menuModuleMapping.delete(id),
        method: "DELETE",
      }),
      invalidatesTags: ["MenuModuleMapping"],
    }),
     getMenus: build.query<MenuDetailsResponseDto[], void>({
      query: () => ({
        url: api.menuDetails.get(),
        method: "GET",
      }),
    }),
    getModules: build.query<ModuleResponseDto[], void>({
      query: () => ({
        url: api.modules.get(),
        method: "GET",
      }),
    }),
  }),
});

export const {
  useSaveMenuModuleMappingMutation,
  useGetMasterMenuModuleMappingQuery,
  useLazyGetMasterMenuModuleMappingQuery,
  useDeleteMenuModuleMappingMutation,
  
  useGetMenusQuery,
  useGetModulesQuery,
} = menuModuleMappingApiService;
