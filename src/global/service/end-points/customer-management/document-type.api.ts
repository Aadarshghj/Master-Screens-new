import type {
  DocumentTypeRequestDto,
  DocumentTypeResponseDto,
} from "@/types/customer-management/document-type";
import { apiInstance } from "../../api-instance";
import { api } from "@/api";

export const documentTypeApiService = apiInstance.injectEndpoints({
  endpoints: build => ({
    saveDocumentType: build.mutation<
      DocumentTypeResponseDto,
      DocumentTypeRequestDto
    >({
      query: payload => ({
        url: api.documentType.save(),
        method: "POST",
        data: payload,
      }),
      invalidatesTags: [{ type: "DocumentType", id: "LIST" }],
    }),

    getDocumentTypes: build.query<DocumentTypeResponseDto[], void>({
      query: () => ({
        url: api.documentType.get(),
        method: "GET",
      }),
      providesTags: result =>
        result
          ? [
              ...result.map(item => ({
                type: "DocumentType" as const,
                id: item.identity,
              })),
              { type: "DocumentType", id: "LIST" },
            ]
          : [{ type: "DocumentType", id: "LIST" }],
    }),

    deleteDocumentType: build.mutation<void, string>({
      query: identity => ({
        url: `${api.documentType.get()}/${identity}`,
        method: "DELETE",
      }),
      invalidatesTags: (_r, _e, identity) => [
        { type: "DocumentType", id: identity },
        { type: "DocumentType", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useSaveDocumentTypeMutation,
  useGetDocumentTypesQuery,
  useDeleteDocumentTypeMutation,
} = documentTypeApiService;
