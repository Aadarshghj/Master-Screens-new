import { apiInstance } from "../../api-instance";
import { api } from "@/api";
import type {
  DocumentOption,
  AcceptanceLevelOption,
  DocumentRequirementPayload,
  DocumentRequirementResponse,
} from "@/types/loan-product-and schema Stepper/document-requirements.types";

export const documentRequirementsApiService = apiInstance.injectEndpoints({
  endpoints: build => ({
    getDocumentOptions: build.query<
      DocumentOption[],
      { schemeId?: string; tenantId?: string }
    >({
      query: () => {
        const url = api.loanStepper.getDocuments();

        return {
          url,
          method: "GET",
        };
      },
      transformResponse: (response: unknown) => {
        const responseObj = response as
          | { content?: unknown[]; data?: unknown[] }
          | unknown[];
        const data = Array.isArray(responseObj)
          ? responseObj
          : (responseObj as { content?: unknown[]; data?: unknown[] })
              ?.content ||
            (responseObj as { content?: unknown[]; data?: unknown[] })?.data ||
            [];
        return data.map((item: unknown) => {
          const doc = item as {
            identity?: string;
            id?: string;
            documentId?: string;
            documentName?: string;
            name?: string;
            displayName?: string;
          };
          return {
            value: doc.identity || doc.id || doc.documentId || "",
            label: doc.documentName || doc.name || doc.displayName || "",
          };
        });
      },
    }),

    getAcceptanceLevels: build.query<
      AcceptanceLevelOption[],
      { schemeId: string; tenantId: string }
    >({
      query: () => {
        const url = api.loanStepper.getAcceptanceLevels();

        return {
          url,
          method: "GET",
        };
      },
      transformResponse: (response: unknown) => {
        try {
          const responseObj = response as
            | { content?: unknown[]; data?: unknown[] }
            | unknown[];
          const data = Array.isArray(responseObj)
            ? responseObj
            : (responseObj as { content?: unknown[]; data?: unknown[] })
                ?.content ||
              (responseObj as { content?: unknown[]; data?: unknown[] })
                ?.data ||
              [];

          if (!Array.isArray(data)) {
            return [];
          }
          const transformed = data.map((item: unknown) => {
            const level = item as {
              identity?: string;
              id?: string;
              acceptanceLevelId?: string;
              levelName?: string;
              acceptanceLevelName?: string;
              name?: string;
              displayName?: string;
            };
            return {
              value:
                level.identity || level.id || level.acceptanceLevelId || "",
              label:
                level.levelName ||
                level.acceptanceLevelName ||
                level.name ||
                level.displayName ||
                "",
            };
          });

          return transformed;
        } catch {
          return [];
        }
      },
      transformErrorResponse: (response: unknown) => {
        const errorResponse = response as { status?: number };
        // Return mock data when API is unavailable (503 error)
        if (errorResponse?.status === 503) {
          return [
            { value: "ORIGINAL", label: "Original" },
            { value: "COPY", label: "Copy" },
            { value: "CERTIFIED_COPY", label: "Certified Copy" },
            { value: "NOTARIZED", label: "Notarized" },
          ];
        }
        return response;
      },
    }),

    getDocumentRequirements: build.query<
      {
        documentRequirements: DocumentRequirementResponse[];
        schemeIdentity: string | null;
        schemeName: string | null;
      },
      { schemeId: string }
    >({
      query: ({ schemeId }) => {
        const url = api.loanStepper.getDocumentRequirements({ schemeId });

        return {
          url,
          method: "GET",
        };
      },
      transformResponse: (response: unknown) => {
        try {
          const responseObj = response as
            | {
                schemeIdentity?: string;
                schemeName?: string;
                documentRequirements?: unknown[];
                content?: unknown[];
                data?: unknown[];
              }
            | unknown[];

          // Store schemeIdentity and schemeName for use in other operations
          const schemeIdentity = Array.isArray(responseObj)
            ? null
            : (responseObj.schemeIdentity ?? null);
          const schemeName = Array.isArray(responseObj)
            ? null
            : (responseObj.schemeName ?? null);

          // Handle different response structures
          const data = Array.isArray(responseObj)
            ? responseObj
            : responseObj.documentRequirements ||
              responseObj.content ||
              responseObj.data ||
              [];

          if (!Array.isArray(data)) {
            return { documentRequirements: [], schemeIdentity, schemeName };
          }

          const transformed = data.map((item: unknown) => {
            const req = item as {
              identity?: string;
              id?: string;
              documentRequirementId?: string;
              documentIdentity?: string;
              documentId?: string;
              acceptanceLevelIdentity?: string;
              acceptanceLevelId?: string;
              documentName?: string;
              document?: { name?: string };
              acceptanceLevelName?: string;
              acceptanceLevel?: { name?: string };
              mandatory?: boolean;
              isMandatory?: boolean;
              status?: boolean;
              isActive?: boolean;
              createdAt?: string;
              createdDate?: string;
              updatedAt?: string;
              modifiedDate?: string;
            };
            return {
              id: req?.identity || req?.id || req?.documentRequirementId || "",
              documentIdentity: req?.documentIdentity || req?.documentId || "",
              acceptanceLevelIdentity:
                req?.acceptanceLevelIdentity || req?.acceptanceLevelId || "",
              documentName: req?.documentName || req?.document?.name || "",
              acceptanceLevelName:
                req?.acceptanceLevelName || req?.acceptanceLevel?.name || "",
              mandatory: req?.mandatory || req?.isMandatory || false,
              isActive:
                req?.status !== undefined
                  ? req.status
                  : req?.isActive !== undefined
                    ? req.isActive
                    : true,
              createdAt:
                req?.createdAt || req?.createdDate || new Date().toISOString(),
              updatedAt:
                req?.updatedAt || req?.modifiedDate || new Date().toISOString(),
            };
          });

          return {
            documentRequirements: transformed,
            schemeIdentity,
            schemeName,
          };
        } catch {
          return {
            documentRequirements: [],
            schemeIdentity: null,
            schemeName: null,
          };
        }
      },
      providesTags: ["DocumentRequirement"],
    }),

    createDocumentRequirement: build.mutation<
      DocumentRequirementResponse,
      { schemeId: string; payload: DocumentRequirementPayload }
    >({
      query: ({ schemeId, payload }) => ({
        url: api.loanStepper.createDocumentRequirement({ schemeId }),
        method: "POST",
        data: payload as unknown as Record<string, unknown>,
        headers: {
          "Content-Type": "application/json",
        },
      }),
      transformResponse: (response: unknown) => {
        // Handle the created response
        const responseObj = response as { data?: unknown } | unknown;
        const data = (responseObj as { data?: unknown })?.data || responseObj;
        const req = data as {
          identity?: string;
          id?: string;
          documentRequirementId?: string;
          documentIdentity?: string;
          documentId?: string;
          acceptanceLevelIdentity?: string;
          acceptanceLevelId?: string;
          documentName?: string;
          document?: { name?: string };
          acceptanceLevelName?: string;
          acceptanceLevel?: { name?: string };
          mandatory?: boolean;
          isMandatory?: boolean;
          isActive?: boolean;
          createdAt?: string;
          createdDate?: string;
          updatedAt?: string;
          modifiedDate?: string;
        };
        return {
          id: req.identity || req.id || req.documentRequirementId || "",
          documentIdentity: req.documentIdentity || req.documentId || "",
          acceptanceLevelIdentity:
            req.acceptanceLevelIdentity || req.acceptanceLevelId || "",
          documentName: req.documentName || req.document?.name || "",
          acceptanceLevelName:
            req.acceptanceLevelName || req.acceptanceLevel?.name || "",
          mandatory: req.mandatory || req.isMandatory || false,
          isActive: req.isActive !== undefined ? req.isActive : true,
          createdAt:
            req.createdAt || req.createdDate || new Date().toISOString(),
          updatedAt:
            req.updatedAt || req.modifiedDate || new Date().toISOString(),
        };
      },
      invalidatesTags: ["DocumentRequirement"],
    }),

    updateDocumentRequirement: build.mutation<
      DocumentRequirementResponse,
      {
        schemeId: string;
        requirementId: string;
        payload: DocumentRequirementPayload;
      }
    >({
      query: ({ schemeId, requirementId, payload }) => ({
        url: api.loanStepper.updateDocumentRequirement({
          schemeId,
          requirementId,
        }),
        method: "PUT",
        data: payload as unknown as Record<string, unknown>,
        headers: {
          "Content-Type": "application/json",
        },
      }),
      transformResponse: (response: unknown) => {
        const responseObj = response as { data?: unknown } | unknown;
        const data = (responseObj as { data?: unknown })?.data || responseObj;
        const req = data as {
          identity?: string;
          id?: string;
          documentRequirementId?: string;
          documentIdentity?: string;
          documentId?: string;
          acceptanceLevelIdentity?: string;
          acceptanceLevelId?: string;
          documentName?: string;
          document?: { name?: string };
          acceptanceLevelName?: string;
          acceptanceLevel?: { name?: string };
          mandatory?: boolean;
          isMandatory?: boolean;
          isActive?: boolean;
          createdAt?: string;
          createdDate?: string;
          updatedAt?: string;
          modifiedDate?: string;
        };
        return {
          id: req.identity || req.id || req.documentRequirementId || "",
          documentIdentity: req.documentIdentity || req.documentId || "",
          acceptanceLevelIdentity:
            req.acceptanceLevelIdentity || req.acceptanceLevelId || "",
          documentName: req.documentName || req.document?.name || "",
          acceptanceLevelName:
            req.acceptanceLevelName || req.acceptanceLevel?.name || "",
          mandatory: req.mandatory || req.isMandatory || false,
          isActive: req.isActive !== undefined ? req.isActive : true,
          createdAt:
            req.createdAt || req.createdDate || new Date().toISOString(),
          updatedAt:
            req.updatedAt || req.modifiedDate || new Date().toISOString(),
        };
      },
      invalidatesTags: ["DocumentRequirement"],
    }),

    deleteDocumentRequirement: build.mutation<
      void,
      { schemeId: string; requirementId: string }
    >({
      query: ({ schemeId, requirementId }) => ({
        url: api.loanStepper.deleteDocumentRequirement({
          schemeId,
          requirementId,
        }),
        method: "DELETE",
      }),
      invalidatesTags: ["DocumentRequirement"],
    }),
  }),
});

export const {
  useLazyGetDocumentOptionsQuery,
  useLazyGetAcceptanceLevelsQuery,
  useLazyGetDocumentRequirementsQuery,
  useGetDocumentOptionsQuery,
  useGetAcceptanceLevelsQuery,
  useGetDocumentRequirementsQuery,
  useCreateDocumentRequirementMutation,
  useUpdateDocumentRequirementMutation,
  useDeleteDocumentRequirementMutation,
} = documentRequirementsApiService;
