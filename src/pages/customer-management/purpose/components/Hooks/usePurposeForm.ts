import { useCallback } from "react";
import { useForm, type Resolver } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import type {
  Purpose,
  PurposeRequestDto,
} from "@/types/customer-management/purpose";
import { PURPOSE_DEFAULT_VALUES } from "../../constants/PurposeDefault";
import { purposeSchema } from "@/global/validation/customer-management-master/purpose";
import { useSavePurposeMutation } from "@/global/service/end-points/customer-management/purpose";
import { logger } from "@/global/service";

export const usePurposeForm = () => {
  const [savePurpose] = useSavePurposeMutation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<Purpose>({
    defaultValues: PURPOSE_DEFAULT_VALUES,
    resolver: yupResolver(purposeSchema) as Resolver<Purpose>,
    mode: "onBlur",
  });

  const onSubmit = useCallback(
    async (data: Purpose) => {
      const payload: PurposeRequestDto = {
        name: data.purposeType.trim().toUpperCase(),
        code: data.purposeCode.trim().toUpperCase(),
      };

      try {
        await savePurpose(payload).unwrap();
        logger.info("Purpose Saved Successfully", { toast: true });
        reset(PURPOSE_DEFAULT_VALUES);
      } catch (err) {
        logger.error(err, { toast: true });
      }
    },
    [savePurpose, reset]
  );

  const onCancel = () => reset(PURPOSE_DEFAULT_VALUES);
  const onReset = () => reset(PURPOSE_DEFAULT_VALUES);

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
