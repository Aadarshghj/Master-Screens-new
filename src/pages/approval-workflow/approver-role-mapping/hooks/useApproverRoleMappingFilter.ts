import { useCallback, useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useAppDispatch } from "@/hooks/store";
import { logger } from "@/global/service";
import type {
  ApproverRoleMappingSearchForm,
  ApproverRoleMappingData,
} from "@/types/approval-workflow/approver-role-mapping.types";
import {
  useDeleteApproverRoleMappingMutation,
  useLazySearchApproverRoleMappingsQuery,
} from "@/global/service/end-points/approval-workflow/approver-role-mapping";
import { setEditMode } from "@/global/reducers/approval-workflow/approver-role-mapping.reducer";

export const useApproverRoleMappingTable = () => {
  const dispatch = useAppDispatch();

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [mappingToDelete, setMappingToDelete] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [deletingMappingId, setDeletingMappingId] = useState<string | null>(
    null
  );

  const [searchResults, setSearchResults] = useState<{
    content: ApproverRoleMappingData[];
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

  const filterForm = useForm<ApproverRoleMappingSearchForm>({
    defaultValues: {
      roleCode: "",
      userCode: "",
      branchCode: "",
      regionCode: "",
      clusterCode: "",
      stateCode: "",
    },
  });

  const { watch: watchFilter, reset: resetFilter } = filterForm;

  const [triggerSearch, { isLoading: isSearching }] =
    useLazySearchApproverRoleMappingsQuery();
  const [deleteMapping] = useDeleteApproverRoleMappingMutation();

  // Search handler
  const handleSearch = useCallback(() => {
    const filters = watchFilter();

    const searchParams: ApproverRoleMappingSearchForm = {
      roleCode: filters.roleCode?.trim() || "",
      userCode: filters.userCode?.trim() || "",
      branchCode: filters.branchCode?.trim() || "",
      regionCode: filters.regionCode?.trim() || "",
      clusterCode: filters.clusterCode?.trim() || "",
      stateCode: filters.stateCode?.trim() || "",
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
          `Approver role mapping search completed: ${results.content?.length || 0} results found`
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
            "Failed to search approver role mappings";
          logger.error(errorMessage, { toast: true });
        } else {
          logger.error("An unexpected error occurred", { toast: true });
        }
        setIsSearched(true);
        setSearchResults({ content: [], totalPages: 0, totalElements: 0 });
      });
  }, [watchFilter, triggerSearch, pageSize]);

  // Reset filter handler
  const handleResetFilter = useCallback(() => {
    resetFilter({
      roleCode: "",
      userCode: "",
      branchCode: "",
      regionCode: "",
      clusterCode: "",
      stateCode: "",
    });

    const searchParams: ApproverRoleMappingSearchForm = {
      roleCode: "",
      userCode: "",
      branchCode: "",
      regionCode: "",
      clusterCode: "",
      stateCode: "",
      page: 0,
      size: pageSize,
    };

    setCurrentPage(0);
    triggerSearch(searchParams)
      .unwrap()
      .then(results => {
        setSearchResults(results);
        setIsSearched(true);
      })
      .catch(error => {
        logger.error(error, { toast: false });
      });
  }, [resetFilter, triggerSearch, pageSize]);

  // Refresh search handler
  const handleSearchRefresh = useCallback(async () => {
    if (isSearched) {
      try {
        const results = await triggerSearch({
          roleCode: "",
          userCode: "",
          branchCode: "",
          regionCode: "",
          clusterCode: "",
          stateCode: "",
          page: currentPage,
          size: pageSize,
        }).unwrap();
        setSearchResults(results);
      } catch (error) {
        logger.error(error, { toast: false });
      }
    }
  }, [isSearched, triggerSearch, currentPage, pageSize]);

  // Page change handler
  const handlePageChange = useCallback(
    (newPage: number) => {
      setCurrentPage(newPage);

      const filters = watchFilter();

      const searchParams: ApproverRoleMappingSearchForm = {
        roleCode: filters.roleCode?.trim() || "",
        userCode: filters.userCode?.trim() || "",
        branchCode: filters.branchCode?.trim() || "",
        regionCode: filters.regionCode?.trim() || "",
        clusterCode: filters.clusterCode?.trim() || "",
        stateCode: filters.stateCode?.trim() || "",
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
    [watchFilter, triggerSearch, pageSize]
  );

  // Initial load
  useEffect(() => {
    const initialSearch = {
      roleCode: "",
      userCode: "",
      branchCode: "",
      regionCode: "",
      clusterCode: "",
      stateCode: "",
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

  // Edit handler
  const handleEdit = useCallback(
    (mapping: ApproverRoleMappingData) => {
      const id = mapping.mappingId || mapping.identity;
      if (!id) {
        logger.error("No valid ID found for editing", { toast: true });
        return;
      }

      dispatch(
        setEditMode({
          isEdit: true,
          mappingId: id,
        })
      );

      window.scrollTo({ top: 0, behavior: "smooth" });
    },
    [dispatch]
  );

  // Delete handler
  const handleDelete = useCallback((mapping: ApproverRoleMappingData) => {
    const id =
      mapping.mappingId ||
      (mapping as ApproverRoleMappingData & { identity?: string }).identity ||
      "";

    setMappingToDelete({
      id: id,
      name: `${mapping.roleCode} - ${mapping.userCode}`,
    });

    setShowDeleteModal(true);
  }, []);

  // Confirm delete handler
  const confirmDeleteMapping = useCallback(async () => {
    if (!mappingToDelete) return;
    try {
      setDeletingMappingId(mappingToDelete.id);
      await deleteMapping(mappingToDelete.id).unwrap();
      logger.info("Approver role mapping deleted successfully", {
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
          "Failed to delete approver role mapping";

        logger.error(errorMessage, { toast: true });
      } else {
        logger.error("An unexpected error occurred", { toast: true });
      }
    } finally {
      setDeletingMappingId(null);
      setShowDeleteModal(false);
      setMappingToDelete(null);
    }
  }, [mappingToDelete, deleteMapping, handleSearchRefresh]);

  // Cancel delete handler
  const cancelDeleteMapping = useCallback(() => {
    setShowDeleteModal(false);
    setMappingToDelete(null);
  }, []);

  useEffect(() => {
    const handleRefresh = () => handleSearchRefresh();
    window.addEventListener("refreshApproverRoleMappings", handleRefresh);
    return () =>
      window.removeEventListener("refreshApproverRoleMappings", handleRefresh);
  }, [handleSearchRefresh]);

  useEffect(() => {
    handleSearchRefresh();
  }, []);

  return {
    // Filter form
    filterForm,

    // Search state
    searchResults,
    isSearched,
    isSearching,

    // Pagination
    currentPage,
    pageSize,

    // Delete modal state
    showDeleteModal,
    mappingToDelete,
    deletingMappingId,

    // Handlers
    handleSearch,
    handleResetFilter,
    handlePageChange,
    handleEdit,
    handleDelete,
    confirmDeleteMapping,
    cancelDeleteMapping,
  };
};
