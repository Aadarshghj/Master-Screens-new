import React, { useState, useCallback } from "react";
import { useForm, Controller } from "react-hook-form";
import { logger } from "@/global/service";
import {
  useGetWorkflowsQuery,
  useGetRolesQuery,
  useGetWorkflowStagesQuery,
  useDeleteWorkflowStageMutation,
} from "@/global/service/end-points/approval-workflow/stage-setup";
import type {
  WorkflowStage,
  StagesFilterForm,
} from "@/types/approval-workflow/workflow-stagesetup";

export const useStageTable = () => {
  // Filter state
  const {
    control: filterControl,
    watch: watchFilter,
    setValue: setFilterValue,
  } = useForm<StagesFilterForm>({
    defaultValues: { workflow: "all" },
  });

  // Table state
  const [currentPage, setCurrentPage] = useState(0);
  const [allStages, setAllStages] = useState<WorkflowStage[]>([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [stageToDelete, setStageToDelete] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const itemsPerPage = 10;

  // API queries
  const { data: workflowOptions = [], isLoading: isLoadingWorkflows } =
    useGetWorkflowsQuery();
  const { data: roleOptions = [], isLoading: isLoadingRoles } =
    useGetRolesQuery();
  const {
    data: stagesResponse,
    isLoading: isLoadingStages,
    refetch: refetchStages,
  } = useGetWorkflowStagesQuery(
    {
      workflow:
        watchFilter("workflow") === "all" ? "" : watchFilter("workflow") || "",
    },
    {
      refetchOnMountOrArgChange: false,
      refetchOnFocus: false,
      refetchOnReconnect: false,
    }
  );

  // Update local stages when API data changes
  React.useEffect(() => {
    if (stagesResponse?.content) {
      setAllStages(stagesResponse.content);
    }
  }, [stagesResponse]);

  // Client-side pagination
  const startIndex = currentPage * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedStages = allStages.slice(startIndex, endIndex);
  const totalPages = Math.ceil(allStages.length / itemsPerPage);

  // API mutations
  const [deleteWorkflowStage] = useDeleteWorkflowStageMutation();

  // Filter handlers
  const handleSearch = useCallback(() => {
    setCurrentPage(0);
    refetchStages(); // Only refetch when explicitly searching
  }, [refetchStages]);

  const handleFilterReset = useCallback(() => {
    setFilterValue("workflow", "all");
    setCurrentPage(0);
  }, [setFilterValue]);

  // Table handlers
  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    // No API call - just change page locally
  };

  const handleDelete = useCallback((stage: WorkflowStage) => {
    setStageToDelete({
      id: stage.identity || "",
      name: stage.levelName,
    });
    setShowDeleteModal(true);
  }, []);

  const confirmDelete = useCallback(async () => {
    if (!stageToDelete) return;

    try {
      await deleteWorkflowStage(stageToDelete.id).unwrap();
      logger.info("Workflow stage deleted successfully", { toast: true });
      refetchStages();
    } catch (error: unknown) {
      const errorMessage =
        error && typeof error === "object" && "data" in error
          ? (error as { data?: { message?: string } }).data?.message ||
            (error as { message?: string }).message ||
            "Failed to delete workflow stage"
          : "Failed to delete workflow stage";
      logger.error(errorMessage, { toast: true });
    } finally {
      setShowDeleteModal(false);
      setStageToDelete(null);
    }
  }, [stageToDelete, deleteWorkflowStage, refetchStages]);

  const cancelDelete = useCallback(() => {
    setShowDeleteModal(false);
    setStageToDelete(null);
  }, []);

  return {
    // Filter
    filterControl,
    watchFilter,
    setFilterValue,
    handleSearch,
    handleFilterReset,

    // Table
    currentPage,
    stages: paginatedStages,
    totalPages: totalPages,
    totalElements: allStages.length,
    handlePageChange,
    handleDelete,
    confirmDelete,
    cancelDelete,
    showDeleteModal,
    stageToDelete,
    refetchStages,

    // Data
    workflowOptions,
    roleOptions,

    // Loading states
    isLoadingWorkflows,
    isLoadingRoles,
    isLoadingStages,

    // Utils
    Controller,
  };
};
