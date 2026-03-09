import { useCallback } from "react";
import { TDS_SECTION_SAMPLE_DATA } from "@/mocks/customer-management-master/asset-master/tds-section";
import type { TdsSectionTypes } from "@/types/customer-management/asset-master/tds-section";

export const useTdsSectionTable  = () => {
    const data = TDS_SECTION_SAMPLE_DATA;
  const onEdit = useCallback((row: TdsSectionTypes) => {
    console.log("Edit clicked:", row);
  }, []);
  return {
    data,
     isFetching: false,
    onEdit
  };
};