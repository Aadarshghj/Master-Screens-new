import { useCallback, useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useAppDispatch } from "@/hooks/store";
import {
  useGetLoanProductsQuery,
  useGetDataTypesQuery,
} from "@/global/service/end-points/loan-product-and-service-masters/loan-masters";
import {
  useDeleteLoanSchemePropertyMutation,
  useLazySearchLoanSchemePropertiesQuery,
} from "@/global/service/end-points/loan-product-and-service-masters/loan-scheme-properties";
import { setEditMode } from "@/global/reducers/loan/loan-scheme-properties.reducer";
import { logger } from "@/global/service";
import type {
  LoanSchemePropertyData,
  LoanSchemePropertySearchForm,
} from "@/types/loan-product-and-scheme-masters/loan-scheme-properties.types";

export const useLoanSchemePropertyFilter = () => {
  const dispatch = useAppDispatch();

  // State
  const [searchResults, setSearchResults] = useState<{
    content: LoanSchemePropertyData[];
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
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [propertyToDelete, setPropertyToDelete] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [deletingPropertyId, setDeletingPropertyId] = useState<string | null>(
    null
  );

  // Form for filters
  const {
    control: filterControl,
    watch: watchFilter,
    reset: resetFilters,
  } = useForm<LoanSchemePropertySearchForm>({
    defaultValues: {
      loanProduct: "",
      status: "",
      dataType: "",
      isRequired: "",
    },
  });

  // API hooks
  const { data: loanProductOptions = [] } = useGetLoanProductsQuery();
  const { data: dataTypeOptions = [] } = useGetDataTypesQuery();
  const [triggerSearch, { isLoading: isSearching }] =
    useLazySearchLoanSchemePropertiesQuery();
  const [deleteProperty] = useDeleteLoanSchemePropertyMutation();

  // Search handler
  const handleSearch = useCallback(() => {
    const filters = watchFilter();

    const searchParams: LoanSchemePropertySearchForm = {
      loanProduct: filters.loanProduct?.trim() || "",
      status: filters.status?.trim() || "",
      dataType: filters.dataType?.trim() || "",
      isRequired: filters.isRequired?.trim() || "",
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
          `Loan scheme property search completed: ${results.content?.length || 0} results found`
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
            "Failed to search loan scheme properties";

          logger.error(errorMessage, { toast: true });
        } else {
          logger.error("An unexpected error occurred", { toast: true });
        }
        setSearchResults({ content: [], totalPages: 0, totalElements: 0 });
        setIsSearched(true);
      });
  }, [watchFilter, triggerSearch, pageSize]);

  const handleResetFilters = useCallback(() => {
    resetFilters({
      loanProduct: "",
      status: "",
      dataType: "",
      isRequired: "",
    });

    // Optionally trigger search with empty filters
    const searchParams: LoanSchemePropertySearchForm = {
      loanProduct: "",
      status: "",
      dataType: "",
      isRequired: "",
      page: 0,
      size: pageSize,
    };

    setCurrentPage(0);

    triggerSearch(searchParams)
      .unwrap()
      .then(results => {
        setSearchResults(results);
        setIsSearched(true);
        logger.info("Filters reset and search refreshed");
      })
      .catch(error => {
        logger.error(error, { toast: false });
      });
  }, [resetFilters, triggerSearch, pageSize]);

  // Refresh handler
  const handleSearchRefresh = useCallback(async () => {
    if (isSearched) {
      try {
        const results = await triggerSearch({
          loanProduct: "",
          status: "",
          dataType: "",
          isRequired: "",
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

      const searchParams: LoanSchemePropertySearchForm = {
        loanProduct: filters.loanProduct?.trim() || "",
        status: filters.status?.trim() || "",
        dataType: filters.dataType?.trim() || "",
        isRequired: filters.isRequired?.trim() || "",
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

  // Edit handler
  const handleEdit = useCallback(
    (property: LoanSchemePropertyData) => {
      const id =
        property.propertyId ||
        (property as LoanSchemePropertyData & { identity?: string }).identity;
      if (!id) {
        logger.error("No valid ID found for editing", { toast: true });
        return;
      }
      dispatch(
        setEditMode({
          isEdit: true,
          propertyId: id,
          propertyData: property,
        })
      );

      window.scrollTo({ top: 0, behavior: "smooth" });
    },
    [dispatch]
  );

  // Delete handlers
  const handleDelete = useCallback((property: LoanSchemePropertyData) => {
    const id =
      property.propertyId ||
      (property as LoanSchemePropertyData & { identity?: string }).identity ||
      "";

    setPropertyToDelete({
      id: id,
      name: property.propertyName,
    });

    setShowDeleteModal(true);
  }, []);

  const confirmDeleteProperty = useCallback(async () => {
    if (!propertyToDelete) return;

    try {
      setDeletingPropertyId(propertyToDelete.id);

      await deleteProperty(propertyToDelete.id).unwrap();
      logger.info("Loan scheme property deleted successfully", {
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
          "Failed to delete loan scheme property";

        logger.error(errorMessage, { toast: true });
      } else {
        logger.error("An unexpected error occurred", { toast: true });
      }
    } finally {
      setDeletingPropertyId(null);
      setShowDeleteModal(false);
      setPropertyToDelete(null);
    }
  }, [propertyToDelete, deleteProperty, handleSearchRefresh]);

  const cancelDeleteProperty = useCallback(() => {
    setShowDeleteModal(false);
    setPropertyToDelete(null);
  }, []);

  // Initial search on mount
  useEffect(() => {
    const initialSearch = {
      loanProduct: "",
      status: "",
      dataType: "",
      isRequired: "",
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

  // Listen for refresh events
  useEffect(() => {
    const handleRefresh = () => handleSearchRefresh();
    window.addEventListener("refreshLoanSchemeProperties", handleRefresh);
    return () =>
      window.removeEventListener("refreshLoanSchemeProperties", handleRefresh);
  }, [handleSearchRefresh]);

  return {
    // State
    searchResults,
    isSearched,
    currentPage,
    pageSize,
    showDeleteModal,
    propertyToDelete,
    deletingPropertyId,

    // Filter form
    filterControl,
    watchFilter,

    // Options
    loanProductOptions,
    dataTypeOptions,

    // Loading
    isSearching,

    // Handlers
    handleSearch,
    handleSearchRefresh,
    handlePageChange,
    handleEdit,
    handleDelete,
    confirmDeleteProperty,
    cancelDeleteProperty,
    handleResetFilters,
  };
};
