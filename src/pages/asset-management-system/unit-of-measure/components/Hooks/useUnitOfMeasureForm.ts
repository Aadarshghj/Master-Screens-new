import { useCallback } from "react";
import { useForm, type Resolver } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import type {
  UnitOfMeasureType
} from "@/types/asset-management-system/unit-of-measure";
import { logger } from "@/global/service";
import { unitOfMeasureSchema } from "@/global/validation/asset-management-system/unit-of-measure";
import { DEFAULT_VALUES } from "../../constants/UnitOfMeasure";

export const useUnitOfMeasureForm = () => {

  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<UnitOfMeasureType>({
    defaultValues: DEFAULT_VALUES,
    resolver: yupResolver(unitOfMeasureSchema) as Resolver<UnitOfMeasureType>,
    mode: "onBlur",
  });

  const onSubmit = useCallback(
    async (data: UnitOfMeasureType) => {
      
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
