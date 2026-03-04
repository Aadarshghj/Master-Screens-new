import { apiInstance } from "../../api-instance";
import { api } from "@/api";
import type { ConfigOption } from "@/types";
import type {
  BranchData,
  ImportHistoryLeaveStatusBatchResponse,
  StatusData,
  userdDetails,
  UserDetailsResponse,
  UserLeaveStatusFormData,
  userLeaveStatusPostResponse,
  UserLeaveStatusResponse,
} from "@/types/approval-workflow/user-leave-status.types";
import { objectToQuery } from "@/utils";
import type {
  BatchDetailsParams,
  BatchDetailsResponse,
} from "../lead/lead-details";

export const leaveStatusApiService = apiInstance.injectEndpoints({
  endpoints: build => ({
    filterUserLeaveStatus: build.query<
      UserLeaveStatusResponse,
      {
        userCode?: string;
        delegateUserCode?: string;
        page?: number;
        size?: number;
      }
    >({
      query: ({ userCode, page, size, delegateUserCode }) => ({
        url: api.workflow.filterUserLeaveStatus(),
        method: "GET",
        params: {
          ...(userCode && { userCode }),
          ...(delegateUserCode && { delegateUserCode }),
          ...(page !== undefined && { page }),
          ...(size !== undefined && { size }),
        },
      }),
      providesTags: ["UserLeaveStatus"],
    }),
    getBranchDetails: build.query<
      BranchData,
      {
        branchCode?: string;
        branchName?: string;
      }
    >({
      query: ({ branchCode, branchName }) => ({
        url: api.workflow.getBranch(),
        method: "GET",
        params: {
          ...(branchCode && { branchCode }),
          ...(branchName && { branchName }),
        },
      }),
      providesTags: ["BranchDetails"],
    }),
    getUserDetails: build.query<
      UserDetailsResponse,
      {
        userCode?: string;
        userName?: string;
      }
    >({
      query: ({ userCode, userName }) => ({
        url: api.workflow.getUserDetails(),
        method: "GET",
        params: {
          ...(userCode && { userCode }),
          ...(userName && { userName }),
        },
      }),
      providesTags: ["UserDetails"],
    }),

    createUserLeaveStatus: build.mutation<
      userLeaveStatusPostResponse,
      UserLeaveStatusFormData
    >({
      query: data => ({
        url: api.workflow.postUserLeaveStatus(),
        method: "POST",
        data: data as unknown as Record<string, unknown>,
      }),
      invalidatesTags: ["UserLeaveStatus"],
    }),

    getUserLeaveStatusById: build.query<UserLeaveStatusResponse, string>({
      query: identity => ({
        url: api.workflow.gettUserLeaveStatusById({ identity }),
        method: "GET",
      }),
    }),
    getUserStatus: build.query<ConfigOption[], void>({
      query: () => ({
        url: api.workflow.getUserStatus(),
        method: "GET",
      }),
      transformResponse: (response: StatusData[]): ConfigOption[] => {
        return response.map(item => ({
          value: item.statusCode ?? "",
          label: item.status ?? "",
          identity: item.identity ?? "",
        }));
      },
    }),
    deleteUserLeaveStatus: build.mutation<void, string>({
      query: identity => ({
        url: api.workflow.deleteUserLeaveStatus({ identity }),
        method: "DELETE",
      }),
      invalidatesTags: ["UserLeaveStatus"],
    }),
    updateUserLeaveStatus: build.mutation<
      userLeaveStatusPostResponse,
      { identity: string; data: UserLeaveStatusFormData }
    >({
      query: ({ identity, data }) => ({
        url: api.workflow.updateUserLeaveStatus({ identity }),
        method: "PUT",
        data: data as unknown as Record<string, unknown>,
      }),
    }),
    bulkImportLeaveStatus: build.mutation<
      { message: string; batchId?: string },
      { fileName: string; s3DocumentUrl: string }
    >({
      query: payload => ({
        url: api.workflow.bulkImportLeaveStatus(),
        method: "POST" as const,
        data: payload,
      }),
    }),
    getHistoryLeaveStatusBatches: build.query<
      ImportHistoryLeaveStatusBatchResponse,
      {
        uploadedBy?: string;
        createdDate?: string;
        page?: number;
        size?: number;
      }
    >({
      query: ({ uploadedBy, createdDate, page, size }) => {
        return {
          url: api.workflow.getHistoryLeaveStatusBatches(),
          method: "GET",
          params: {
            ...(uploadedBy !== undefined &&
              uploadedBy !== "" && { uploadedBy }),
            ...(createdDate !== undefined &&
              createdDate !== "" && { createdDate }),
            ...(page !== undefined && { page }),
            ...(size !== undefined && { size }),
          },
        };
      },
    }),

    getSingleHistoryLeaveDetails: build.query<
      BatchDetailsResponse,
      BatchDetailsParams
    >({
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
          url: `${api.workflow.getSingleHistoryLeaveStatusDetails({ batchId })}${queryString}`,
          method: "GET",
        };
      },
    }),
    getUserList: build.query<ConfigOption[], void>({
      query: () => ({
        url: api.workflow.getUsers(),
        method: "GET",
      }),
      transformResponse: (response: userdDetails[]) => {
        return response
          .filter(item => item.userName && item.userName !== "")
          .map(item => ({
            value: item.identity,
            label: item.userName,
          }));
      },
    }),
  }),
});

export const {
  useFilterUserLeaveStatusQuery,
  useLazyFilterUserLeaveStatusQuery,
  useCreateUserLeaveStatusMutation,
  useDeleteUserLeaveStatusMutation,
  useGetUserLeaveStatusByIdQuery,
  useUpdateUserLeaveStatusMutation,
  useGetBranchDetailsQuery,
  useGetUserDetailsQuery,
  useGetUserStatusQuery,
  useBulkImportLeaveStatusMutation,
  useGetHistoryLeaveStatusBatchesQuery,
  useLazyGetHistoryLeaveStatusBatchesQuery,
  useLazyGetSingleHistoryLeaveDetailsQuery,
  useGetUserListQuery,
} = leaveStatusApiService;
