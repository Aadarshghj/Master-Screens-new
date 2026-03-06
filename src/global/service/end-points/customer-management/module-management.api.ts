import type { 
  ModuleType, 
  ModuleMgmtRequestDto,
  ModuleMgmtResponseDto 
} from "@/types/customer-management/module-management";
import { apiInstance } from "../../api-instance";
import { api } from "@/api";

export const moduleMgmtApiService = apiInstance.injectEndpoints({
  endpoints: build => ({ 
    getModuleData: build.query<ModuleType[], void>({
      query: () => ({
        url: api.moduleMgmt.get(),
        method: "GET",
      }),
      providesTags: ["ModuleMgmt"],

      transformResponse: (response: ModuleMgmtResponseDto[]): ModuleType[] => {
            return response.map(item => ({
              identity: item.identity,
              moduleCode: item.moduleCode,
              moduleName: item.moduleName,
              description: item.description,
              isActive : item.isActive,
            }));      
        },
    }),
    getModuleById: build.query<ModuleType, string>({
      query: (moduleIdentity) => ({
        url: api.moduleMgmt.getById(moduleIdentity),
        method: "GET",
      }),
      providesTags: ["ModuleMgmt"],

      transformResponse: (response: ModuleMgmtResponseDto): ModuleType => ({
        identity: response.identity,
        moduleCode: response.moduleCode,
        moduleName: response.moduleName,
        description: response.description,
        isActive : response.isActive,
      }),
    }),

    saveModule: build.mutation<{message?: string; data: ModuleType}, ModuleMgmtRequestDto>({
      query: (payload) => ({
        url: api.moduleMgmt.save(),
        method: "POST",
        data: payload,
      }),
      invalidatesTags: ["ModuleMgmt"],

      transformResponse: (response: any) => ({
        message: response.message,
        data:{
          identity: response.identity,       
          moduleCode: response.moduleCode,
          moduleName: response.moduleName,
          description: response.description,
          isActive: response.isActive,
        }
      }),
    }), 

    updateModule: build.mutation<
    { message?: string; data?:ModuleMgmtResponseDto },
    { identity: string; payload: ModuleMgmtRequestDto }>({
      query: ({identity, payload}) => ({
        url: api.moduleMgmt.update(identity),
        method: "PUT",
        data: payload,
      }),
      invalidatesTags: ["ModuleMgmt"],
      
    }),

    deleteModule: build.mutation<{ message?: string }, string>({
      query: (moduleIdentity) => ({
        url: api.moduleMgmt.delete(moduleIdentity),
        method: "DELETE",
      }),
      invalidatesTags: ["ModuleMgmt"],
    }),
  }),
});

export const {
  useGetModuleDataQuery,
  useSaveModuleMutation,
  useLazyGetModuleByIdQuery,
  useUpdateModuleMutation,
  useDeleteModuleMutation,
} = moduleMgmtApiService;