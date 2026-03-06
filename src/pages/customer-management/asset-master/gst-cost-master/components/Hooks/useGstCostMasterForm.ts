import { useCallback } from "react";
import { useForm, type Resolver } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import type {
  GstCostMasterType
} from "@/types/customer-management/asset-master/gst-cost-master";
import { logger } from "@/global/service";
import { gstCostMasterSchema } from "@/global/validation/customer-management-master/asset-master/gst-cost-master";
import { DEFAULT_VALUES } from "../../constants/GstCostMaster";

export const useGstCostMasterForm = () => {

  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<GstCostMasterType>({
    defaultValues: DEFAULT_VALUES,
    resolver: yupResolver(gstCostMasterSchema) as Resolver<GstCostMasterType>,
    mode: "onBlur",
  });

  const onSubmit = useCallback(
    async (data: GstCostMasterType) => {
      
      try {
        logger.info("Form submitted successfully", { toast: true });
        console.log("Data:" ,data);
        
        reset(DEFAULT_VALUES);
      } catch (error) {
        logger.error(error, { toast: true });
      }
    },
    [ reset]
  );

  const onCancel = useCallback(() => {
    reset(DEFAULT_VALUES);
  }, [reset]);

  const onReset = useCallback(() => {
    reset(DEFAULT_VALUES);
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
