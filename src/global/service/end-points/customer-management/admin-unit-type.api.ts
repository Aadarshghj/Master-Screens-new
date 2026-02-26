import type { 
  AdminUnitType, 
  AdminUnitRequestDto, 
  AdminUnitResponseDto, 
} from "@/types/customer-management/admin-unit-type";
import { apiInstance } from "../../api-instance";
import { api } from "@/api";

export const adminUnitTypeApiService = apiInstance.injectEndpoints({
  endpoints: build => ({ 
    getAdminUnitData: build.query<AdminUnitType[], void>({
      query: () => ({
        url: api.adminUnitType.get(),
        method: "GET",
      }),
      providesTags: ["AdminUnitType"],

      transformResponse: (response: AdminUnitResponseDto[]): AdminUnitType[] => {
            return response.map(item => ({
              identity: item.identity,
              adminUnitCode: item.code,
              adminUnitType: item.name,
              description: item.description ?? "",
              isActive : item.isActive,
              hierarchyLevel: item.hierarchyLevel
            }));      
        },
    }),
    getAdminUnitById: build.query<AdminUnitType, string>({
      query: (adminUnitTypeIdentity) => ({
        url: api.adminUnitType.getById(adminUnitTypeIdentity),
        method: "GET",
      }),
      providesTags: ["AdminUnitType"],

      transformResponse: (response: AdminUnitResponseDto): AdminUnitType => ({
        identity: response.identity,
        adminUnitCode: response.code,
        adminUnitType: response.name,
        description: response.description ?? "",
        isActive : response.isActive,
        hierarchyLevel: response.hierarchyLevel
      }),
    }),

    saveAdminUnitType: build.mutation<{message?: string; data: AdminUnitType}, AdminUnitRequestDto>({
      query: (payload) => ({
        url: api.adminUnitType.save(),
        method: "POST",
        data: payload,
      }),
      invalidatesTags: ["AdminUnitType"],

      transformResponse: (response: any) => ({
        message: response.message,
        data:{
          identity: response.identity,       
          adminUnitCode: response.code,
          adminUnitType: response.name,
          description: response.description ?? "",
          isActive: response.isActive,
          hierarchyLevel: response.hierarchyLevel
        }
      }),
    }), 

    updateAdminUnitType: build.mutation<
    { message?: string; data?:AdminUnitResponseDto },
    { identity: string; payload: AdminUnitRequestDto }>({
      query: ({identity, payload}) => ({
        url: api.adminUnitType.update(identity),
        method: "PUT",
        data: payload,
      }),
      invalidatesTags: ["AdminUnitType"],
      
    }),  

    deleteAdminUnitData: build.mutation<{ message?: string }, string>({
      query: (adminUnitTypeIdentity) => ({
        url: api.adminUnitType.delete(adminUnitTypeIdentity),
        method: "DELETE",
      }),
      invalidatesTags: ["AdminUnitType"],
    }),
  }),
});

export const {
  useGetAdminUnitDataQuery,
  useSaveAdminUnitTypeMutation,
  useLazyGetAdminUnitByIdQuery,
  useUpdateAdminUnitTypeMutation,
  useDeleteAdminUnitDataMutation,
} = adminUnitTypeApiService;