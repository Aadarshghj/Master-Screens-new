import { useCallback, useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useAppDispatch } from "@/hooks/store";
import {
  useGetLoanProductsQuery,
  useGetRuleCategoriesQuery,
} from "@/global/service/end-points/loan-product-and-service-masters/loan-masters";
import {
  useDeleteLoanBusinessRuleMutation,
  useLazySearchLoanBusinessRulesQuery,
} from "@/global/service/end-points/loan-product-and-service-masters/business-rules";
import { setEditMode } from "@/global/reducers/loan/business-rules.reducer";
import { logger } from "@/global/service";
import type {
  LoanBusinessRuleSearchForm,
  LoanBusinessRuleData,
  ConfigOption,
} from "@/types/loan-product-and-scheme-masters/business-rules.types";

export const useBusinessRulesFilter = () => {
  const dispatch = useAppDispatch();

  // State management
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [ruleToDelete, setRuleToDelete] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [deletingRuleId, setDeletingRuleId] = useState<string | null>(null);
  const [searchResults, setSearchResults] = useState<{
    content: LoanBusinessRuleData[];
    totalPages: number;
    totalElements: number;
  }>({
    content: [],
    totalPages: 0,
    totalElements: 0,
  });
  const [isSearched, setIsSearched] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const pageSize = 10;

  // Form setup
  const filterForm = useForm<LoanBusinessRuleSearchForm>({
    defaultValues: {
      loanProduct: "",
      category: "",
      status: "",
      ruleCode: "",
      ruleName: "",
    },
  });

  const { watch: watchFilter, reset: resetFilters } = filterForm;

  // API queries
  const { data: ruleCategoryOptions = [] } = useGetRuleCategoriesQuery();
  const { data: loanProductOptions = [] } = useGetLoanProductsQuery();
  const [triggerSearch, { isLoading: isSearching }] =
    useLazySearchLoanBusinessRulesQuery();
  const [deleteRule] = useDeleteLoanBusinessRuleMutation();

  // Utility function
  const getIdentityFromValue = useCallback(
    (value: string, options: ConfigOption[]): string => {
      if (!value || value === "all") return "";
      const option = options.find(opt => opt.value === value);
      return option?.identity || option?.value || value;
    },
    []
  );

  // Build search parameters
  const buildSearchParams = useCallback(
    (page: number = 0): LoanBusinessRuleSearchForm => {
      const filters = watchFilter();

      const loanProductValue =
        filters.loanProduct === "all"
          ? ""
          : getIdentityFromValue(filters.loanProduct, loanProductOptions);

      const categoryValue =
        filters.category === "all"
          ? ""
          : getIdentityFromValue(filters.category, ruleCategoryOptions);

      const statusValue = filters.status === "all" ? "" : filters.status;

      return {
        loanProduct: loanProductValue,
        category: categoryValue,
        status: statusValue,
        ruleCode: filters.ruleCode?.trim() || "",
        ruleName: filters.ruleName?.trim() || "",
        page,
        size: pageSize,
      };
    },
    [
      watchFilter,
      getIdentityFromValue,
      loanProductOptions,
      ruleCategoryOptions,
      pageSize,
    ]
  );

  // Search handler
  const handleSearch = useCallback(() => {
    const searchParams = buildSearchParams(0);
    setCurrentPage(0);

    triggerSearch(searchParams)
      .unwrap()
      .then(results => {
        setSearchResults(results);
        setIsSearched(true);
        logger.info(
          `Business rule search completed: ${results.content?.length || 0} results found`
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
            "Failed to search business rules";
          logger.error(errorMessage, { toast: true });
        } else {
          logger.error("An unexpected error occurred", { toast: true });
        }
        setIsSearched(true);
        setSearchResults({ content: [], totalPages: 0, totalElements: 0 });
      });
  }, [buildSearchParams, triggerSearch]);

  const handleResetFilters = useCallback(() => {
    resetFilters({
      loanProduct: "",
      category: "",
      status: "",
      ruleCode: "",
      ruleName: "",
    });

    const searchParams: LoanBusinessRuleSearchForm = {
      loanProduct: "",
      category: "",
      status: "",
      ruleCode: "",
      ruleName: "",
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
          category: "",
          status: "",
          ruleCode: "",
          ruleName: "",
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
      const searchParams = buildSearchParams(newPage);

      triggerSearch(searchParams)
        .unwrap()
        .then(results => {
          setSearchResults(results);
        })
        .catch(error => {
          logger.error(error, { toast: false });
        });
    },
    [buildSearchParams, triggerSearch]
  );

  // Edit handler
  const handleEdit = useCallback(
    (rule: LoanBusinessRuleData) => {
      const id = rule.ruleId || rule.identity;
      if (!id) {
        logger.error("No valid ID found for editing", { toast: true });
        return;
      }

      dispatch(
        setEditMode({
          isEdit: true,
          ruleId: id,
        })
      );

      window.scrollTo({ top: 0, behavior: "smooth" });
    },
    [dispatch]
  );

  // Delete handlers
  const handleDelete = useCallback((rule: LoanBusinessRuleData) => {
    const id =
      rule.ruleId ||
      (rule as LoanBusinessRuleData & { identity?: string }).identity ||
      "";

    setRuleToDelete({
      id: id,
      name: rule.ruleName,
    });

    setShowDeleteModal(true);
  }, []);

  const confirmDeleteRule = useCallback(async () => {
    if (!ruleToDelete) return;
    try {
      setDeletingRuleId(ruleToDelete.id);
      await deleteRule(ruleToDelete.id).unwrap();
      logger.info("Business rule deleted successfully", {
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
          "Failed to delete business rule";

        logger.error(errorMessage, { toast: true });
      } else {
        logger.error("An unexpected error occurred", { toast: true });
      }
    } finally {
      setDeletingRuleId(null);
      setShowDeleteModal(false);
      setRuleToDelete(null);
    }
  }, [ruleToDelete, deleteRule, handleSearchRefresh]);

  const cancelDeleteRule = useCallback(() => {
    setShowDeleteModal(false);
    setRuleToDelete(null);
  }, []);

  // Initial search on mount
  useEffect(() => {
    const initialSearch = {
      loanProduct: "",
      category: "",
      status: "",
      ruleCode: "",
      ruleName: "",
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
    window.addEventListener("refreshLoanBusinessRules", handleRefresh);
    return () =>
      window.removeEventListener("refreshLoanBusinessRules", handleRefresh);
  }, [handleSearchRefresh]);

  // Refresh on initial mount
  useEffect(() => {
    handleSearchRefresh();
  }, []);

  return {
    filterForm,
    searchResults,
    isSearched,
    isSearching,
    currentPage,
    pageSize,
    ruleCategoryOptions,
    loanProductOptions,
    showDeleteModal,
    ruleToDelete,
    deletingRuleId,
    handleSearch,
    handlePageChange,
    handleEdit,
    handleDelete,
    confirmDeleteRule,
    cancelDeleteRule,
    handleResetFilters,
  };
};
