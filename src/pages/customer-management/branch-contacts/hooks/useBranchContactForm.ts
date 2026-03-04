import { useState } from "react";
import { useForm, type Resolver } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { branchContactSchema } from "@/global/validation/customer-management-master/branch-contact";
import { BRANCH_CONTACT_DEFAULT_VALUES } from "../constants/BranchContactsDefault";
import type { BranchContactFormData } from "@/types/customer-management/branch-contact";
import {
  useCreateBranchContactMutation,
  useDeleteBranchContactMutation,
  useGetBranchContactDetailsQuery,
  useGetBranchDataQuery,
} from "@/global/service/end-points/customer-management/branch-contact";
import { logger } from "@/global/service";
import { handleApiError } from "@/utils/error-handler";

export const useBranchContactFormController = () => {
  const [showForm, setShowForm] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [identity, setIdentity] = useState("");
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<BranchContactFormData>({
    defaultValues: BRANCH_CONTACT_DEFAULT_VALUES,
    resolver: yupResolver(
      branchContactSchema
    ) as Resolver<BranchContactFormData>,
    mode: "onBlur",
  });
  const handleShowForm = () => {
    setShowForm(true);
  };
  const { data: branches = [] } = useGetBranchDataQuery();
  const {
    data: tableData,
    refetch,
    isLoading,
  } = useGetBranchContactDetailsQuery();
  const [createBranchContact] = useCreateBranchContactMutation();
  const [deleteBranchContact] = useDeleteBranchContactMutation();
  const branchOption = branches.map(item => {
    return {
      value: item.identity,
      label: item.branchName,
      identity: item.identity,
      code: item.branchCode,
    };
  });

  const onSubmit = async (data: BranchContactFormData) => {
    try {
      const payload = {
        ...data,
        channel: data.channel.toUpperCase(),
      };
      await createBranchContact(payload).unwrap();
      logger.info("Branch contact created successfully", { toast: true });
      refetch();
    } catch (error: unknown) {
      const errorMessage = handleApiError(error);
      logger.error(errorMessage, {
        toast: true,
        pushLog: false,
      });
    } finally {
      reset(BRANCH_CONTACT_DEFAULT_VALUES);
    }
  };
  const onReset = () => reset(BRANCH_CONTACT_DEFAULT_VALUES);
  const handleHideForm = () => {
    reset(BRANCH_CONTACT_DEFAULT_VALUES);
    setShowForm(false);
  };
  const handleConfirmDelete = async () => {
    try {
      await deleteBranchContact(identity).unwrap();
      logger.info("Branch contact deleted successfully", { toast: true });
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
    branchOption,
  };
};
