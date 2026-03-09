import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import type {
  AssetItemAttributeSearchForm,
  AssetItemAttributeBase,
} from "@/types/customer-management/asset-master/asset-item-attributes.types";

export const useAssetItemAttributesFilter = (
  initialData: AssetItemAttributeBase[] = []
) => {
  const [searchResults, setSearchResults] = useState<{
    content: AssetItemAttributeBase[];
    totalPages: number;
    totalElements: number;
  }>({
    content: initialData,
    totalPages: 1,
    totalElements: initialData.length,
  });

  const [isSearched, setIsSearched] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [attributeToDelete, setAttributeToDelete] = useState<{
    id?: string;
    name: string;
  } | null>(null);

  // Form for filters
  const {
    control: filterControl,
    watch: watchFilter,
    reset: resetFilters,
  } = useForm<AssetItemAttributeSearchForm>({
    defaultValues: {
      assetItem: "",
      attributeName: "",
      status: true,
     // dataType: "",
    },
  });

  // Filter & search function
  const handleSearch = useCallback(() => {
    const filters = watchFilter();

    const filteredResults = initialData.filter(
      attr =>
        (!filters.assetItem || attr.assetItem === filters.assetItem) &&
        (!filters.attributeName ||
          attr.attributeName
            .toLowerCase()
            .includes(filters.attributeName.toLowerCase())) &&
        (filters.status === undefined || attr.isActive === filters.status) 
       // && (!filters.dataType || attr.dataType === filters.dataType)
    );

    setSearchResults({
      content: filteredResults,
      totalPages: 1,
      totalElements: filteredResults.length,
    });
    setIsSearched(true);
    setCurrentPage(0);
  }, [watchFilter, initialData]);

  const handleResetFilters = useCallback(() => {
    resetFilters({
      assetItem: "",
      attributeName: "",
      status: undefined,
     // dataType: "",
    });
    setSearchResults({
      content: initialData,
      totalPages: 1,
      totalElements: initialData.length,
    });
    setIsSearched(false);
    setCurrentPage(0);
  }, [resetFilters, initialData]);

  const handlePageChange = useCallback((newPage: number) => {
    setCurrentPage(newPage);
  }, []);

  const handleDelete = useCallback((attribute: AssetItemAttributeBase) => {
    setAttributeToDelete({
      //   id: attribute.attributeId || attribute.identity,
      name: attribute.attributeName,
    });
    setShowDeleteModal(true);
  }, []);

  const confirmDeleteAttribute = useCallback(() => {
    if (!attributeToDelete?.id) return;

    setSearchResults(prev => {
      const updated = prev.content.filter(
        attr => (attr.attributeName || attr.identity) !== attributeToDelete.id
      );
      return {
        content: updated,
        totalPages: 1,
        totalElements: updated.length,
      };
    });

    setShowDeleteModal(false);
    setAttributeToDelete(null);
  }, [attributeToDelete]);

  const cancelDeleteAttribute = useCallback(() => {
    setShowDeleteModal(false);
    setAttributeToDelete(null);
  }, []);

  return {
    searchResults,
    isSearched,
    currentPage,
    showDeleteModal,
    attributeToDelete,
    filterControl,
    handleSearch,
    handleResetFilters,
    handlePageChange,
    handleDelete,
    confirmDeleteAttribute,
    cancelDeleteAttribute,
  };
};
