import { useCallback } from "react";
import { useForm, type Resolver } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import type {
  RiskCategoryRequestDto,
  RiskCategoryType,
} from "@/types/customer-management/risk-category";
import { RISK_CATEGORY_DEFAULT_VALUES } from "../../constants/RiskCategoryDefault";
import { riskCategorySchema } from "@/global/validation/customer-management-master/risk-category";
import { useSaveRiskCategoryMutation } from "@/global/service/end-points/customer-management/risk-categories";
import { logger } from "@/global/service";

export const useRiskCategoryForm = () => {
  const [saveRiskCategory] = useSaveRiskCategoryMutation();

  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<RiskCategoryType>({
    defaultValues: RISK_CATEGORY_DEFAULT_VALUES,
    resolver: yupResolver(riskCategorySchema) as Resolver<RiskCategoryType>,
    mode: "onBlur",
  });

  const onSubmit = useCallback(
    async (data: RiskCategoryType) => {
      const payload: RiskCategoryRequestDto = {
        category: data.riskCategoryName.trim().toUpperCase(),
        code: data.riskCategoryCode.trim().toUpperCase(),
      };

      try {
        await saveRiskCategory(payload).unwrap();
        logger.info("Risk Category Saved Successfully", { toast: true });
        reset(RISK_CATEGORY_DEFAULT_VALUES);
      } catch (error) {
        logger.error(error, { toast: true });
      }
    },
    [saveRiskCategory, reset]
  );

  const onCancel = useCallback(() => {
    reset(RISK_CATEGORY_DEFAULT_VALUES);
  }, [reset]);

  const onReset = useCallback(() => {
    reset(RISK_CATEGORY_DEFAULT_VALUES);
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
