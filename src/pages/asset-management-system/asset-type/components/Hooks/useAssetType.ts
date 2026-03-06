import { useCallback } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import toast from "react-hot-toast";
import { ASSET_TYPE_DEFAULT_VALUE } from "../../constants/AssetTypeDefault";
import { assetTypeSchema } from "@/global/validation/asset-management-system/asset-type";
import type { AssetType, AssetTypeDto } from "@/types/asset-management-system/asset-type";

export const useAssetType = () => {
  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<AssetType>({
    defaultValues: ASSET_TYPE_DEFAULT_VALUE,
    resolver: yupResolver(assetTypeSchema),
    mode: "onChange",
  });
  
  const onSubmit = useCallback(async (data: AssetType) => {
    const payload: AssetTypeDto = {
      assetTypeCode: data.assetTypeCode.toUpperCase(),
      assetTypeName: data.assetTypeName.toUpperCase(),
      description: data.description,
      status: data.status,
      depreciable: data.depreciable      
    };

    try {
      await payload
      reset(ASSET_TYPE_DEFAULT_VALUE)
      toast.success("Asset Type Added Successfully")
    } catch {
      toast.error("Failed to Add Asset Type")
    }
  }, [reset]);

  const onCancel = useCallback(() => {
    reset(ASSET_TYPE_DEFAULT_VALUE);
  }, [reset]);

  const onReset = useCallback(() => {
    reset(ASSET_TYPE_DEFAULT_VALUE);
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

