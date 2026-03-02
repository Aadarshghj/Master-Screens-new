import { useCallback } from "react";
import { useForm, type Resolver } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { logger } from "@/global/service";
import { assetgroupSchema } from "@/global/validation/asset-management-system/asset-group";
import { ASSET_GROUP_DEFAULT_VALUES } from "../../constants/AssetGroupDefault";
import { ASSET_TYPE_OPTIONS } from "@/mocks/asset-management-system/asset-group";
import type { AssetGroupType } from "@/types/asset-management-system/asset-group.types";

export const useAssetGroupForm = () => {
  const {
    control,
    register,
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
    errors,
    isSubmitting,
    assetTypeOptions:ASSET_TYPE_OPTIONS,
    onSubmit,
    onCancel,
    onReset,
  };
};
