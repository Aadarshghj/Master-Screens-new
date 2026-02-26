import { useState } from "react";
import { useForm, type Resolver } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import type { StaffFormData } from "@/types/customer-management/staffs";
import { STAFF_DEFAULT_VALUES } from "../constants/StaffsDefault";
import { staffSchema } from "@/global/validation/customer-management-master/staffs";
import {
  useCreateStaffMutation,
  useDeleteStaffMutation,
  useGetStaffDetailsQuery,
} from "@/global/service/end-points/customer-management/staff";
import { logger } from "@/global/service/logger";
import { handleApiError } from "@/utils/error-handler";

export const useStaffFormController = () => {
  const [showForm, setShowForm] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [identity, setIdentity] = useState("");
  const {
    control,
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<StaffFormData>({
    defaultValues: STAFF_DEFAULT_VALUES,
    resolver: yupResolver(staffSchema) as Resolver<StaffFormData>,
    mode: "onBlur",
  });
  const handleShowForm = () => {
    setShowForm(true);
  };
  const { data: tableData, refetch, isLoading } = useGetStaffDetailsQuery();
  const [createStaff] = useCreateStaffMutation();
  const [deleteStaff] = useDeleteStaffMutation();
  const reportingPersonOption = tableData?.map(item => {
    return {
      value: item.identity,
      label: item.staffName,
      identity: item.identity,
      code: item.staffCode,
    };
  });

  const appUser = watch("isAppUser");

  const onSubmit = async (data: StaffFormData) => {
    try {
      const payload = {
        ...data,
        staffName: data.staffName.toLocaleUpperCase(),
      };
      await createStaff(payload).unwrap();
      logger.info("Staff created successfully", { toast: true });
      refetch();
    } catch (error: unknown) {
      const errorMessage = handleApiError(error);
      logger.error(errorMessage, {
        toast: true,
        pushLog: false,
      });
    } finally {
      reset(STAFF_DEFAULT_VALUES);
    }
  };

  const onReset = () => reset(STAFF_DEFAULT_VALUES);
  const handleHideForm = () => {
    reset(STAFF_DEFAULT_VALUES);
    setShowForm(false);
  };
  const handleConfirmDelete = async () => {
    try {
      await deleteStaff(identity).unwrap();
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
    appUser,
    reportingPersonOption,
  };
};
