import { useState } from "react";
import { useForm, type Resolver } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import type { FirmData } from "@/types/customer-management/firm-type";
import { firmTypeSchema } from "@/global/validation/customer-management-master/firm-type";
import { FIRM_TYPE_DEFAULT_VALUES } from "../constants/FirmTypeDefault";
import {
  useCreateFirmTypeMutation,
  useDeleteFirmDataMutation,
  useGetFirmDataQuery,
} from "@/global/service/end-points/customer-management/firm-type";
import { logger } from "@/global/service";
import { handleApiError } from "@/utils/error-handler";

export const useFirmFormController = () => {
  const [showForm, setShowForm] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [identity, setIdentity] = useState("");
  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FirmData>({
    defaultValues: FIRM_TYPE_DEFAULT_VALUES,
    resolver: yupResolver(firmTypeSchema) as Resolver<FirmData>,
    mode: "onBlur",
  });
  const handleShowForm = () => {
    setShowForm(true);
  };

  const { data: tableData, refetch, isLoading } = useGetFirmDataQuery();
  const [createFirm] = useCreateFirmTypeMutation();
  const [deleteFirm] = useDeleteFirmDataMutation();

  const onSubmit = async (data: FirmData) => {
    try {
      const payload = {
        firmType: data.firmType.toLocaleUpperCase(),
        description: data.description || null,
      };
      await createFirm(payload).unwrap();
      logger.info("Firm type created successfully", { toast: true });
      refetch();
    } catch (error: unknown) {
      const errorMessage = handleApiError(error);
      logger.error(errorMessage, {
        toast: true,
        pushLog: false,
      });
    } finally {
      reset(FIRM_TYPE_DEFAULT_VALUES);
    }
  };

  const onReset = () => reset(FIRM_TYPE_DEFAULT_VALUES);
  const handleHideForm = () => {
    reset(FIRM_TYPE_DEFAULT_VALUES);
    setShowForm(false);
  };
  const handleConfirmDelete = async () => {
    try {
      await deleteFirm(identity).unwrap();
      logger.info("Firm type deleted successfully", { toast: true });
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
