import { useState, useCallback } from "react";
import { useForm, type Resolver } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { BANK_CONFIG_DEFAULT_VALUES } from "../../constants/coLendingBankConfigDefault";
import { bankConfigTypeSchema } from "@/global/validation/loan-product-and-scheme-masters/co-lending-scheme-mapping/co-lending-bank-config";
import type { BankConfig } from "@/types/loan-product-and-scheme-masters/co-lending-scheme-mapping/co-lending-bank-config.types";
import { logger } from "@/global/service";

export const useCoLendingBankConfigFormController = () => {
  const [showForm, setShowForm] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const {
    control,
    reset,
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<BankConfig>({
    defaultValues: BANK_CONFIG_DEFAULT_VALUES,
    resolver: yupResolver(bankConfigTypeSchema) as Resolver<BankConfig>,
    mode: "onChange",
  });

  const handleShowForm = () => {
    setShowForm(true);
  };
  const handleHideForm = () => {
    reset(BANK_CONFIG_DEFAULT_VALUES);
    setShowForm(false);
  };

  const onSubmit = () => {
    try {
      logger.info("Bank Config Saved Successfully", { toast: true });
      reset(BANK_CONFIG_DEFAULT_VALUES);
    } catch (error) {
      logger.error(error, { toast: true });
    }
  };

  const onReset = useCallback(() => {
    reset(BANK_CONFIG_DEFAULT_VALUES);
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
