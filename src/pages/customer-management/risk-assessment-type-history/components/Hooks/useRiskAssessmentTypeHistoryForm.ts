import { useCallback } from "react";
import { useForm ,type Resolver } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import type { RiskAssessmentTypeHistory , RiskAssessTypeRequestDto} from "@/types/customer-management/risk-assessment-type-history";
import { riskAssessmentTypeHistorySchema } from "@/global/validation/customer-management-master/risk-assessment-type-history";
import { RISK_ASSESSMENT_TYPE_DEFAULT_VALUES } from "../../constants/RiskAssessmentTypeHistoryDefault";
import toast from "react-hot-toast";
import { useSaveRiskAssessmentTypeMutation, useUpdateRiskAssessmentTypeMutation,  } from "@/global/service/end-points/customer-management/risk-assessment-type";
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";

export const useRiskAssessmentType = (editData ?:RiskAssessmentTypeHistory) => {
const [saveRiskAssessmentType] = useSaveRiskAssessmentTypeMutation()
const [updateRiskAssessmentType]= useUpdateRiskAssessmentTypeMutation()

  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<RiskAssessmentTypeHistory>({
    defaultValues: editData?? RISK_ASSESSMENT_TYPE_DEFAULT_VALUES,
    resolver: yupResolver(riskAssessmentTypeHistorySchema) as Resolver<RiskAssessmentTypeHistory>,
    mode: "onChange",
  });

  
 const onSubmit = useCallback(
  async (data: RiskAssessmentTypeHistory) => {
    const name = data.riskAssessmentType.toUpperCase();

    const payload: RiskAssessTypeRequestDto = {
      riskAssessmentType: name,
      description: data.description,
      isActive: data.isActive,
    };

    try {
      if (data.identity) {
        await updateRiskAssessmentType({
          identity: data.identity.toString(),
          payload,
        }).unwrap();
        toast.success(`${name} updated successfully`);
      } else {
        await saveRiskAssessmentType(payload).unwrap();
        toast.success(`${name} added successfully`);
      }
      reset(RISK_ASSESSMENT_TYPE_DEFAULT_VALUES);
    } 
    
    catch (error) {
      const err = error as FetchBaseQueryError;

      const message =
        typeof err?.data === "object" && err?.data !== null
          ? (err.data as { message?: string }).message
          : undefined;

      toast.error(message ?? `Failed to save ${name}`);
    }
  },
  [reset, saveRiskAssessmentType, updateRiskAssessmentType]
);
    
const onCancel = useCallback( () => {
    reset(RISK_ASSESSMENT_TYPE_DEFAULT_VALUES);
  },[reset]);

  const onReset = useCallback( () => {
    reset(RISK_ASSESSMENT_TYPE_DEFAULT_VALUES);
  },[reset]);

  return {
    control,
    register,
    handleSubmit,
    errors,
    isSubmitting,
    onSubmit,
    onReset,
    reset,
    onCancel,
    
  };
};
