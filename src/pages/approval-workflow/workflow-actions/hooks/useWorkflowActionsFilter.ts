import { useCallback, useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useAppDispatch } from "@/hooks/store";
import {
  useDeleteWorkflowActionMutation,
  useLazySearchWorkflowActionsQuery,
  useGetWorkflowActionsInTableQuery,
} from "@/global/service/end-points/approval-workflow/workflow-actions";
import { useGetWorkflowDefinitionsQuery } from "@/global/service/end-points/approval-workflow/workflow-definitions";
import { setEditMode } from "@/global/reducers/approval-workflow/workflow-actions.reducer";
import { logger } from "@/global/service";
import type {
  WorkflowActionSearchForm,
  WorkflowActionData,
  ConfigOption,
} from "@/types/approval-workflow/workflow-actions.types";

export const useWorkflowActionsFilterTable = () => {
  const dispatch = useAppDispatch();

  // Local state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [actionToDelete, setActionToDelete] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [deletingActionId, setDeletingActionId] = useState<string | null>(null);
  const [searchResults, setSearchResults] = useState<{
    content: WorkflowActionData[];
    totalPages: number;
    totalElements: number;
  }>({
    content: [],
    totalPages: 0,
    totalElements: 0,
  });
  const [isSearched, setIsSearched] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize] = useState(10);

  // Form setup
  const filterFormMethods = useForm<WorkflowActionSearchForm>({
    defaultValues: {
      workflow: "",
    },
  });

  const { getValues, reset } = filterFormMethods;

  // API hooks
  const { data: workflowOptions = [] } = useGetWorkflowDefinitionsQuery();
  const {
    data: tableData,
    isLoading: isLoadingTable,
    refetch: refetchTable,
  } = useGetWorkflowActionsInTableQuery({ page: currentPage, size: pageSize });
  const [triggerSearch, { isLoading: isSearching }] =
    useLazySearchWorkflowActionsQuery();
  const [deleteAction] = useDeleteWorkflowActionMutation();

  // Helper function
  const getIdentityFromValue = useCallback(
    (value: string, options: ConfigOption[]): string => {
      if (!value || value === "all") return "";
      const option = options.find(opt => opt.value === value);
      return option?.identity || option?.value || value;
    },
    []
  );

  // Search handler
  const handleSearch = useCallback(() => {
    const workflow = getValues("workflow");

    const workflowValue =
      workflow === "all" ? "" : getIdentityFromValue(workflow, workflowOptions);

    const searchParams: WorkflowActionSearchForm = {
      workflow: workflowValue,
      page: 0,
      size: pageSize,
    };

    setCurrentPage(0);
    triggerSearch(searchParams)
      .unwrap()
      .then(results => {
        setSearchResults(results);
        setIsSearched(true);
        logger.info(
          `Workflow action search completed: ${results.content?.length || 0} results found`
        );
      })
      .catch(error => {
        if (typeof error === "object" && error !== null) {
          const apiError = error as {
            status?: number;
            data?: {
              message?: string;
              error?: string;
            };
          };
          const errorMessage =
            apiError.data?.message ||
            apiError.data?.error ||
            "Failed to search workflow actions";
          logger.error(errorMessage, { toast: true });
        } else {
          logger.error("An unexpected error occurred", { toast: true });
        }
        setIsSearched(true);
        setSearchResults({ content: [], totalPages: 0, totalElements: 0 });
      });
  }, [
    getValues,
    triggerSearch,
    pageSize,
    workflowOptions,
    getIdentityFromValue,
  ]);

  // Search refresh handler
  const handleSearchRefresh = useCallback(async () => {
    try {
      await refetchTable();
    } catch (error) {
      logger.error(error, { toast: false });
    }
  }, [refetchTable]);

  // Page change handler
  const handlePageChange = useCallback(
    (newPage: number) => {
      setCurrentPage(newPage);

      const workflow = getValues("workflow");

      const workflowValue =
        workflow === "all"
          ? ""
          : getIdentityFromValue(workflow, workflowOptions);

      const searchParams: WorkflowActionSearchForm = {
        workflow: workflowValue,
        page: newPage,
        size: pageSize,
      };

      triggerSearch(searchParams)
        .unwrap()
        .then(results => {
          setSearchResults(results);
        })
        .catch(error => {
          logger.error(error, { toast: false });
        });
    },
    [getValues, triggerSearch, pageSize, workflowOptions, getIdentityFromValue]
  );

  // Reset handler
  const handleReset = useCallback(() => {
    reset({
      workflow: "",
    });
  }, [reset]);

  // Edit handler
  const handleEdit = useCallback(
    (action: WorkflowActionData) => {
      const id = action.actionId || action.identity;
      if (!id) {
        logger.error("No valid ID found for editing", { toast: true });
        return;
      }

      dispatch(
        setEditMode({
          isEdit: true,
          actionId: id,
          actionData: action,
        })
      );

      window.scrollTo({ top: 0, behavior: "smooth" });
    },
    [dispatch]
  );

  const handleDelete = useCallback((action: WorkflowActionData) => {
    const id =
      action.actionId ||
      (action as WorkflowActionData & { identity?: string }).identity ||
      "";

    setActionToDelete({
      id: id,
      name: action.actionName,
    });

    setShowDeleteModal(true);
  }, []);

  const confirmDeleteAction = useCallback(async () => {
    if (!actionToDelete) return;
    try {
      setDeletingActionId(actionToDelete.id);
      await deleteAction(actionToDelete.id).unwrap();
      logger.info("Workflow action deleted successfully", {
        toast: true,
      });
      handleSearchRefresh();
    } catch (error) {
      if (typeof error === "object" && error !== null) {
        const apiError = error as {
          status?: number;
          data?: {
            message?: string;
            error?: string;
          };
        };

        const errorMessage =
          apiError.data?.message ||
          apiError.data?.error ||
          "Failed to delete workflow action";

        logger.error(errorMessage, { toast: true });
      } else {
        logger.error("An unexpected error occurred", { toast: true });
      }
    } finally {
      setDeletingActionId(null);
      setShowDeleteModal(false);
      setActionToDelete(null);
    }
  }, [actionToDelete, deleteAction, handleSearchRefresh]);

  const cancelDeleteAction = useCallback(() => {
    setShowDeleteModal(false);
    setActionToDelete(null);
  }, []);

  //  Initial load from API
  useEffect(() => {
    if (tableData) {
      setSearchResults({
        content: tableData.content,
        totalPages: tableData.totalPages,
        totalElements: tableData.totalElements,
      });
      setIsSearched(true);
    }
  }, [tableData]);

  useEffect(() => {
    const handleRefresh = () => handleSearchRefresh();
    window.addEventListener("refreshWorkflowActions", handleRefresh);
    return () =>
      window.removeEventListener("refreshWorkflowActions", handleRefresh);
  }, [handleSearchRefresh]);

  useEffect(() => {
    handleSearchRefresh();
  }, []);

  return {
    // Form methods
    filterFormMethods,
    handleSearch,
    handleReset,

    // State
    searchResults,
    isSearching: isSearching || isLoadingTable,
    isSearched,
    currentPage,
    pageSize,

    // Options
    workflowOptions,

    // Table handlers
    handleEdit,
    handleDelete,
    handlePageChange,

    // Delete modal state
    showDeleteModal,
    actionToDelete,
    confirmDeleteAction,
    cancelDeleteAction,
    deletingActionId,
  };
};
