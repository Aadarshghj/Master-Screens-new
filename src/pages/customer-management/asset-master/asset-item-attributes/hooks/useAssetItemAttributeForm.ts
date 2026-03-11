import { useState, useCallback } from "react";
import { useForm, type Resolver } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { ASSET_ITEM_DEFAULT_VALUES } from "../constants/form.constants";
import { assetItemAttributeValidationSchema } from "@/global/validation/customer-management-master/asset-master/assetItemAttributes-schema";
import type { AssetItemAttributeBase } from "@/types/customer-management/asset-master/asset-item-attributes.types";
import { logger } from "@/global/service";

export const useAssetItemFormController = () => {
  const [showForm, setShowForm] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const {
    // control,
    reset,
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<AssetItemAttributeBase>({
    defaultValues: ASSET_ITEM_DEFAULT_VALUES,
    resolver: yupResolver(
      assetItemAttributeValidationSchema
    ) as Resolver<AssetItemAttributeBase>,
    mode: "onBlur",
  });

  const handleShowForm = () => {
    setShowForm(true);
  };
  const handleHideForm = () => {
    reset(ASSET_ITEM_DEFAULT_VALUES);
    setShowForm(false);
  };

  const onSubmit = () => {
    //   useCallback(
    //     async (AssetItemAttributesBase) => {
    // const payload: RiskCategoryRequestDto = {
    //   category: data.riskCategoryName.trim().toUpperCase(),
    //   code: data.riskCategoryCode.trim().toUpperCase(),
    // };

    try {
      //   await saveRiskCategory(payload).unwrap();
      logger.info("Risk Category Saved Successfully", { toast: true });
      reset(ASSET_ITEM_DEFAULT_VALUES);
    } catch (error) {
      logger.error(error, { toast: true });
    }
  };

  const onReset = useCallback(() => {
    reset(ASSET_ITEM_DEFAULT_VALUES);
  }, [reset]);

  const handleConfirmDelete = async () => {};
  const handleDelete = (identity: string) => {
    console.log(identity);
    setShowDeleteModal(true);
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
  };
  return {
    onSubmit,
    handleShowForm,
    showForm,
    showDeleteModal,
    handleCancelDelete,
    handleConfirmDelete,
    handleDelete,
    handleSubmit,
    handleHideForm,
    onReset,
    register,
    errors,
    isSubmitting,
  };
};
