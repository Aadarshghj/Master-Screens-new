import { useCallback, useState } from "react";
import { logger } from "../../../../../global/service";
import { useGetBranchTypeQuery,useDeleteBranchTypeMutation } from "../../../../../global/service/end-points/customer-management/branch-type";

export const useBranchTypeMasterTable = () => {

    const { data, isFetching} = useGetBranchTypeQuery();
    const branchTypes = data?? [];
    const [deleteBranchType] = useDeleteBranchTypeMutation();

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedBranchTypeId, setSelectedBranchTypeId] = useState<string | null>(null);

    const openDeleteModal = useCallback((branchTypeId: string) => {
        setSelectedBranchTypeId(branchTypeId);
        setShowDeleteModal(true);
    }, []);
    const closeDeleteModal = useCallback(() => {
        setShowDeleteModal(false);
        setSelectedBranchTypeId(null);
    }, []);
    const confirmDeleteBranchType = useCallback(async () => {
        if (!selectedBranchTypeId) return;
try{
    await deleteBranchType(selectedBranchTypeId).unwrap();
    logger.info("Branch Type Delete Successfully",{toast:true})
    closeDeleteModal()
}catch(err){
    logger.error(err,{toast:true})
}
    }, [selectedBranchTypeId, closeDeleteModal, deleteBranchType]);
    return {
        data: branchTypes,
        isFetching,
        showDeleteModal,
        openDeleteModal,
        closeDeleteModal,
        confirmDeleteBranchType,
    };
};