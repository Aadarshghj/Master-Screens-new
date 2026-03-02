import {  useState } from "react";
import { useForm, type Resolver } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import type { SourceOfIncomeData, SourceOfIncomeFormData } from "@/types/customer-management/source-income";

import { sourceOfIncomeSchema } from "@/global/validation/customer-management-master/source-income";
import {
  useCreateSourceOfIncomeMutation,
  useDeleteSourceOfIncomeMutation,
  useGetSourceOfIncomeDetailsQuery,
  useUpdateSourceOfIncomeMutation,
} from "@/global/service/end-points/customer-management/source-of-income";
import { logger } from "@/global/service";
import { SOURCE_OF_INCOME_DEFAULT_VALUES } from "../../constants/SourceOfIncomeDefault";


export const useSourceOfIncomeFormController = (editData?:SourceOfIncomeData) => {
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
  defaultValues: editData
    ? {
        name: editData.name,
        code: editData.code,
      }
    : SOURCE_OF_INCOME_DEFAULT_VALUES,
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
  const [updateSourceOfIncome]=useUpdateSourceOfIncomeMutation();
const onSubmit = async (data: SourceOfIncomeFormData) => {
  const name = "Source of Income";

  const payload = {
    name: data.name.toUpperCase(),
    code: data.code.toUpperCase(),
  };

  try {
    if (editData?.identity) {
      await updateSourceOfIncome({
        identity: editData.identity,
        payload,
      }).unwrap();

      logger.info(`${name} updated successfully`, { toast: true });
    } else {
      await createSourceOfIncome(payload).unwrap();
      logger.info(`${name} added successfully`, { toast: true });
    }

    reset(SOURCE_OF_INCOME_DEFAULT_VALUES);
  } catch {
    logger.error(
      "Source of income with this name or code already exists",
      { toast: true }
    );
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
    reset
  };
};
