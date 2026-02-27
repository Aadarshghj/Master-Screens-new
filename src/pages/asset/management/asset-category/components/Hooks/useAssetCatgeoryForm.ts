import { useCallback, useState } from "react";
// import { useAppDispatch } from "@/hooks/store";
// import toast from "react-hot-toast";
import { useForm, type Resolver } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
// import { apiInstance } from "@/global/service/api-instance";
import { ASSET_CATEGORY_DEFAULT_VALUES } from "../../constants/AssetCategoryDefault";
import { assetCategorySchema } from "../../../../../../global/validation/asset-mgmt/asset-category.validate";
import type { AssetCategory } from "../../../../../../types/asset-mgmt/asset-category";
import { logger } from "../../../../../../global/service";

export const useAssetCategoryForm = () => {
  // const dispatch = useAppDispatch();

  const [counter, setCounter] = useState(1);
  const generatedCode= `AA-${String(counter).padStart(4,"0")}`;

  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<AssetCategory>({
    defaultValues: ASSET_CATEGORY_DEFAULT_VALUES,
    resolver: yupResolver(assetCategorySchema) as Resolver<AssetCategory>,
    mode: "onBlur",
  });

  // const [saveDocumentType] = useSaveAssetCategoryMutation();

  const onSubmit = useCallback(
    async (data: AssetCategory) => {
      const payload: AssetCategory = {
        assetGroupCode: generatedCode,
        assetCategoryName: data.assetCategoryName.toUpperCase(),
        assetCategoryDesc: data.assetCategoryDesc,
        status: data.status,
      };
      try {
        await payload;
        logger.info("Saved", { toast: true });
        reset(ASSET_CATEGORY_DEFAULT_VALUES);
      } catch (error) {
        logger.error(error, { toast: true });
      }
    },
    [reset]
  );

  const onCancel = useCallback(() => {
    reset(ASSET_CATEGORY_DEFAULT_VALUES);
  }, [reset]);

  const onReset = useCallback(() => {
    reset(ASSET_CATEGORY_DEFAULT_VALUES);
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
