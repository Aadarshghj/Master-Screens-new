import { useCallback } from "react";
import { useForm, type Resolver } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import type {
  ReferralSource,
  ReferralSourceRequestDto,
} from "@/types/customer-management/referral-sources";
import { referralSourceSchema } from "@/global/validation/customer-management-master/referral-source";
import { REFERRAL_DEFAULT_VALUES } from "../../constants/ReferralSourceDefault";
import { logger } from "@/global/service";
import { useSaveReferralSourceMutation } from "@/global/service/end-points/customer-management/referral-sources";

export const useReferralSourceForm = () => {
  const [saveReferralSource] = useSaveReferralSourceMutation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ReferralSource>({
    defaultValues: REFERRAL_DEFAULT_VALUES,
    resolver: yupResolver(referralSourceSchema) as Resolver<ReferralSource>,
    mode: "onBlur",
  });

  const onSubmit = useCallback(
    async (data: ReferralSource) => {
      const payload: ReferralSourceRequestDto = {
        name: data.referralName.trim().toUpperCase(),
        code: data.referralCode.trim().toUpperCase(),
      };

      try {
        await saveReferralSource(payload).unwrap();
        logger.info("Referral Source saved successfully", { toast: true });
        reset(REFERRAL_DEFAULT_VALUES);
      } catch (err) {
        logger.error(err, { toast: true });
      }
    },
    [saveReferralSource, reset]
  );

  const onCancel = () => reset(REFERRAL_DEFAULT_VALUES);
  const onReset = () => reset(REFERRAL_DEFAULT_VALUES);

  return {
    register,
    handleSubmit,
    errors,
    isSubmitting,
    onSubmit,
    onCancel,
    onReset,
  };
};
