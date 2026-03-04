import { useCallback, useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useAppDispatch } from "@/hooks/store";
import { setEditMode } from "@/global/reducers/loan/loan-scheme-attributes.reducer";
import {
  useLazySearchLoanSchemeAttributesQuery,
  useDeleteLoanSchemeAttributeMutation,
} from "@/global/service/end-points/loan-product-and-service-masters/loan-scheme-attributes";
import {
  useGetLoanProductsQuery,
  useGetDataTypesQuery,
} from "@/global/service/end-points/loan-product-and-service-masters/loan-masters";
import { logger } from "@/global/service";
import type {
  LoanSchemeAttributeSearchForm,
  LoanSchemeAttributeData,
} from "@/types/loan-product-and-scheme-masters/loan-scheme-attributes.types";

export const useLoanSchemeAttributesFilter = () => {
  const dispatch = useAppDispatch();

  // State
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [attributeToDelete, setAttributeToDelete] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [deletingAttributeId, setDeletingAttributeId] = useState<string | null>(
    null
  );
  const [searchResults, setSearchResults] = useState<{
    content: LoanSchemeAttributeData[];
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

  // Form for filters
  const {
    control: filterControl,
    watch: watchFilter,
    reset: resetFilters,
  } = useForm<LoanSchemeAttributeSearchForm>({
    defaultValues: {
      loanProduct: "",
      attributeName: "",
      status: "",
      dataType: "",
    },
  });

  // API Queries
  const { data: loanProductOptions = [] } = useGetLoanProductsQuery();
  const { data: dataTypeOptions = [] } = useGetDataTypesQuery();

  const [triggerSearch, { isLoading: isSearching }] =
    useLazySearchLoanSchemeAttributesQuery();
  const [deleteAttribute] = useDeleteLoanSchemeAttributeMutation();

  // Search handler
  const handleSearch = useCallback(() => {
    const filters = watchFilter();
    const searchParams: LoanSchemeAttributeSearchForm = {
      loanProduct: filters.loanProduct?.trim() || "",
      attributeName: filters.attributeName?.trim() || "",
      status: filters.status?.trim() || "",
      dataType: filters.dataType?.trim() || "",
      required: filters.required?.trim() || "",
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
          `Loan scheme attribute search completed: ${results.content?.length || 0} results found`
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
            "Failed to search loan scheme attributes";
          logger.error(errorMessage, { toast: true });
        } else {
          logger.error("An unexpected error occurred", { toast: true });
        }
        setIsSearched(true);
        setSearchResults({ content: [], totalPages: 0, totalElements: 0 });
      });
  }, [watchFilter, triggerSearch, pageSize]);

  const handleResetFilters = useCallback(() => {
    resetFilters({
      loanProduct: "",
      attributeName: "",
      status: "",
      dataType: "",
    });

    const searchParams: LoanSchemeAttributeSearchForm = {
      loanProduct: "",
      attributeName: "",
      status: "",
      dataType: "",
      required: "",
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

  // Refresh search results
  const handleSearchRefresh = useCallback(async () => {
    if (isSearched) {
      try {
        const results = await triggerSearch({
          loanProduct: "",
          attributeName: "",
          status: "",
          dataType: "",
          required: "",
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
      const searchParams: LoanSchemeAttributeSearchForm = {
        loanProduct: filters.loanProduct?.trim() || "",
        attributeName: filters.attributeName?.trim() || "",
        status: filters.status?.trim() || "",
        required: filters.required?.trim() || "",
        dataType: filters.dataType?.trim() || "",
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
    (attribute: LoanSchemeAttributeData) => {
      const id = attribute.attributeId || attribute.identity;
      if (!id) {
        logger.error("No valid ID found for editing", { toast: true });
        return;
      }

      dispatch(
        setEditMode({
          isEdit: true,
          attributeId: id,
        })
      );

      window.scrollTo({ top: 0, behavior: "smooth" });
    },
    [dispatch]
  );

  // Delete handlers
  const handleDelete = useCallback((attribute: LoanSchemeAttributeData) => {
    const id =
      attribute.attributeId ||
      (attribute as LoanSchemeAttributeData & { identity?: string }).identity ||
      "";

    setAttributeToDelete({
      id: id,
      name: attribute.attributeName,
    });

    setShowDeleteModal(true);
  }, []);

  const confirmDeleteAttribute = useCallback(async () => {
    if (!attributeToDelete) return;
    try {
      setDeletingAttributeId(attributeToDelete.id);
      await deleteAttribute(attributeToDelete.id).unwrap();
      logger.info("Loan scheme attribute deleted successfully", {
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
          "Failed to delete loan scheme attribute";

        logger.error(errorMessage, { toast: true });
      } else {
        logger.error("An unexpected error occurred", { toast: true });
      }
    } finally {
      setDeletingAttributeId(null);
      setShowDeleteModal(false);
      setAttributeToDelete(null);
    }
  }, [attributeToDelete, deleteAttribute, handleSearchRefresh]);

  const cancelDeleteAttribute = useCallback(() => {
    setShowDeleteModal(false);
    setAttributeToDelete(null);
  }, []);

  // Initial search on mount
  useEffect(() => {
    const initialSearch = {
      loanProduct: "",
      attributeName: "",
      status: "",
      dataType: "",
      required: "",
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
    window.addEventListener("refreshLoanSchemeAttributes", handleRefresh);
    return () =>
      window.removeEventListener("refreshLoanSchemeAttributes", handleRefresh);
  }, [handleSearchRefresh]);

  // Refresh on component mount
  useEffect(() => {
    handleSearchRefresh();
  }, []);

  return {
    // State
    searchResults,
    isSearched,
    currentPage,
    isSearching,
    showDeleteModal,
    attributeToDelete,
    deletingAttributeId,

    // Filter control
    filterControl,
    watchFilter,

    // Options
    loanProductOptions,
    dataTypeOptions,

    // Handlers
    handleSearch,
    handlePageChange,
    handleEdit,
    handleDelete,
    confirmDeleteAttribute,
    cancelDeleteAttribute,
    handleResetFilters,
  };
};
