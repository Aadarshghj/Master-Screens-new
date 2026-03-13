import type { SupplierSearchResult } from "@/types/asset-management-system/supplier-empanelment";
import { useState } from "react";

export const useSupplierSearchTable = () => {
  const [tableData, setTableData] = useState<SupplierSearchResult[]>([]);

  const setSearchResults = (data: SupplierSearchResult[]) => {
    setTableData(data);
  };

  const resetTable = () => {
    setTableData([]);
  };

  return {
    tableData,
    setSearchResults,
    resetTable,
  };
};