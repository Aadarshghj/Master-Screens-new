import { useCallback } from "react";
import { DEPRECIATIONMETHODS_SAMPLE_DATA } from "@/mocks/asset-management-system/depreciation-methods";
import type {DepreciationMethodsType} from "@/types/asset-management-system/depreciation-methods"

export const useDepreciationMethodsTable  = () => {


    const data = DEPRECIATIONMETHODS_SAMPLE_DATA;
  const onEdit = useCallback((row: DepreciationMethodsType) => {
    console.log("Edit clicked:", row);
  }, []);
  return {
    data,
     isFetching: false,
    onEdit
  };
};

