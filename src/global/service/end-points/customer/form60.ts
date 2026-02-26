import type {
  Form60Response,
  CreateForm60Request,
  Form60HistoryRecord,
  Form60FormData,
} from "@/types/customer/form60.types";
import { api } from "@/api";
import { apiInstance } from "../../api-instance";
import { createSelector } from "@reduxjs/toolkit";
import type { RootState } from "@/global/store";

const transformForm60Response = (response: Form60Response): Form60FormData => {
  if (!response) {
    throw new Error("No data received from API");
  }

  return {
    customerId: 0, // Not in response, will be set by component
    branchId: response.branchId || "",
    customerName: response.customerName || "",
    dateOfBirth: response.dateOfBirth || "",
    fatherName: response.fatherName || "",
    flatRoomNo: response.flatRoomNo || "",
    roadStreetLane: response.roadStreetLane || "",
    areaLocality: response.areaLocality || "",
    townCity: response.townCity || "",
    district: response.district || "",
    state: response.state || "",
    pinCode: response.pinCode || "",
    mobileNumber: response.mobileNumber || "",
    sourceOfIncome: response.sourceOfIncome || "",
    agriculturalIncome: response.agriculturalIncome || 0,
    otherIncome: response.otherIncome || 0,
    taxableIncome: response.taxableIncome || 0,
    nonTaxableIncome: response.nonTaxableIncome || 0,
    modeOfTransaction: response.modeOfTransaction || "BANK",
    transactionAmount: response.transactionAmount || 0,
    transactionDate: response.transactionDate || "",
    numberOfPersons: response.numberOfPersons || 1,
    panCardApplicationDate: response.panCardApplicationDate || "",
    panCardApplicationAckNo: response.panCardApplicationAckNo || "",
    pidDocumentCode: response.pidDocumentCode || "",
    pidDocumentId: response.pidDocumentId || "",
    pidDocumentNo: response.pidDocumentNo || "",
    pidIssuingAuthority: response.pidIssuingAuthority || "",
    addDocumentCode: response.addDocumentCode || "",
    addDocumentId: response.addDocumentId || "",
    addDocumentNo: response.addDocumentNo || "",
    addIssuingAuthority: response.addIssuingAuthority || "",
    maskedAdhar: response.maskedAdhar || "",
    telephoneNumber: response.telephoneNumber || "",
    floorNumber: response.floorNumber || "",
    nameOfPremises: response.nameOfPremises || "",
    submissionDate: response.submissionDate || "",
    formFileId: response.formFileId || 1,
    createdBy: 1001, // Default value since not in response
    // DMS File Upload Fields
    docRefId: response.docRefId || "",
    fileName: response.fileName || "",
    filePath: response.filePath || "",
    identity: response.identity ?? "",
  };
};

const transformFormDataForSubmission = (
  data: Form60FormData
): CreateForm60Request => {
  return {
    branchId: data.branchId as string, // UUID string
    transactionAmount: Number(Number(data.transactionAmount).toFixed(2)), // Ensure decimal format
    transactionDate: data.transactionDate,
    modeOfTransaction: data.modeOfTransaction,
    numberOfPersons: Number(data.numberOfPersons),
    agriculturalIncome: Number(Number(data.agriculturalIncome).toFixed(2)), // Ensure decimal format
    otherIncome: Number(Number(data.otherIncome).toFixed(2)), // Ensure decimal format
    taxableIncome: Number(Number(data.taxableIncome).toFixed(2)), // Ensure decimal format
    nonTaxableIncome: Number(Number(data.nonTaxableIncome).toFixed(2)), // Ensure decimal format
    panCardApplicationDate: data.panCardApplicationDate,
    panCardApplicationAckNo: data.panCardApplicationAckNo,
    pidDocumentId: String(data.pidDocumentId || ""),
    pidDocumentNo: data.pidDocumentNo,
    pidIssuingAuthority: data.pidIssuingAuthority,
    addDocumentId: String(data.addDocumentId || ""),
    addDocumentNo: data.addDocumentNo,
    addIssuingAuthority: data.addIssuingAuthority,
    submissionDate: data.submissionDate,
    formFileId: Number(data.formFileId) || 1,
    maskedAdhar: data.maskedAdhar || "",
    telephoneNumber: data.telephoneNumber || data.mobileNumber,
    floorNumber: data.floorNumber || "Ground Floor",
    nameOfPremises: data.nameOfPremises || "Business Complex",
    createdBy: 1, // Always use 1 as per successful payload
  };
};

