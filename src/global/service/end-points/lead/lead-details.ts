import type {
  LeadDetailsResponse,
  LeadDetailsConfig,
  AdditionalReferenceConfig,
  SaveLeadDetailsPayload,
  LeadSearchForm,
  PaginatedLeadSearchResponse,
  UpdateLeadDetailsPayload,
  LeadCreationApiResponse,
} from "@/types/lead/lead-details.types";
import { api } from "@/api";
import { apiInstance } from "../../api-instance";
import { objectToQuery } from "@/utils/query.utils";

export interface ImportHistorySearchParams {
  uploadedBy?: string;
  uploadedDate?: string;
  page?: number;
  size?: number;
}

export interface ImportHistoryResponse {
  batchId: string;
  uploadedBy: string;
  uploadedDate: string;
  uploadedTime: string;
  status: string;
  totalRowCount: number;
  completedCount: number;
  failureCount: number;
  [key: string]: unknown;
}

export interface ImportDetailsSearchParams {
  batchId: string;
  updatedBy?: string;
}

export interface ImportDetailsResponse {
  siNo: number;
  date: string;
  name: string;
  mobile: string;
  email: string;
  leadSource: string;
  errorDetails: string;
  [key: string]: unknown;
}
export interface FileViewResponse {
  preSignedUrl: string;
  filePath: string;
  fileName: string | null;
}

export interface FileViewParams {
  filePath: string;
}

export interface ImportBatchItem {
  batchIdentity: string;
  batchId: string;
  fileName: string;
  status: string;
  totalRecords: number;
  processedRecords: number;
  erroredRecords: number;
  uploadedBy: string;
  createdAt: string;
  completedAt: string;
  detailedMessage: string;
}

export interface ImportBatchResponse {
  content: ImportBatchItem[];
  pageable: {
    pageNumber: number;
    pageSize: number;
    sort: Array<{
      direction: string;
      property: string;
      ignoreCase: boolean;
      nullHandling: string;
      ascending: boolean;
      descending: boolean;
    }>;
    offset: number;
    unpaged: boolean;
    paged: boolean;
  };
  last: boolean;
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
  sort: Array<{
    direction: string;
    property: string;
    ignoreCase: boolean;
    nullHandling: string;
    ascending: boolean;
    descending: boolean;
  }>;
  first: boolean;
  numberOfElements: number;
  empty: boolean;
}

export interface SuccessRecord {
  rowNumber: number;
  fullName: string;
  mobileNumber: string;
  leadSource: string;
  email: string;
  createdAt: string;
}

export interface ErrorRecord {
  rowNumber: number;
  fullName: string;
  mobileNumber: string;
  leadSource: string;
  email: string;
  createdAt: string;
  errorMessage: string;
  errorId: number;
}

export interface BatchDetailsResponse {
  batchIdentity: string;
  batchId?: string;
  fileName: string;
  status: string;
  totalRecords: number;
  processedRecords: number;
  erroredRecords: number;
  uploadedBy: string;
  uploadedByName?: string;
  createdAt: string;
  completedAt: string;
  detailedMessage: string;
  errors: ErrorRecord[] | null;
  successRecords: SuccessRecord[] | null;
}

export interface BatchDetailsParams {
  batchId: string;
  includeSuccess?: boolean;
  includeErrors?: boolean;
}

