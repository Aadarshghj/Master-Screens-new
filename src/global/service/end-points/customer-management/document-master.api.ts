import type {
  DocumentMasterRequestDto,
  DocumentMasterResponseDto,
} from "@/types/customer-management/document-master";
import { apiInstance } from "../../api-instance";
import { api } from "@/api";

export const documentMasterApiService = apiInstance.injectEndpoints({
  endpoints: build => ({
    saveDocumentMaster: build.mutation<
      DocumentMasterResponseDto,
      DocumentMasterRequestDto
    >({
      query: payload => ({
        url: api.documentMaster.save(),
        method: "POST",
        data: payload,
      }),
      invalidatesTags: ["DocumentMaster"],
    }),

    getDocumentMasters: build.query<DocumentMasterResponseDto[], void>({
      query: () => ({
        url: api.documentMaster.get(),
        method: "GET",
      }),
      providesTags: ["DocumentMaster"],
    }),
    deleteDocumentMaster: build.mutation<void, string>({
      query: identity => ({
        url: `${api.documentMaster.get()}/${identity}`,
        method: "DELETE",
      }),
      invalidatesTags: ["DocumentMaster"],
    }),
  }),
});

export const {
  useSaveDocumentMasterMutation,
  useGetDocumentMastersQuery,
  useDeleteDocumentMasterMutation,
} = documentMasterApiService;
