import { useState, useCallback } from "react";
import { useForm, type Resolver } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { logger } from "@/global/service";
import type { CoLendingSchemeMapType } from "@/types/loan-product-and-scheme-masters/co-lending-scheme-mapping/co-lending-scheme-map";
import { coLenderSChemeMapSchema } from "@/global/validation/loan-product-and-scheme-masters/co-lending-scheme-mapping/co-lending-scheme-map";
import { COLENDING_SCHEME_MAP_DEFAULT_VALUES } from "../../constants/coLendingSchemreMapDefault";

export const useCoLendingSchemeMapFormController = () => {
  const [showForm, setShowForm] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const {
    control,
    reset,
   register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CoLendingSchemeMapType>({
    defaultValues: COLENDING_SCHEME_MAP_DEFAULT_VALUES,
    resolver: yupResolver(
      coLenderSChemeMapSchema
    ) as Resolver<CoLendingSchemeMapType>,
    mode: "onBlur",
  });

  const handleShowForm = () => {
    setShowForm(true);
  };
  const handleHideForm = () => {
    reset(COLENDING_SCHEME_MAP_DEFAULT_VALUES);
    setShowForm(false);
  };

  const onSubmit = () => {
    try {
      logger.info("Bank Config Saved Successfully", { toast: true });
      reset(COLENDING_SCHEME_MAP_DEFAULT_VALUES);
    } catch (error) {
      logger.error(error, { toast: true });
    }
  };

  const onReset = useCallback(() => {
    reset(COLENDING_SCHEME_MAP_DEFAULT_VALUES);
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
    control,
    onReset,
   register,
    errors,
    isSubmitting,
  };
};