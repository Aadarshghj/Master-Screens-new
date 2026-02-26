import { useState } from "react";
import { useForm, type Resolver } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { SectoralPerformanceSchema } from "@/global/validation/customer-management-master/sectoral-performance";
import { DEFAULT_VALUES } from "../constants/SectoralPerformanceDefault";
import {
  useCreateSectoralPerformanceMutation,
  useDeleteSectoralPerformanceMutation,
  useGetSectoralPerformanceQuery,
} from "@/global/service/end-points/customer-management/sectoral-performances";
import type { sectoralPerformanceFormData } from "@/types/customer-management/sectoral-performance";
import { logger } from "@/global/service";
import { handleApiError } from "@/utils/error-handler";

export const useSectoralPerformanceForm = () => {
  const [showForm, setShowForm] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [identity, setIdentity] = useState("");
  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<sectoralPerformanceFormData>({
    defaultValues: DEFAULT_VALUES,
    resolver: yupResolver(
      SectoralPerformanceSchema
    ) as Resolver<sectoralPerformanceFormData>,
    mode: "onBlur",
  });
  const handleShowForm = () => {
    setShowForm(true);
  };

  const {
    data: tableData,
    refetch,
    isLoading,
  } = useGetSectoralPerformanceQuery();
  const [createSectoralPerformance] = useCreateSectoralPerformanceMutation();
  const [deleteSectoralPerformance] = useDeleteSectoralPerformanceMutation();
  const onSubmit = async (data: sectoralPerformanceFormData) => {
    try {
      const payload = {
        sectorName: data.sectorName.toLocaleUpperCase(),
      };
      await createSectoralPerformance(payload).unwrap();
      logger.info("Sectoral Performance Type created successfully", {
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
      await deleteSectoralPerformance(identity).unwrap();
      logger.info("Sectoral Performance Type deleted successfully", {
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
