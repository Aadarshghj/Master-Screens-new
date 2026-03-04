import { useCallback } from "react";
import { useForm, type Resolver } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import type {
  LeadSource,
  LeadSourceRequestDto,
} from "@/types/customer-management/lead-source";
import { LEAD_SOURCE_DEFAULT_VALUES } from "../../constants/LeadSourceDefault";
import { leadSourceSchema } from "@/global/validation/customer-management-master/lead-source";
import { useSaveLeadSourceMutation } from "@/global/service/end-points/customer-management/lead-sources";
import { logger } from "@/global/service";

export const useLeadSourceForm = () => {
  const [saveLeadSource] = useSaveLeadSourceMutation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<LeadSource>({
    defaultValues: LEAD_SOURCE_DEFAULT_VALUES,
    resolver: yupResolver(leadSourceSchema) as Resolver<LeadSource>,
    mode: "onBlur",
  });

  const onSubmit = useCallback(
    async (data: LeadSource) => {
      const payload: LeadSourceRequestDto = {
        name: data.leadSourceName.trim(),
        description: data.description.trim(),
      };

      try {
        await saveLeadSource(payload).unwrap();
        logger.info("Lead Source Saved Successfully", { toast: true });
        reset(LEAD_SOURCE_DEFAULT_VALUES);
      } catch (error) {
        logger.error(error, { toast: true });
      }
    },
    [saveLeadSource, reset]
  );

  const onCancel = useCallback(() => {
    reset(LEAD_SOURCE_DEFAULT_VALUES);
  }, [reset]);

  const onReset = useCallback(() => {
    reset(LEAD_SOURCE_DEFAULT_VALUES);
  }, [reset]);

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
