import { apiInstance } from "../../api-instance";
import { api } from "@/api";
import type {
  SubModule,
  SubModuleRequestDto,
  SubModuleResponseDto,
} from "../../../../types/customer-management/sub-module-management-type";

import type {
  Module,
  ModuleResponseDto,
} from "../../../../types/customer-management/sub-module-management-type";

export const subModuleApiService = apiInstance.injectEndpoints({
  endpoints: build => ({
    // ✅ SAVE
    saveSubModule: build.mutation<SubModuleResponseDto, SubModuleRequestDto>({
      query: payload => ({
        url: api.subModule.save(),
        method: "POST",
        data: payload as unknown as Record<string, void>,
      }),
      invalidatesTags: ["SubModule"],
    }),

    getMasterModules: build.query<Module[], void>({
      query: () => ({
        url: api.module.getAll(),
        method: "GET",
      }),
      providesTags: ["Modules"],

      transformResponse: (response: ModuleResponseDto[]): Module[] =>
        response.map(item => ({
          id: item.identity,
          moduleName: item.moduleName,
          moduleCode: item.moduleCode,
          description: item.description,
          isActive: item.isActive,
        })),
    }),

    // ✅ GET ALL SUB-MODULES (For Table)
    getMasterSubModules: build.query<SubModule[], void>({
      query: () => ({
        url: api.subModule.get(),
        method: "GET",
      }),
      providesTags: ["SubModule"],
      transformResponse: (response: SubModuleResponseDto[]): SubModule[] =>
        response.map(item => ({
          id: item.identity,
          moduleName: item.moduleName,
          moduleId: item.modules,
          subModuleCode: item.subModuleCode,
          subModuleName: item.subModuleName,
          description: item.description,
          isActive: item.isActive,
        })),
    }),

    // ✅ UPDATE (PUT)
    updateSubModule: build.mutation<
      SubModule,
      { id: string; payload: SubModuleRequestDto }
    >({
      query: ({ id, payload }) => ({
        url: api.subModule.put(id),
        method: "PUT",
        data: payload as unknown as Record<string, void>,
      }),
      transformResponse: (item: SubModuleResponseDto): SubModule => ({
        id: item.identity,
        moduleName: item.moduleName,
        moduleId: item.modules,
        subModuleCode: item.subModuleCode,
        subModuleName: item.subModuleName,
        description: item.description,
        isActive: item.isActive,
      }),
      invalidatesTags: ["SubModule"],
    }),

    // ✅ DELETE
    deleteSubModule: build.mutation<void, string>({
      query: identity => ({
        url: api.subModule.delete(identity),
        method: "DELETE",
      }),
      invalidatesTags: ["SubModule"],
    }),
  }),
});

export const {
  useSaveSubModuleMutation,
  useGetMasterModulesQuery,
  useGetMasterSubModulesQuery,
  useLazyGetMasterSubModulesQuery,
  useDeleteSubModuleMutation,
  useUpdateSubModuleMutation,
} = subModuleApiService;
