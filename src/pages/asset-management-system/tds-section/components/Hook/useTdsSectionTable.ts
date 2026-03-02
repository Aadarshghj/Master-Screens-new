import { useCallback } from "react";
import { TDS_SECTION_SAMPLE_DATA } from "@/mocks/asset-management-system/tds-section";
import type { TdsSectionTypes } from "@/types/asset-management-system/tds-section";

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