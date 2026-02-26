import { apiInstance } from '../../api-instance';
import { api } from "../../../../api"
import type { BranchType, BranchTypeResponseDto, BranchTypeRequestDto } from '../../../../types/customer-management/branch-type';


export const branchTypeApiService = apiInstance.injectEndpoints({
    endpoints: build => ({
        saveBranchType: build.mutation<BranchTypeResponseDto, BranchTypeRequestDto>({
            query: payload => ({
                url: api.branchType.save(),
                method: "POST",
                data: payload,
            }),
            invalidatesTags: ["BranchType"],
        }),

        getBranchType: build.query<BranchType[], void>({
            query: () => ({
                url: api.branchType.getBranches(),
                method: "GET",
            }),
            providesTags: ["BranchType"],
            transformResponse: (
                response: BranchTypeResponseDto[]): BranchType[] =>
                response.map(item => ({
                    branchTypeIdentity: item.identity,
                    branchTypeCode: item.code,
                    branchTypeName: item.name,
                    branchTypeDesc: item.description ?? "",
                    isActive: item.isActive,

                })),
        }),

        deleteBranchType: build.mutation<void, string>({
            query: branchTypeId => ({
                url: api.branchType.delete(branchTypeId),
                method: "DELETE",
            }),
            invalidatesTags: ["BranchType"],
        }),

        updateBranchType: build.mutation<BranchTypeResponseDto, { branchTypeId: string, payload: BranchTypeRequestDto }>({
                query: ({ branchTypeId, payload }) => ({
                    url: api.branchType.update(branchTypeId),
                    method: "PUT",
                    data: payload,
                }),
                invalidatesTags: ["BranchType"],
                transformResponse: (item: BranchTypeResponseDto): BranchType => ({
                branchTypeCode: item.code,
                branchTypeName: item.name,
                branchTypeDesc: item.description ?? "",
                isActive: item.isActive,
                }),
            }),

        getBranchTypeById: build.query<BranchTypeResponseDto, string>({
            query: branchTypeId => ({
                url: api.branchType.getById(branchTypeId),
                method: "GET",
            }),
            providesTags: ["BranchType"],
        }),
    }),
});

export const {
    useSaveBranchTypeMutation,
    useGetBranchTypeQuery,
    useLazyGetBranchTypeByIdQuery,
    useDeleteBranchTypeMutation,
    useUpdateBranchTypeMutation,
} = branchTypeApiService;