import { useCallback } from "react";
import type { ContactType } from "../../../../../../types/asset-mgmt/contact-type";
import { CONTACT_TYPE_SAMPLE_DATA } from '../../../../../../mocks/asset-mgmt/contact-type';

export const useContactTypeTable = () => {
  const data = CONTACT_TYPE_SAMPLE_DATA;
  const onEdit = useCallback((row: ContactType) => {
    console.log("Edit clicked:", row);
  }, []);
  return {
    data,
    isFetching: false,
    onEdit,
  };
};
