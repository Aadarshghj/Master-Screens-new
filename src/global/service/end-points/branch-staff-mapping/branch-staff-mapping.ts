import type {
  AssignedStaff,
  assignedStaffApiResponse,
  AvailableStaff,
  Branch,
  BranchApiResponse,
  BranchStaffRequestDto,
  BranchStaffResponseDto,
  staffApiResponse,
} from "@/types/branch-staff-mapping/branch-staff";

import { apiInstance } from "../../api-instance";
import { api } from "@/api";

export const BranchStaffMappingApi = apiInstance.injectEndpoints({
  endpoints: (build) => ({
    saveBranchStaffMapping: build.mutation<
      BranchStaffResponseDto,
      BranchStaffRequestDto
    >({
      query: (payload) => ({
        url: api.BranchStaffMapping.save(),
        method: "POST",
        data: payload,
      }),
      invalidatesTags: ["BranchStaffMapping"],
    }),

    getAllBranchStaffMappings: build.query<
      BranchStaffResponseDto[],
      void
    >({
      query: () => ({
        url: api.BranchStaffMapping.get(),
        method: "GET",
      }),
      providesTags: ["BranchStaffMapping"],
    }),

    updateBranchStaffMapping: build.mutation<
      BranchStaffResponseDto,
      { identity: string; payload: BranchStaffRequestDto }
    >({
      query: ({ identity, payload }) => ({
        url: api.BranchStaffMapping.update(identity),
        method: "PUT",
        data: payload,
      }),
      invalidatesTags: ["BranchStaffMapping"],
    }),

    deleteBranchStaffMapping: build.mutation<void, string>({
      query: (identity) => ({
        url: api.BranchStaffMapping.delete(identity),
        method: "DELETE",
      }),
      invalidatesTags: ["BranchStaffMapping"],
    }),

    getAllBranches: build.query<Branch[], void>({
      query: () => ({
        url: api.BranchStaffMapping.getallbranch(),
        method: "GET",
      }),
      providesTags: ["Branch"],
      transformResponse: (response: BranchApiResponse[]): Branch[] =>
        response.map((item) => ({
          id: item.identity,
          branchName: item.branchName,
          branchCode: item.branchCode,
        })),
    }),

    getAllStaff: build.query<AvailableStaff[], void>({
      query: () => ({
        url: api.BranchStaffMapping.getallstaff(),
        method: "GET",
      }),
      providesTags: ["Staff"],
      transformResponse: (response: staffApiResponse[]): AvailableStaff[] =>
        response.map((item) => ({
          id: item.identity,
          staffName: item.staffName,
          staffCode: item.staffCode,
        })),
    }),

    getAssignedStaff: build.query<AssignedStaff[], string>({
      query: (branchId) => ({
        url: api.BranchStaffMapping.getassignedstaff(branchId),
        method: "GET",
      }),
      providesTags: ["BranchStaffMapping"],
      transformResponse: (
        response: assignedStaffApiResponse[]
      ): AssignedStaff[] =>
        response.map((item) => ({
          identity: item.identity,
          branchIdentity: item.branchIdentity,
          branchName: item.branchName,
          staffIdentity: item.staffIdentity,
          staffName: item.staffName,
          isActive: item.isActive,
          status: item.isActive ? "Active" : "Pending",
        })),
    }),
  }),
});

export const {
  useSaveBranchStaffMappingMutation,
  useGetAllBranchStaffMappingsQuery,
  useGetAllBranchesQuery,
  useGetAllStaffQuery,
  useGetAssignedStaffQuery,
  useUpdateBranchStaffMappingMutation,
  useDeleteBranchStaffMappingMutation,
} = BranchStaffMappingApi;