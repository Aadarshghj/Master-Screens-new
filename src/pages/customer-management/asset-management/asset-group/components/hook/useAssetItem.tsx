import { useCallback } from "react";
import { useForm, type Resolver } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import type { AssetItemType } from "@/types/customer-management/asset-item";
import { AssetItemSchema } from "@/global/validation/customer-management-master/asset-items";
import { DEFAULT_VALUES } from "../../constants/AssetItemDefault";

import toast from "react-hot-toast";

export const useAssetItem = () => {
  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<AssetItemType>({
    defaultValues: DEFAULT_VALUES,
    resolver: yupResolver(AssetItemSchema) as Resolver<AssetItemType>,
    mode: "onBlur",
  });

  const onSubmit = useCallback(
    async (data: AssetItemType) => {
      try {
        console.log("Mock Asset Item Saved:", data);

        await new Promise(resolve => setTimeout(resolve, 500));

        reset(DEFAULT_VALUES);
        toast.success("Asset Item saved successfully (Mock)");
      } catch {
        toast.error("Failed to save Asset Item");
      }
    },
    [reset]
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
    reset,
  };
};
