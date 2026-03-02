import { useCallback } from "react";
import { UNITOFMEASURE_SAMPLE_DATA } from "@/mocks/asset-management-system/unit-of-measure";
import type {UnitOfMeasureType} from "@/types/asset-management-system/unit-of-measure"

export const useUnitOfMeasureTable  = () => {


    const data = UNITOFMEASURE_SAMPLE_DATA;
  const onEdit = useCallback((row: UnitOfMeasureType) => {
    console.log("Edit clicked:", row);
  }, []);
  return {
    data,
     isFetching: false,
    onEdit
  };
};

