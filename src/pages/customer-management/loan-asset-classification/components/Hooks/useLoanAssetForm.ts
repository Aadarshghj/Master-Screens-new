import { useCallback } from "react";
import { useForm ,type Resolver } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import toast from "react-hot-toast";
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import type { AssetClassificationType, LoanAssetRequestDto } from "@/types/customer-management/loan-asset-classification";
import { LOAN_ASSET_DEFAULT_VALUES } from "../../constants/LoanAssetDefault";
import { LoanAssetClassifictionSchema } from "@/global/validation/customer-management-master/loan-asset";

export const useLoanAsset = (editData ?:AssetClassificationType) => {


  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<AssetClassificationType>({
    defaultValues: editData?? LOAN_ASSET_DEFAULT_VALUES,
    resolver: yupResolver(LoanAssetClassifictionSchema) as Resolver<AssetClassificationType>,
    mode: "onChange",
  });

  
 const onSubmit = useCallback(
  async (data: AssetClassificationType) => {
    const name = data.assetClassiName.toUpperCase();

    const payload: LoanAssetRequestDto = {
      assetClassiName: name,
      description: data.description,
      isActive: data.isActive,
    };

    try {
      if (data.identity) {
        await ({
          identity: data.identity.toString(),
          payload,
        });
        toast.success(`${name} updated successfully`);
      } else {
        toast.success(`${name} added successfully`);
      }
      reset(LOAN_ASSET_DEFAULT_VALUES);
    } 
    
    catch (error) {
      const err = error as FetchBaseQueryError;

      const message =
        typeof err?.data === "object" && err?.data !== null
          ? (err.data as { message?: string }).message
          : undefined;

      toast.error(message ?? `Failed to save ${name}`);
    }
  },
  [reset]
);
    
const onCancel = useCallback( () => {
    reset(LOAN_ASSET_DEFAULT_VALUES);
  },[reset]);

  const onReset = useCallback( () => {
    reset(LOAN_ASSET_DEFAULT_VALUES);
  },[reset]);

  return {
    control,
    register,
    handleSubmit,
    errors,
    isSubmitting,
    onSubmit,
    onReset,
    reset,
    onCancel,
    
  };
};