export const form60ApiService = apiInstance.injectEndpoints({
  endpoints: build => ({
    getForm60ById: build.query<Form60FormData, { customerId: string }>({
      query: ({ customerId }) => ({
        url: api.customer.getForm60ById({ customerId }),
        method: "GET",
        endpointName: "getForm60ById",
        name: "getForm60ById",
      }),
      transformResponse: transformForm60Response,
      providesTags: (_result, _error, { customerId }) => [
        { type: "Customer", id: customerId },
        { type: "Form60", id: "LIST" },
      ],
    }),

    createForm60: build.mutation<
      { message: string; data: Form60Response },
      { customerId: string; payload: Form60FormData }
    >({
      query: ({ customerId, payload }) => ({
        url: api.customer.createForm60({ customerId }),
        method: "POST",
        data: transformFormDataForSubmission(payload) as unknown as Record<
          string,
          unknown
        >,
        endpointName: "createForm60",
        name: "createForm60",
      }),
      invalidatesTags: (_result, _error, { customerId }) => [
        { type: "Customer", id: customerId },
        { type: "Form60", id: "LIST" },
      ],
    }),

    updateForm60: build.mutation<
      { message: string; data: Form60Response },
      { customerId: string; form60Id: string; payload: Form60FormData }
    >({
      query: ({ customerId, form60Id, payload }) => ({
        url: api.customer.updateForm60({ customerId, form60Id }),
        method: "PUT",
        data: transformFormDataForSubmission(payload) as unknown as Record<
          string,
          unknown
        >,
        endpointName: "updateForm60",
        name: "updateForm60",
      }),
      invalidatesTags: (_result, _error, { customerId }) => [
        { type: "Customer", id: customerId },
        { type: "Form60", id: "LIST" },
      ],
    }),

    getForm60History: build.query<Form60HistoryRecord[], string>({
      query: customerId => ({
        url: api.customer.getForm60History({ customerId }),
        method: "GET",
        endpointName: "getForm60History",
        name: "getForm60History",
      }),
      providesTags: (_result, _error, customerId) => [
        { type: "Customer", id: customerId },
        { type: "Form60", id: "LIST" },
      ],
      keepUnusedDataFor: 300,
    }),

    downloadForm60: build.mutation<
      Blob,
      { customerId: string; form60Id: string }
    >({
      query: ({ customerId, form60Id }) => ({
        url: api.customer.downloadForm60({ customerId, form60Id }),
        method: "GET",
        responseType: "blob",
        endpointName: "downloadForm60",
        name: "downloadForm60",
      }),
    }),

    previewForm60: build.mutation<
      Blob,
      { customerId: string; form60Id: string }
    >({
      query: ({ customerId, form60Id }) => ({
        url: api.customer.previewForm60({ customerId, form60Id }),
        method: "GET",
        responseType: "blob",
        endpointName: "previewForm60",
        name: "previewForm60",
      }),
    }),

    uploadForm60: build.mutation<
      { message: string; data: { identity: string } },
      {
        customerId: string;
        form60Id: string;
        docRefId: string;
        fileName: string;
        filePath: string;
      }
    >({
      query: ({ customerId, form60Id, docRefId, fileName, filePath }) => {
        return {
          url: api.customer.uploadForm60({ customerId, form60Id }),
          method: "POST",
          data: {
            form60Identity: form60Id,
            docRefId,
            fileName,
            filePath,
          },
          headers: {
            "Content-Type": "application/json",
          },
          endpointName: "uploadForm60",
          name: "uploadForm60",
        };
      },
      invalidatesTags: (_result, _error, { customerId }) => [
        { type: "Customer", id: customerId },
        { type: "Form60", id: "LIST" },
      ],
    }),
  }),
});

export const selectForm60Data = createSelector(
  [
    (state: RootState, customerId: string) =>
      form60ApiService.endpoints.getForm60ById.select({ customerId })(state),
  ],
  queryResult => queryResult.data
);

export const selectForm60History = createSelector(
  [
    (state: RootState, customerId: string) =>
      form60ApiService.endpoints.getForm60History.select(customerId)(state),
  ],
  queryResult => queryResult.data || []
);
export const {
  useGetForm60ByIdQuery,
  useCreateForm60Mutation,
  useUpdateForm60Mutation,
  useGetForm60HistoryQuery,
  useDownloadForm60Mutation,
  usePreviewForm60Mutation,
  useUploadForm60Mutation,
} = form60ApiService;
