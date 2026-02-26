import { useState } from "react";
import { useForm, type Resolver } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import type { FirmRoleType } from "@/types/customer-management/firm-role";
import { FirmRoleSchema } from "@/global/validation/customer-management-master/firm-role";
import { DEFAULT_VALUES } from "../constants/FirmRoleDefault";
import {
  useCreateFirmRoleMutation,
  useDeleteFirmRoleMutation,
  useGetFirmRoleQuery,
} from "@/global/service/end-points/customer-management/firm-role";
import { handleApiError } from "@/utils/error-handler";
import { logger } from "@/global/service";

export const useFirmRoleFormController = () => {
  const [showForm, setShowForm] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [identity, setIdentity] = useState("");
  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FirmRoleType>({
    defaultValues: DEFAULT_VALUES,
    resolver: yupResolver(FirmRoleSchema) as Resolver<FirmRoleType>,
    mode: "onBlur",
  });
  const handleShowForm = () => {
    setShowForm(true);
  };
  const { data: tableData, refetch, isLoading } = useGetFirmRoleQuery();
  const [createFirmRole] = useCreateFirmRoleMutation();
  const [deleteFirmRole] = useDeleteFirmRoleMutation();

  const onSubmit = async (data: FirmRoleType) => {
    try {
      const payload = {
        roleName: data.roleName.toLocaleUpperCase(),
        description: data.description || null,
      };
      await createFirmRole(payload).unwrap();
      logger.info("Firm Role created successfully", {
        toast: true,
      });
      refetch();
    } catch (error: unknown) {
      const errorMessage = handleApiError(error);
      logger.error(errorMessage, {
        toast: true,
        pushLog: false,
      });
    } finally {
      reset(DEFAULT_VALUES);
    }
  };

  const onReset = () => reset(DEFAULT_VALUES);
  const handleHideForm = () => {
    reset(DEFAULT_VALUES);
    setShowForm(false);
  };
  const handleConfirmDelete = async () => {
    try {
      await deleteFirmRole(identity).unwrap();
      logger.info("Firm Role deleted successfully", {
        toast: true,
      });
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
