import { useCallback } from "react";
import { useForm, type Resolver } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import type {
  SupplierInformationType
} from "@/types/asset-management-system/supplier-management/supplier-information";
import { logger } from "@/global/service";
import { supplierInformationSchema } from "@/global/validation/asset-management-system/supplier-management/supplier-informations"
import { DEFAULT_VALUES } from "../../constants/SupplierInformation";
export const useSupplierInformationForm = () => {

  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<SupplierInformationType>({
    defaultValues: DEFAULT_VALUES,
    resolver: yupResolver(supplierInformationSchema) as Resolver<SupplierInformationType>,
    mode: "onBlur",
  });

  const onSubmit = useCallback(
    async (data: SupplierInformationType) => {
      
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
