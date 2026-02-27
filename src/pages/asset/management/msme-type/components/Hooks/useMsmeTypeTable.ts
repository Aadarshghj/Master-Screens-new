import { useCallback } from "react";
import type { MsmeType } from "../../../../../../types/asset-mgmt/msme-type";
import { MSME_TYPE_SAMPLE_DATA } from '../../../../../../mocks/asset-mgmt/msme-type';

export const useMsmeTypeTable = () => {
  const data = MSME_TYPE_SAMPLE_DATA;
  const onEdit = useCallback((row: MsmeType) => {
    console.log("Edit clicked:", row);
  }, []);
  return {
    data,
    isFetching: false,
    onEdit,
  };
};
