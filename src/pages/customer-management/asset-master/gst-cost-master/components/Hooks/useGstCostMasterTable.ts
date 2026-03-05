import { useCallback } from "react";
import { GSTCOSTMASTER_SAMPLE_DATA } from "@/mocks/asset-management-system/gst-cost-master";
import type {GstCostMasterType} from "@/types/asset-management-system/gst-cost-master"

export const useGstCostMasterTable  = () => {


    const data = GSTCOSTMASTER_SAMPLE_DATA;
  const onEdit = useCallback((row: GstCostMasterType) => {
    console.log("Edit clicked:", row);
  }, []);
  return {
    data,
     isFetching: false,
    onEdit
  };
};

