import { MOCK_REQ_ITEM_LIST } from "@/mocks/asset-mgmt/purchase-req";
import type { PurchaseReqItemRow } from "@/types/asset-mgmt/purchase-req";
import { useCallback } from "react";

export const usePurchaseReqTable = () =>{
    const data = MOCK_REQ_ITEM_LIST;

      const onEdit = useCallback((row: PurchaseReqItemRow) => {
        console.log("Edit Clicked:", row);
      },[]);
    
      const onDelete = useCallback((row: PurchaseReqItemRow) => {
        console.log("Delete Clicked:", row);
      },[]);
    
      return{
        data, 
        isFetching: false,
        onEdit,
        onDelete,
      };

    
}