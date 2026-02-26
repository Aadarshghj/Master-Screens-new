import { useCallback, useState } from "react";
import { logger } from "@/global/service";
import { useDeleteUserRegMutation, useGetMasterUserRegQuery } from "@/global/service/end-points/customer-management/user-reg";
export const useUserRegTable = () => {

  const {data =[] ,isFetching}= useGetMasterUserRegQuery();
  const [deleteUserReg] = useDeleteUserRegMutation();

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  const openDeleteModal = useCallback((userId: string) => {
     setSelectedUserId(userId);
    setShowDeleteModal(true);
  }, []);

  const closeDeleteModal = useCallback(() => {
    setShowDeleteModal(false);
    setSelectedUserId(null);
  }, []);

  const confirmDeleteUserRegistration = useCallback(async () => {
    if (!selectedUserId) return;
  
  try{
    await deleteUserReg(selectedUserId).unwrap();
    logger.info("User Deleted Successfully",{toast:true})
     closeDeleteModal();
  } 
  catch(err){
    logger.error(err,{toast:true})

  }


}, [deleteUserReg,selectedUserId, closeDeleteModal]);

  return {
    data,
    isFetching,
    showDeleteModal,
    openDeleteModal,
    closeDeleteModal,
    confirmDeleteUserRegistration,
  };
};
