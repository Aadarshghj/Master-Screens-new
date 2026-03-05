import { useCallback } from "react";
import { useForm, type Resolver } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { logger } from "@/global/service";
import { assetgroupSchema } from "@/global/validation/customer-management-master/asset-master/asset-group";
import { ASSET_GROUP_DEFAULT_VALUES } from "../../constants/AssetGroupDefault";
import { ASSET_TYPE_OPTIONS } from "@/mocks/customer-management-master/asset-master/asset-group";
import type { AssetGroupType } from "@/types/customer-management/asset-master/asset-group.types";

export const useAssetGroupForm = () => {
  const {
    control,
    register,
    watch,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<AssetGroupType>({
    defaultValues: ASSET_GROUP_DEFAULT_VALUES,
    resolver: yupResolver(assetgroupSchema) as Resolver<AssetGroupType>,
    mode: "onBlur",
  });
  const onSubmit = useCallback(
    async (data: AssetGroupType) => {
      const payload: AssetGroupType = {
        id: data.id,
        assetCode: data.assetCode,
        assetName: data.assetName,
        assetType: data.assetType,
        postingGL: data.postingGL,
        description: data.description,
        isActive: data.isActive,
      };

      try {
        await payload;
        logger.info("Asset Group saved successfully", { toast: true });
        reset(ASSET_GROUP_DEFAULT_VALUES);
      } catch (error) {
        logger.error(error, { toast: true });
      }
    },
    [reset]
  );

  const assetTypeValues = watch("assetType")

  const onCancel = useCallback(() => {
    reset(ASSET_GROUP_DEFAULT_VALUES);
  }, [reset]);

  const onReset = useCallback(() => {
    reset(ASSET_GROUP_DEFAULT_VALUES);
  }, [reset]);

  return {
    control,
    register,
    handleSubmit,
    watch,
    errors,
    isSubmitting,
    assetTypeValues,
    assetTypeOptions:ASSET_TYPE_OPTIONS,
    onSubmit,
    onCancel,
    onReset,
  };
};
