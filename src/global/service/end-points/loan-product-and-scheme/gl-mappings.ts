import { apiInstance } from "../../api-instance";
import { api } from "@/api";
import type {
  GLType,
  GLAccount,
  GLMappingPayload,
  GLMappingResponse,
} from "@/types/loan-product-and schema Stepper/gl-mappings.types";

export const glMappingsApiService = apiInstance.injectEndpoints({
  endpoints: build => ({
    getGLTypes: build.query<GLType[], void>({
      query: () => ({
        url: api.loanStepper.getGLTypes(),
        method: "GET",
      }),
      transformResponse: (response: unknown) => {
        const responseObj = response as { data?: unknown[] } | unknown[];
        const data = Array.isArray(responseObj)
          ? responseObj
          : responseObj?.data || [];
        const transformed = data.map((item: unknown) => {
          const glType = item as {
            identity?: string;
            glAccountTypeName?: string;
          };
          return {
            value: glType.identity || "",
            label: glType.glAccountTypeName || "",
          };
        });

        return transformed;
      },
    }),

    getGLAccountsByType: build.query<GLAccount[], string>({
      query: glTypeId => ({
        url: api.loanStepper.getGLAccountsByType({ glTypeId }),
        method: "GET",
      }),
      transformResponse: (response: unknown) => {
        const responseObj = response as { data?: unknown[] } | unknown[];
        const data = Array.isArray(responseObj)
          ? responseObj
          : responseObj?.data || [];
        return data.map((item: unknown) => {
          const account = item as {
            identity?: string;
            glCode?: string;
            glName?: string;
          };
          return {
            value: account.identity || "",
            label: `${account.glCode || ""} - ${account.glName || ""}`,
          };
        });
      },
    }),

    getGLMappings: build.query<GLMappingResponse[], { schemeId: string }>({
      query: ({ schemeId }) => ({
        url: api.loanStepper.getGLMappings({ schemeId }),
        method: "GET",
      }),
      transformResponse: (response: unknown) => {
        const responseObj = response as
          | { content?: unknown[]; data?: unknown[] }
          | unknown[];
        const data =
          responseObj &&
          typeof responseObj === "object" &&
          !Array.isArray(responseObj)
            ? responseObj.content || responseObj.data || []
            : Array.isArray(responseObj)
              ? responseObj
              : [];
        const transformed = data.map((item: unknown) => {
          const mapping = item as {
            identity?: string;
            schemeName?: string;
            glAccountTypeIdentity?: string;
            glAccountType?: string;
            glAccountIdentity?: string;
            glAccountName?: string;
            createdAt?: string;
            updatedAt?: string;
          };
          return {
            id: mapping.identity || "",
            schemeName: mapping.schemeName,
            glAccountType: mapping.glAccountTypeIdentity || "",
            glAccount: mapping.glAccountIdentity || "",
            glAccountTypeName: mapping.glAccountType || "",
            glAccountName: mapping.glAccountName || "",
            createdAt: mapping.createdAt || "",
            updatedAt: mapping.updatedAt || "",
          };
        });

        return transformed;
      },
      providesTags: ["GLMapping"],
    }),

    createGLMapping: build.mutation<
      GLMappingResponse,
      { schemeId: string; payload: GLMappingPayload }
    >({
      query: ({ schemeId, payload }) => ({
        url: api.loanStepper.createGLMapping({ schemeId }),
        method: "POST",
        data: payload as unknown as Record<string, unknown>,
        headers: {
          "Content-Type": "application/json",
        },
      }),
      invalidatesTags: ["GLMapping"],
    }),

    updateGLMapping: build.mutation<
      GLMappingResponse,
      { schemeId: string; mappingId: string; payload: GLMappingPayload }
    >({
      query: ({ schemeId, mappingId, payload }) => ({
        url: api.loanStepper.updateGLMapping({ schemeId, mappingId }),
        method: "PUT",
        data: payload as unknown as Record<string, unknown>,
        headers: {
          "Content-Type": "application/json",
        },
      }),
      invalidatesTags: ["GLMapping"],
    }),

    deleteGLMapping: build.mutation<
      void,
      { schemeId: string; mappingId: string }
    >({
      query: ({ schemeId, mappingId }) => ({
        url: api.loanStepper.deleteGLMapping({ schemeId, mappingId }),
        method: "DELETE",
      }),
      invalidatesTags: ["GLMapping"],
    }),

    getGLMappingByType: build.query<
      GLMappingResponse,
      { schemeId: string; glTypeId: string }
    >({
      query: ({ schemeId, glTypeId }) => {
        const url = api.loanStepper.getGLMappingByType({ schemeId, glTypeId });

        return {
          url,
          method: "GET",
        };
      },
      transformResponse: (response: unknown) => {
        const mapping = response as {
          identity?: string;
          glAccountTypeIdentity?: string;
          glAccountIdentity?: string;
          glAccountTypeName?: string;
          glAccountName?: string;
          createdAt?: string;
          updatedAt?: string;
        };
        return {
          id: mapping.identity || "",
          glAccountType: mapping.glAccountTypeIdentity || "",
          glAccount: mapping.glAccountIdentity || "",
          glAccountTypeName: mapping.glAccountTypeName || "",
          glAccountName: mapping.glAccountName || "",
          createdAt: mapping.createdAt || "",
          updatedAt: mapping.updatedAt || "",
        };
      },
    }),

    getGLAccountDetails: build.query<
      GLAccount,
      { glTypeId: string; glAccountId: string }
    >({
      query: ({ glTypeId }) => ({
        url: api.loanStepper.getGLAccountsByType({ glTypeId }),
        method: "GET",
      }),
      transformResponse: (response: unknown, _meta, args) => {
        const { glAccountId } = args;
        const responseObj = response as { data?: unknown[] } | unknown[];
        const data = Array.isArray(responseObj)
          ? responseObj
          : responseObj?.data || [];
        const account = data.find((item: unknown) => {
          const acc = item as { identity?: string };
          return acc.identity === glAccountId;
        }) as
          | { identity?: string; glCode?: string; glName?: string }
          | undefined;
        return account
          ? {
              value: account.identity || "",
              label: `${account.glCode || ""} - ${account.glName || ""}`,
            }
          : { value: glAccountId, label: "Unknown Account" };
      },
    }),
  }),
});

export const {
  useGetGLTypesQuery,
  useGetGLAccountsByTypeQuery,
  useGetGLMappingsQuery,
  useCreateGLMappingMutation,
  useUpdateGLMappingMutation,
  useDeleteGLMappingMutation,
  useGetGLMappingByTypeQuery,
  useGetGLAccountDetailsQuery,
} = glMappingsApiService;
