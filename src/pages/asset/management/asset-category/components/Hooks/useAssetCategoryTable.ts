import { useCallback } from "react";
import { ASSET_CATEGORY_SAMPLE_DATA } from "../../../../../../mocks/asset-mgmt/asset-category.mock";
import type { AssetCategory } from "../../../../../../types/asset-mgmt/asset-category";

export const useAssetCategoryTable = () => {
  const data = ASSET_CATEGORY_SAMPLE_DATA;
  const onEdit = useCallback((row: AssetCategory) => {
    console.log("Edit clicked:", row);
  }, []);
  return {
    data,
    isFetching: false,
    onEdit,
  };
};
