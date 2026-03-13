import { useState } from "react";
import type { QuotationFilter } from "@/types/asset-management-system/quotation-registration-type";

export const useQuotationFilter = <T extends { quotReqId?: string; status?: string }>(
  initialData: T[]
) => {
  const [filteredData, setFilteredData] = useState<T[]>(initialData);

  const applyFilter = (filters: QuotationFilter) => {
    let result = [...initialData];

    if (filters.reqId  && filters.reqId !== "ALL") {
      result = result.filter(item =>
        item.quotReqId?.toLowerCase().includes(filters.reqId.toLowerCase())
      );
    }

    if (filters.status && filters.status !== "ALL") {
  const normalizedStatus = filters.status
    .toLowerCase()
    .replace(/_/g, " ");

  result = result.filter(
    item => item.status?.toLowerCase() === normalizedStatus
  );
}
    setFilteredData(result);
  };

  return {
    filteredData,
    applyFilter,
  };
};