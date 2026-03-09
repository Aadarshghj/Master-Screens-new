import { useCallback } from "react";
import { useForm, type Resolver } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import type {
  DepreciationMethodsType
} from "@/types/customer-management/asset-master/depreciation-methods";
import { logger } from "@/global/service";
import { depreciationMethodsSchema } from "@/global/validation/customer-management-master/asset-master/depreciation-methods"
import { DEFAULT_VALUES } from "../../constants/DepreciationMethods";
export const useDepreciationMethodsForm = () => {

  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<DepreciationMethodsType>({
    defaultValues: DEFAULT_VALUES,
    resolver: yupResolver(depreciationMethodsSchema) as Resolver<DepreciationMethodsType>,
    mode: "onBlur",
  });

  const onSubmit = useCallback(
    async (data: DepreciationMethodsType) => {
      
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
