
import type { RiskAssessmentTypeHistory, RiskAssessTypeRequestDto, RiskAssessTypeResponseDto } from "@/types/customer-management/risk-assessment-type-history";
import { apiInstance } from "../../api-instance";
import { api } from "@/api";

export const riskAssessmentTypeApi = apiInstance.injectEndpoints({
    endpoints:build =>({
        saveRiskAssessmentType: build.mutation<
       RiskAssessmentTypeHistory,
        RiskAssessTypeRequestDto
        
>({
    query:payload => ({
        url: api.riskAssessmentType.save(),
        method:"POST",
        data:payload 
    }),
    invalidatesTags:["RiskAssessmentType"],
}),
getMasterRiskAssessmentType : build.query<RiskAssessmentTypeHistory[],void>({
    query: () => ({
        url: api.riskAssessmentType.get(),
        method: "GET",
}),
providesTags:["RiskAssessmentType"],
transformResponse : (
    response: RiskAssessTypeResponseDto[]
):RiskAssessmentTypeHistory[] =>
    response.map(item=>({
        riskAssessmentType:item.riskAssessmentType,
        description:item.description,
        isActive:item.isActive,
        identity:item.identity,

    })),
    }),

  updateRiskAssessmentType: build.mutation<
  RiskAssessmentTypeHistory,
  { identity: string; payload: RiskAssessTypeRequestDto }
>({
  query: ({ identity, payload }) => ({
    url: api.riskAssessmentType.update(identity),
    method: "PUT",
    data: payload,
  }),
  transformResponse: (
    response: RiskAssessTypeResponseDto
  ): RiskAssessmentTypeHistory => ({
    riskAssessmentType: response.riskAssessmentType,
    description: response.description,
    isActive: response.isActive,
    identity: response.identity,
  }),
  invalidatesTags: ["RiskAssessmentType"],
}),
 

     deleteRiskAssessmentType: build.mutation<void, string>({
      query: riskAssessmentType => ({
        url: api.riskAssessmentType.delete(riskAssessmentType),
        method: "DELETE",
      }),
      invalidatesTags: ["RiskAssessmentType"],
    }),
  }),
});
export const {
    useSaveRiskAssessmentTypeMutation,
    useGetMasterRiskAssessmentTypeQuery,
    useUpdateRiskAssessmentTypeMutation,
    useDeleteRiskAssessmentTypeMutation
} = riskAssessmentTypeApi