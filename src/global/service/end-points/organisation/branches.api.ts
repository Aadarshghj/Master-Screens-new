import type {
  BranchCreatePayload,
  BranchResponseDto,
  BranchStatusDto,
  BranchCategoryDto,
  DropdownDto,
  ParentBranchDto,
} from "@/types/organisation/admin-unit";
import { apiInstance } from "../../api-instance";
import { branches } from "@/api/organisation/branches";
import { master } from "@/api/master/master.api";
import type { Option } from "@/types/customer-management/designation";

export interface PincodeDetails {
  pincodeIdentity: string;
  postOfficeIdentity: string;
  postOffice: string;
  cityIdentity: string;
  cityName: string;
  districtIdentity: string;
  districtName: string;
  stateIdentity: string;
  stateName: string;
  countryIdentity: string;
  countryName: string;
  language: string;
}

export interface PostOfficeDto {
  officeName: string;
  identity: string;
}

export interface PincodeApiResponse {
  pincode: string;
  districtName: string;
  districtIdentity?: string;
  stateName: string;
  stateIdentity?: string;
  postOffices: PostOfficeDto[];
  latitude: number;
  longitude: number;
  identity: string;
}

export interface TimezoneDto {
  identity: string;
  timezoneName: string;
  utcOffset: string;
  name: string;
  isActive: boolean;
}

export const branchesApiService = apiInstance.injectEndpoints({
  endpoints: build => ({
    saveBranch: build.mutation<BranchResponseDto, BranchCreatePayload>({
      query: payload => ({
        url: branches.save(),
        method: "POST",
        data: payload as unknown as Record<string, unknown>,
      }),
      invalidatesTags: ["Branch"],
    }),

    getAllBranches: build.query<BranchResponseDto[], void>({
      query: () => ({ url: branches.getAll(), method: "GET" }),
      providesTags: ["Branch"],
    }),

    getBranchByCode: build.query<BranchResponseDto, string>({
      query: (code: string) => ({
        url: branches.getByCode(code),
        method: "GET",
      }),
      providesTags: ["Branch"],
    }),

    searchBranches: build.query<
      BranchResponseDto[],
      { branchName?: string; branchCode?: string }
    >({
      query: params => ({
        url: branches.search(params),
        method: "GET",
      }),
      providesTags: ["Branch"],
    }),

    getBranchById: build.query<BranchResponseDto, string>({
      query: (id: string) => ({
        url: branches.getById(id),
        method: "GET",
      }),
      providesTags: ["Branch"],
    }),

    updateBranch: build.mutation<
      BranchResponseDto,
      { id: string; payload: BranchCreatePayload }
    >({
      query: ({ id, payload }) => ({
        url: branches.update(id),
        method: "PUT",
        data: payload as unknown as Record<string, unknown>,
      }),
      invalidatesTags: ["Branch"],
    }),

    deleteBranch: build.mutation<void, string>({
      query: (id: string) => ({
        url: branches.delete(id),
        method: "DELETE",
      }),
      invalidatesTags: ["Branch"],
    }),

    getBranchStatus: build.query<Option[], void>({
      query: () => ({ url: branches.getStatus(), method: "GET" }),
      providesTags: ["BranchStatus"],
      transformResponse: (res: BranchStatusDto[]): Option[] =>
        res.map(item => ({
          label: item.branchStatusName,
          value: item.identity,
        })),
    }),

    getBranchStatusById: build.query<DropdownDto, string>({
      query: (id: string) => ({
        url: branches.getStatusById(id),
        method: "GET",
      }),
      providesTags: ["BranchStatus"],
    }),

    getBranchCategory: build.query<Option[], void>({
      query: () => ({ url: branches.getCategory(), method: "GET" }),
      providesTags: ["BranchCategory"],
      transformResponse: (res: BranchCategoryDto[]): Option[] =>
        res.map(item => ({
          label: item.branchCategoryName,
          value: item.identity,
        })),
    }),

    getBranchTypes: build.query<Option[], void>({
      query: () => ({ url: branches.getBranchTypes(), method: "GET" }),
      providesTags: ["BranchType"],
      transformResponse: (res: DropdownDto[]): Option[] =>
        res.map(item => ({ label: item.name, value: item.identity })),
    }),

    getParentBranches: build.query<Option[], string>({
      query: (adminUnitTypeIdentity: string) => ({
        url: branches.getParent(adminUnitTypeIdentity),
        method: "GET",
      }),
      providesTags: ["Branch"],
      transformResponse: (res: ParentBranchDto[]): Option[] =>
        res.map(item => ({
          label: `${item.branchCode} — ${item.branchName}`,
          value: item.identity,
        })),
    }),

    getMergedToBranches: build.query<Option[], void>({
      query: () => ({ url: branches.getAll(), method: "GET" }),
      providesTags: ["Branch"],
      transformResponse: (res: BranchResponseDto[]): Option[] =>
        res.map(item => ({
          label: `${item.branchCode} — ${item.branchName}`,
          value: item.identity,
        })),
    }),

    getTimezones: build.query<Option[], void>({
      query: () => ({ url: branches.getTimezones(), method: "GET" }),
      providesTags: ["Timezone"],
      transformResponse: (res: TimezoneDto[]): Option[] =>
        res.map(item => ({
          label: `(${item.utcOffset}) ${item.name}`,
          value: item.timezoneName,
        })),
    }),

    getTimezoneById: build.query<DropdownDto, string>({
      query: (id: string) => ({
        url: branches.getTimezoneById(id),
        method: "GET",
      }),
      providesTags: ["Timezone"],
    }),

    getPermissionTypes: build.query<Option[], void>({
      query: () => ({ url: branches.getPermissionTypes(), method: "GET" }),
      providesTags: ["PermissionType"],
      transformResponse: (res: DropdownDto[]): Option[] =>
        res.map(item => ({ label: item.name, value: item.identity })),
    }),

    getPincodeDetails: build.query<PincodeApiResponse[], string>({
      query: (pincode: string) => ({
        url: master.getPincodeDetails({ pincode }),
        method: "GET",
      }),
    }),

    getLanguages: build.query<Option[], void>({
      query: () => ({ url: master.getLanguages(), method: "GET" }),
      providesTags: ["Language"],
      transformResponse: (res: DropdownDto[]): Option[] =>
        res.map(item => ({
          label: item.languageName,
          value: item.identity,
        })),
    }),

    getNextBranchCode: build.query<{ branchCode: string }, void>({
      query: () => ({ url: branches.getNextBranchCode(), method: "GET" }),
      keepUnusedDataFor: 0,
    }),
  }),
});

export const {
  useSaveBranchMutation,
  useGetAllBranchesQuery,
  useLazyGetAllBranchesQuery,
  useGetBranchByCodeQuery,
  useLazyGetBranchByCodeQuery,
  useSearchBranchesQuery,
  useLazySearchBranchesQuery,
  useGetBranchByIdQuery,
  useLazyGetBranchByIdQuery,
  useUpdateBranchMutation,
  useDeleteBranchMutation,
  useGetBranchStatusQuery,
  useGetBranchStatusByIdQuery,
  useGetBranchCategoryQuery,
  useGetBranchTypesQuery,
  useGetParentBranchesQuery,
  useGetMergedToBranchesQuery,
  useGetTimezonesQuery,
  useGetTimezoneByIdQuery,
  useGetPermissionTypesQuery,
  useLazyGetPincodeDetailsQuery,
  useGetLanguagesQuery,
  useGetNextBranchCodeQuery,
  useLazyGetNextBranchCodeQuery,
} = branchesApiService;