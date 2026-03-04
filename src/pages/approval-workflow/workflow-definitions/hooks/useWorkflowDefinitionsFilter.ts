import { useCallback, useState, useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { useAppDispatch } from "@/hooks/store";
import {
  useDeleteWorkflowDefinitionMutation,
  useLazySearchWorkflowDefinitionsQuery,
  useGetModulesAndSubModulesQuery,
} from "@/global/service/end-points/approval-workflow/workflow-definitions";
import { setEditMode } from "@/global/reducers/approval-workflow/workflow-definitions.reducer";
import { logger } from "@/global/service";
import type {
  WorkflowDefinitionSearchForm,
  WorkflowDefinitionData,
  ConfigOption,
} from "@/types/approval-workflow/workflow-definitions.types";

export const useWorkflowDefinitionsFilterTable = () => {
  const dispatch = useAppDispatch();

  // Local state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [definitionToDelete, setDefinitionToDelete] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [deletingDefinitionId, setDeletingDefinitionId] = useState<
    string | null
  >(null);
  const [searchResults, setSearchResults] = useState<{
    content: WorkflowDefinitionData[];
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
  const filterFormMethods = useForm<WorkflowDefinitionSearchForm>({
    defaultValues: {
      module: "",
      subModule: "",
      workflowName: "",
    },
  });

  const { watch: watchFilter, setValue: setFilterValue } = filterFormMethods;

  // API hooks
  const { data: moduleOptions = [] } = useGetModulesAndSubModulesQuery();
  const [triggerSearch, { isLoading: isSearching }] =
    useLazySearchWorkflowDefinitionsQuery();
  const [deleteDefinition] = useDeleteWorkflowDefinitionMutation();

  // Derived state
  const selectedModule = watchFilter("module");

  const getIdentityFromValue = useCallback(
    (value: string, options: ConfigOption[]): string => {
      if (!value || value === "all") return "";
      const option = options.find(opt => opt.value === value);
      return option?.identity || option?.value || value;
    },
    []
  );

  const subModuleOptions = useMemo(() => {
    if (!selectedModule || selectedModule === "all" || !moduleOptions.length) {
      return [];
    }

    const selectedModuleData = moduleOptions.find(
      mod => mod.value === selectedModule || mod.identity === selectedModule
    );

    if (!selectedModuleData?.subModules) return [];

    return selectedModuleData.subModules
      .filter(sub => sub.isActive)
      .map(sub => ({
        value: sub.identity,
        label: sub.subModuleName,
        identity: sub.identity,
      }));
  }, [selectedModule, moduleOptions]);

  // Search handler
  const handleSearch = useCallback(() => {
    const filters = watchFilter();

    const moduleValue =
      filters.module === "all"
        ? ""
        : getIdentityFromValue(filters.module, moduleOptions);

    const subModuleValue =
      filters.subModule === "all"
        ? ""
        : getIdentityFromValue(filters.subModule, subModuleOptions);

    const searchParams: WorkflowDefinitionSearchForm = {
      module: moduleValue,
      subModule: subModuleValue,
      workflowName: filters.workflowName?.trim() || "",
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
          `Workflow definition search completed: ${results.content?.length || 0} results found`
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
            "Failed to search workflow definitions";
          logger.error(errorMessage, { toast: true });
        } else {
          logger.error("An unexpected error occurred", { toast: true });
        }
        setIsSearched(true);
        setSearchResults({ content: [], totalPages: 0, totalElements: 0 });
      });
  }, [
    watchFilter,
    triggerSearch,
    pageSize,
    moduleOptions,
    subModuleOptions,
    getIdentityFromValue,
  ]);

  // Reset handler
  const handleReset = useCallback(() => {
    setFilterValue("module", "");
    setFilterValue("subModule", "");
    setFilterValue("workflowName", "");
  }, [setFilterValue]);

  // Page change handler
  const handlePageChange = useCallback(
    (newPage: number) => {
      setCurrentPage(newPage);

      const filters = watchFilter();

      const moduleValue =
        filters.module === "all"
          ? ""
          : getIdentityFromValue(filters.module, moduleOptions);

      const subModuleValue =
        filters.subModule === "all"
          ? ""
          : getIdentityFromValue(filters.subModule, subModuleOptions);

      const searchParams: WorkflowDefinitionSearchForm = {
        module: moduleValue,
        subModule: subModuleValue,
        workflowName: filters.workflowName?.trim() || "",
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
    [
      watchFilter,
      triggerSearch,
      pageSize,
      moduleOptions,
      subModuleOptions,
      getIdentityFromValue,
    ]
  );

  // Edit handler
  const handleEdit = useCallback(
    (definition: WorkflowDefinitionData) => {
      const id = definition.definitionId || definition.identity;
      if (!id) {
        logger.error("No valid ID found for editing", { toast: true });
        return;
      }

      dispatch(
        setEditMode({
          isEdit: true,
          definitionId: id,
          definitionData: definition,
        })
      );

      window.scrollTo({ top: 0, behavior: "smooth" });
    },
    [dispatch]
  );

  // Delete handlers
  const handleDelete = useCallback((definition: WorkflowDefinitionData) => {
    const id =
      definition.definitionId ||
      (definition as WorkflowDefinitionData & { identity?: string }).identity ||
      "";

    setDefinitionToDelete({
      id: id,
      name: definition.workflowName,
    });

    setShowDeleteModal(true);
  }, []);

  const confirmDeleteDefinition = useCallback(async () => {
    if (!definitionToDelete) return;

    try {
      setDeletingDefinitionId(definitionToDelete.id);
      await deleteDefinition(definitionToDelete.id).unwrap();
      logger.info("Workflow definition deleted successfully", {
        toast: true,
      });

      try {
        const results = await triggerSearch({
          module: "",
          subModule: "",
          workflowName: "",
          page: currentPage,
          size: pageSize,
        }).unwrap();
        setSearchResults(results);
      } catch (error) {
        logger.error(error, { toast: false });
      }
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
          "Failed to delete workflow definition";

        logger.error(errorMessage, { toast: true });
      } else {
        logger.error("An unexpected error occurred", { toast: true });
      }
    } finally {
      setDeletingDefinitionId(null);
      setShowDeleteModal(false);
      setDefinitionToDelete(null);
    }
  }, [
    definitionToDelete,
    deleteDefinition,
    triggerSearch,
    currentPage,
    pageSize,
  ]);

  const cancelDeleteDefinition = useCallback(() => {
    setShowDeleteModal(false);
    setDefinitionToDelete(null);
  }, []);

  useEffect(() => {
    const initialSearch = {
      module: "",
      subModule: "",
      workflowName: "",
      page: 0,
      size: pageSize,
    };

    triggerSearch(initialSearch)
      .unwrap()
      .then(results => {
        setSearchResults(results);
        setIsSearched(true);
      })
      .catch(error => {
        logger.error(error, { toast: false });
      });
  }, [triggerSearch, pageSize]);

  useEffect(() => {
    const handleRefresh = async () => {
      try {
        const results = await triggerSearch({
          module: "",
          subModule: "",
          workflowName: "",
          page: 0,
          size: pageSize,
        }).unwrap();
        setSearchResults(results);
        setCurrentPage(0);
      } catch (error) {
        logger.error(error, { toast: false });
      }
    };

    window.addEventListener("refreshWorkflowDefinitions", handleRefresh);
    return () =>
      window.removeEventListener("refreshWorkflowDefinitions", handleRefresh);
  }, [triggerSearch, pageSize]);

  return {
    filterFormMethods,
    handleSearch,
    handleReset,

    searchResults,
    isSearching,
    isSearched,
    currentPage,
    pageSize,

    moduleOptions,
    subModuleOptions,
    selectedModule,

    handleEdit,
    handleDelete,
    handlePageChange,

    showDeleteModal,
    definitionToDelete,
    confirmDeleteDefinition,
    cancelDeleteDefinition,
    deletingDefinitionId,
  };
};
