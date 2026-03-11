
import { apiInstance } from "../../api-instance";
import { api } from "@/api";
import type { AssetClassificationType, LoanAssetRequestDto, LoanAssetResponseDto } from "@/types/customer-management/loan-asset-classification";

export const LoanAssetClassiApi = apiInstance.injectEndpoints({
    endpoints:build =>({
        saveLoanAssetClassi: build.mutation<
       AssetClassificationType,
        LoanAssetRequestDto
        
>({
    query:payload => ({
        url: api.LoanAssetClassifiApi.save(),
        method:"POST",
        data:payload 
    }),
    invalidatesTags:["LoanAssetClassification"],
}),
getLoanAssetClassi : build.query<AssetClassificationType[],void>({
    query: () => ({
        url: api.LoanAssetClassifiApi.get(),
        method: "GET",
}),
providesTags:["LoanAssetClassification"],
transformResponse : (
    response: LoanAssetResponseDto[]
):AssetClassificationType[] =>
    response.map(item=>({
        assetClassificationName:item.assetClassificationName,
        description:item.description,
        isActive:item.isActive,
        identity:item.identity,

    })),
    }),

  updateLoanAssetClassi: build.mutation<
  AssetClassificationType,
  { identity: string; payload: LoanAssetRequestDto }
>({
  query: ({ identity, payload }) => ({
    url: api.LoanAssetClassifiApi.update(identity),
    method: "PUT",
    data: payload,
  }),
  transformResponse: (
    response: LoanAssetResponseDto
  ): AssetClassificationType => ({
    assetClassificationName: response.assetClassificationName,
    description: response.description,
    isActive: response.isActive,
    identity: response.identity,
  }),
  invalidatesTags: ["LoanAssetClassification"],
}),
 

     deleteLoanAssetClassi: build.mutation<void, string>({
      query: assetClassificationName => ({
        url: api.LoanAssetClassifiApi.delete(assetClassificationName),
        method: "DELETE",
      }),
      invalidatesTags: ["LoanAssetClassification"],
    }),
  }),
});
export const {
   useSaveLoanAssetClassiMutation,
   useGetLoanAssetClassiQuery,
   useUpdateLoanAssetClassiMutation,
   useDeleteLoanAssetClassiMutation

} = LoanAssetClassiApi