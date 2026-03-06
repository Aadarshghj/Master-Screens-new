import { useCallback } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import toast from "react-hot-toast";
import { SUPPLIER_RISK_DEFAULT_VALUE } from "../../constants/SupplierRiskDefault";
import { SupplierRiskSchema } from "@/global/validation/customer-management-master/asset-master/supplier-risk";
import type { SupplierRiskType, SupplierRiskTypeDto } from "@/types/customer-management/asset-master/supplier-risk";



export const useSupplierRisk = () => {
  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<SupplierRiskType>({
    defaultValues: SUPPLIER_RISK_DEFAULT_VALUE,
    resolver: yupResolver(SupplierRiskSchema),
    mode: "onChange",
  });

  const onSubmit = useCallback(async (data: SupplierRiskType) => {

    const payload: SupplierRiskTypeDto = {
      riskcategorytype: data.riskcategorytype.toUpperCase(),
      description: data.description.toUpperCase(),
      status: data.status,
   

    };
    try {
      await payload
      reset(SUPPLIER_RISK_DEFAULT_VALUE)
      toast.success(" Risk Category Type Added Successfully")
    } catch {
      toast.error("Failed to Add   Supplier Risk Category")
    }
  }, [reset]);

  const onCancel = useCallback(() => {
    reset(SUPPLIER_RISK_DEFAULT_VALUE);
  }, [reset]);

  const onReset = useCallback(() => {
    reset(SUPPLIER_RISK_DEFAULT_VALUE);
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

