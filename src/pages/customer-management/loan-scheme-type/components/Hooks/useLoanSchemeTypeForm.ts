import { useCallback } from "react";
import { useForm, type Resolver } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import type {
  LoanSchemeTypeType
} from "@/types/customer-management/loan-scheme-type";
import { logger } from "@/global/service";
import { loanSchemeTypeSchema } from "@/global/validation/customer-management-master/loan-scheme-type";
import { DEFAULT_VALUES } from "../../constants/LoanSchemeTypeDefaults";

export const useLoanSchemeTypeForm = () => {

  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<LoanSchemeTypeType>({
    defaultValues: DEFAULT_VALUES,
    resolver: yupResolver(loanSchemeTypeSchema) as Resolver<LoanSchemeTypeType>,
    mode: "onBlur",
  });

  const onSubmit = useCallback(
    async (data: LoanSchemeTypeType) => {
      
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
