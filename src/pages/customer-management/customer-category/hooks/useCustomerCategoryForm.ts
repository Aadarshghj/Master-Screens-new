import { useState } from "react";
import { useForm, type Resolver } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { CUSTOMER_CATEGORY_DEFAULT_VALUES } from "../constants/CustomerCategoryDefault";
import { customerCategorySchema } from "@/global/validation/customer-management-master/customer-category";
import type { CustomerCategoryFormData } from "@/types/customer-management/customer-category";
import {
  useCreateCustomerCategoryMutation,
  useDeleteCustomerCategoryMutation,
  useGetCustomerCategoryDataQuery,
} from "@/global/service/end-points/customer-management/customer-category";
import { logger } from "@/global/service";
import { handleApiError } from "@/utils/error-handler";

export const useCustomerCategoryFormController = () => {
  const [showForm, setShowForm] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [identity, setIdentity] = useState("");
  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CustomerCategoryFormData>({
    defaultValues: CUSTOMER_CATEGORY_DEFAULT_VALUES,
    resolver: yupResolver(
      customerCategorySchema
    ) as Resolver<CustomerCategoryFormData>,
    mode: "onBlur",
  });
  const handleShowForm = () => {
    setShowForm(true);
  };
  const {
    data: tableData,
    refetch,
    isLoading,
  } = useGetCustomerCategoryDataQuery();
  const [createCustomerCategory] = useCreateCustomerCategoryMutation();
  const [deleteCustomerCategory] = useDeleteCustomerCategoryMutation();
  const onSubmit = async (data: CustomerCategoryFormData) => {
    try {
      const payload = {
        ...data,
        categoryName: data.categoryName.toLocaleUpperCase(),
      };
      await createCustomerCategory(payload).unwrap();
      logger.info("Customer category created successfully", { toast: true });
      refetch();
    } catch (error: unknown) {
      const errorMessage = handleApiError(error);
      logger.error(errorMessage, {
        toast: true,
        pushLog: false,
      });
    } finally {
      reset(CUSTOMER_CATEGORY_DEFAULT_VALUES);
    }
  };
  const onReset = () => reset(CUSTOMER_CATEGORY_DEFAULT_VALUES);
  const handleHideForm = () => {
    reset(CUSTOMER_CATEGORY_DEFAULT_VALUES);
    setShowForm(false);
  };
  const handleConfirmDelete = async () => {
    try {
      await deleteCustomerCategory(identity).unwrap();
      logger.info("Customer category deleted successfully", { toast: true });
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