export const leadDetailsApiService = apiInstance.injectEndpoints({
  endpoints: build => ({
    getLeadDetails: build.query<LeadDetailsResponse, string>({
      query: leadId => ({
        url: api.lead.getLeadDetails({ leadId }),
        method: "GET",
      }),
    }),

    saveLeadDetails: build.mutation<
      LeadCreationApiResponse,
      SaveLeadDetailsPayload
    >({
      query: payload => ({
        url: api.lead.saveLeadDetails(),
        method: "POST" as const,
        data: payload,
      }),
    }),

    updateLeadDetails: build.mutation<
      { message: string; data: LeadDetailsResponse },
      { leadId: string; payload: UpdateLeadDetailsPayload }
    >({
      query: ({ leadId, payload }) => ({
        url: api.lead.updateLeadDetails({ leadId }),
        method: "PUT" as const,
        data: payload,
      }),
    }),

    getLeadDetailsConfig: build.query<LeadDetailsConfig, void>({
      query: () => ({
        url: api.lead.getLeadDetailsConfig(),
        method: "GET",
      }),
    }),

    getAdditionalReferenceByProduct: build.query<
      AdditionalReferenceConfig[],
      { tenantIdentity: string; productServiceIdentity: string }
    >({
      query: ({ tenantIdentity, productServiceIdentity }) => {
        const queryString = objectToQuery({
          tenantIdentity,
          productServiceIdentity,
        });

        return {
          url: `${api.lead.getAdditionalReferenceByProduct()}${queryString}`,
          method: "GET",
        };
      },
      transformResponse: (response: AdditionalReferenceConfig[]) => {
        return response
          .filter(field => field.isActive)
          .sort((a, b) => a.sortOrder - b.sortOrder);
      },
    }),

    searchLead: build.query<
      PaginatedLeadSearchResponse,
      LeadSearchForm & { page: number; size: number }
    >({
      query: params => {
        const queryParams: Record<string, string> = {};

        if (params.fullName && params.fullName.trim() !== "") {
          queryParams.fullName = params.fullName.trim();
        }
        if (params.contactNumber && params.contactNumber.trim() !== "") {
          queryParams.contactNumber = params.contactNumber.trim();
        }
        if (params.email && params.email.trim() !== "") {
          queryParams.email = params.email.trim();
        }

        queryParams.page = String(params.page ?? 0);
        queryParams.size = String(params.size ?? 10);

        const queryString = objectToQuery(queryParams);
        const separator = queryString.startsWith("?") ? "" : "?";

        return {
          url: `${api.lead.searchLead()}${separator}${queryString}`,
          method: "GET",
        };
      },
    }),

    getImportBatches: build.query<
      ImportBatchResponse,
      ImportHistorySearchParams | void
    >({
      query: params => {
        const queryParams: Record<string, string> = {};

        if (params?.uploadedBy) {
          queryParams.uploadedBy = params.uploadedBy;
        }
        if (params?.uploadedDate) {
          queryParams.uploadedDate = params.uploadedDate;
        }
        if (params?.page !== undefined) {
          queryParams.page = String(params.page);
        }
        if (params?.size !== undefined) {
          queryParams.size = String(params.size);
        }

        const queryString = objectToQuery(queryParams);

        return {
          url: `${api.lead.getImportBatches()}${queryString}`,
          method: "GET",
        };
      },
    }),

    getSuccessDetails: build.query<
      ImportDetailsResponse[],
      ImportDetailsSearchParams
    >({
      query: params => {
        const queryParams: Record<string, string> = {};

        if (params.updatedBy) {
          queryParams.updatedBy = params.updatedBy;
        }

        const queryString = objectToQuery(queryParams);

        return {
          url: `${api.lead.getSuccessDetails({ batchId: params.batchId })}${queryString}`,
          method: "GET",
        };
      },
    }),

    getErrorDetails: build.query<
      ImportDetailsResponse[],
      ImportDetailsSearchParams
    >({
      query: params => {
        const queryParams: Record<string, string> = {};

        if (params.updatedBy) {
          queryParams.updatedBy = params.updatedBy;
        }

        const queryString = objectToQuery(queryParams);

        return {
          url: `${api.lead.getErrorDetails({ batchId: params.batchId })}${queryString}`,
          method: "GET",
        };
      },
    }),

    getFileView: build.query<FileViewResponse, FileViewParams>({
      query: ({ filePath }) => ({
        url: api.lead.viewFile(),
        method: "GET",
        params: {
          filePath,
        },
      }),
    }),

    bulkImportLeads: build.mutation<
      { message: string; batchId?: string },
      { s3DocumentUrl: string; fileName: string }
    >({
      query: payload => ({
        url: api.lead.bulkImport(),
        method: "POST" as const,
        data: payload,
      }),
    }),

    getBatchDetails: build.query<BatchDetailsResponse, BatchDetailsParams>({
      query: ({ batchId, includeSuccess, includeErrors }) => {
        const queryParams: Record<string, string> = {};

        if (includeSuccess) {
          queryParams.includeSuccess = "true";
        }
        if (includeErrors) {
          queryParams.includeErrors = "true";
        }

        const queryString = objectToQuery(queryParams);

        return {
          url: `${api.lead.getBatchDetails({ batchId })}${queryString}`,
          method: "GET",
        };
      },
    }),
  }),
});

export const {
  useGetLeadDetailsQuery,
  useSaveLeadDetailsMutation,
  useUpdateLeadDetailsMutation,
  useGetLeadDetailsConfigQuery,
  useLazySearchLeadQuery,
  useLazyGetAdditionalReferenceByProductQuery,
  useGetImportBatchesQuery,
  useLazyGetImportBatchesQuery,
  useLazyGetSuccessDetailsQuery,
  useLazyGetErrorDetailsQuery,
  useLazyGetFileViewQuery,
  useBulkImportLeadsMutation,
  useLazyGetBatchDetailsQuery,
} = leadDetailsApiService;
