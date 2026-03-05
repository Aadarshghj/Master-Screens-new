import { useCallback } from "react";
import { ASSET_GROUP_SAMPLE_DATA } from "@/mocks/customer-management-master/asset-master/asset-group";
import type { AssetGroupType } from "@/types/customer-management/asset-master/asset-group.types";

export const useAssetGroupTable = () => {
  const data = ASSET_GROUP_SAMPLE_DATA;
  const onEdit = useCallback((row: AssetGroupType) => {
    // eslint-disable-next-line no-console
    console.log("Edit clicked:", row);
  }, []);
  return {
    data,
    isFetching: false,
    onEdit,
  };
};
