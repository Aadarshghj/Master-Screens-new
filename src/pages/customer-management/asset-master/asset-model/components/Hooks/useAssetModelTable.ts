import { useCallback } from "react";
import { ASSET_MODEL_SAMPLE_DATA } from "@/mocks/customer-management-master/asset-master/asset-model";
import type { AssetModelType } from "@/types/customer-management/asset-master/asset-model";

export const useAssetModelTable  = () => {
    const data = ASSET_MODEL_SAMPLE_DATA;
  const onEdit = useCallback((row: AssetModelType) => {
    console.log("Edit clicked:", row);
  }, []);
  return {
    data,
     isFetching: false,
    onEdit
  };
};