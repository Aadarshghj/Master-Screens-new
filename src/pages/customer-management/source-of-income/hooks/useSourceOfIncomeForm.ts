import { useState } from "react";
import { useForm, type Resolver } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import type { SourceOfIncomeFormData } from "@/types/customer-management/source-income";
import { SOURCE_OF_INCOME_DEFAULT_VALUES } from "../constants/SourceOfIncomeDefault";
import { sourceOfIncomeSchema } from "@/global/validation/customer-management-master/source-income";
import {
  useCreateSourceOfIncomeMutation,
  useDeleteSourceOfIncomeMutation,
  useGetSourceOfIncomeDetailsQuery,
} from "@/global/service/end-points/customer-management/source-of-income";
import { logger } from "@/global/service";
import { handleApiError } from "@/utils/error-handler";

export const useSourceOfIncomeFormController = () => {
  const [showForm, setShowForm] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [identity, setIdentity] = useState("");
  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<SourceOfIncomeFormData>({
    defaultValues: SOURCE_OF_INCOME_DEFAULT_VALUES,
    resolver: yupResolver(
      sourceOfIncomeSchema
    ) as Resolver<SourceOfIncomeFormData>,
    mode: "onBlur",
  });
  const handleShowForm = () => {
    setShowForm(true);
  };
  const {
    data: tableData,
    refetch,
    isLoading,
  } = useGetSourceOfIncomeDetailsQuery();
  const [createSourceOfIncome] = useCreateSourceOfIncomeMutation();
  const [deleteSourceOfIncome] = useDeleteSourceOfIncomeMutation();
  const onSubmit = async (data: SourceOfIncomeFormData) => {
    try {
      const payload = {
        name: data.name.toLocaleUpperCase(),
        code: data.code.toLocaleUpperCase(),
      };
      await createSourceOfIncome(payload).unwrap();
      logger.info("Source of income created successfully", { toast: true });
      refetch();
    } catch (error: unknown) {
      const errorMessage = handleApiError(error);
      logger.error(errorMessage, {
        toast: true,
        pushLog: false,
      });
    } finally {
      reset(SOURCE_OF_INCOME_DEFAULT_VALUES);
    }
  };

  const onReset = () => reset(SOURCE_OF_INCOME_DEFAULT_VALUES);
  const handleHideForm = () => {
    reset(SOURCE_OF_INCOME_DEFAULT_VALUES);
    setShowForm(false);
  };
  const handleConfirmDelete = async () => {
    try {
      await deleteSourceOfIncome(identity).unwrap();
      logger.info("Source of income deleted successfully", { toast: true });
      refetch();
    } catch (error) {
      setShowDeleteModal(false);
      setIdentity("");
      logger.error(error, { toast: true });
    } finally {
      setShowDeleteModal(false);
      setIdentity("");
    }
  };
  const handleDelete = (identity: string) => {
    setIdentity(identity);
    setShowDeleteModal(true);
  };
  const handleCancelDelete = () => {
    setShowDeleteModal(false);
  };
  return {
    tableData,
    control,
    register,
    handleSubmit,
    errors,
    isSubmitting,
    onSubmit,
    onReset,
    handleShowForm,
    handleHideForm,
    showForm,
    showDeleteModal,
    handleCancelDelete,
    handleConfirmDelete,
    handleDelete,
    isLoading,
  };
};
