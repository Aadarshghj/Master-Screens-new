import { useCallback } from "react";
import { MOCK_PURCHASE_REQUESTS} from "../../../../../../mocks/asset-mgmt/product-req-list"
import type { ProductReqList } from "@/types/asset-mgmt/product-req-list";

export const useProductReqListTable = () =>{
  const data = MOCK_PURCHASE_REQUESTS;

  const onEdit = useCallback((row: ProductReqList) => {
    console.log("Edit Clicked:", row);
  },[]);

  const onDelete = useCallback((row: ProductReqList) => {
    console.log("Delete Clicked:", row);
  },[]);

  return{
    data, 
    isFetching: false,
    onEdit,
    onDelete,
  };
};
