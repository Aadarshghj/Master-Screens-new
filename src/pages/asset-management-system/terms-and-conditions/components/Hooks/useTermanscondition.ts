import { useCallback } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import toast from "react-hot-toast";
import { TERMS_AND_CONDITION_DEFAULT_VALUE } from "../../constants/termsAndConditionDefault";
import type { TermsAndConditionType, TermsAndConditionTypeDto } from "@/types/asset-management-system/terms-and-condition";
import { termsAndConditionSchema } from "@/global/validation/asset-management-system/terms-and-condition";


export const useTermAndCondition = () => {
  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<TermsAndConditionType>({
    defaultValues: TERMS_AND_CONDITION_DEFAULT_VALUE,
    resolver: yupResolver(termsAndConditionSchema),
    mode: "onChange",
  });

  const onSubmit = useCallback(async (data: TermsAndConditionType) => {

    const payload: TermsAndConditionTypeDto = {
      termsandconditioncode: data.termsandconditioncode.toUpperCase(),
      termsandconditionname: data.termsandconditionname.toUpperCase(),
      status: data.status,
      

    };
    try {
      await payload
      reset(TERMS_AND_CONDITION_DEFAULT_VALUE)
      toast.success("Terms & Conditions Added Successfully")
    } catch {
      toast.error("Failed to Add Terms & Conditions")
    }
  }, [reset]);

  const onCancel = useCallback(() => {
    reset(TERMS_AND_CONDITION_DEFAULT_VALUE);
  }, [reset]);

  const onReset = useCallback(() => {
    reset(TERMS_AND_CONDITION_DEFAULT_VALUE);
  }, [reset]);

  return {
    control,
    register,
    handleSubmit,
    errors,
    isSubmitting,
    onSubmit,
    onCancel,
    onReset,
  };
};

