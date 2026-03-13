import type { 
  OrnamentNameData, 
  OrnamentNameRequestDto,
  OrnamentNameResponseDto, 
  OrnamentNameTable,
  OrnamentTypeResponseDto,
  OrnamentType,
  // Option
} from "@/types/customer-management/ornament-name";
import { apiInstance } from "../../api-instance";
import { api } from "@/api";

export const ornamentNameApiService = apiInstance.injectEndpoints({
  endpoints: build => ({ 
    getOrnamentName: build.query<OrnamentNameTable[], void>({
      query: () => ({
        url: api.ornamentName.get(),
        method: "GET",
      }),
      providesTags: ["OrnamentName"],

      transformResponse: (response: OrnamentNameResponseDto[]): OrnamentNameTable[] => {
           return response.map(item => ({
          identity: item.identity,
          ornamentType: item.ornamentType,
          ornamentCode: item.code,
          ornamentName: item.name,
          description: item.description,
          isActive: item.isActive,
        }));      
        },
    }),

    getOrnamentType: build.query<OrnamentType[], void>({
      query: () => ({ url: api.ornamentType.getType(), method: "GET" }),
        transformResponse: (response: OrnamentTypeResponseDto[]): OrnamentType[] =>
          response.map(item => ({
          identity: item.identity,
          name: item.name
        }))
    }),

    getOrnamentNameById: build.query<OrnamentNameData, string>({
      query: (ornamentNameIdentity) => ({
        url: api.ornamentName.getById(ornamentNameIdentity),
        method: "GET",
      }),
      providesTags: ["OrnamentName"],

      transformResponse: (response: OrnamentTypeResponseDto): OrnamentNameData => ({
        identity: response.identity!,
        ornamentTypeIdentity: response.ornamentType,
        ornamentCode: response.code!,
        ornamentName: response.name,
        description: response.description!,
        isActive : response.isActive!,
      }),
    }),

    saveOrnamentName: build.mutation<{message?: string; data: OrnamentNameTable}, OrnamentNameRequestDto>({
      query: (payload) => ({
        url: api.ornamentName.save(),
        method: "POST",
        data: payload,
      }),
      invalidatesTags: ["OrnamentName"],

      transformResponse: (response: any) => ({
        message: response.message,
        data:{
          identity: response.identity,
          ornamentType: response.ornamentTypeIdentity,
          ornamentCode: response.code,
          ornamentName: response.name,
          description: response.description,
          isActive : response.isActive,
        }
      }),
    }), 

    updateOrnamentName: build.mutation<
    { message?: string; data?:OrnamentNameResponseDto },
    { identity: string; payload: OrnamentNameRequestDto }>({
      query: ({identity, payload}) => ({
        url: api.ornamentName.update(identity),
        method: "PUT",
        data: payload,
      }),
      invalidatesTags: ["OrnamentName"],
      
    }),

    deleteOrnamentName: build.mutation<{ message?: string }, string>({
      query: (identity) => ({
        url: api.ornamentName.delete(identity),
        method: "DELETE",
      }),
      invalidatesTags: ["OrnamentName"],
    }),
  }),
});

export const {
  useGetOrnamentNameQuery,
  useSaveOrnamentNameMutation,
  useLazyGetOrnamentNameByIdQuery,
  useUpdateOrnamentNameMutation,
  useDeleteOrnamentNameMutation,
  useGetOrnamentTypeQuery,
} = ornamentNameApiService;