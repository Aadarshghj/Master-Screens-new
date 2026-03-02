import { useCallback } from "react";
import { ASSET_GROUP_SAMPLE_DATA } from "@/mocks/asset-management-system/asset-group";
import type { AssetGroupType } from "@/types/asset-management-system/asset-group.types";

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
