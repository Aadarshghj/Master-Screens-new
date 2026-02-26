import { useCallback, useState } from "react";
import { useDeleteTenantMutation } from "@/global/service/end-points/customer-management/tenant";
import { logger } from "@/global/service";

export const useTenantTable = (
  refetchTenants: () => void,
  onDeleted?: (id: string) => void
) => {
  const [deleteTenant] = useDeleteTenantMutation();

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedTenantId, setSelectedTenantId] = useState<string | null>(null);

  const openDeleteModal = useCallback((tenantId: string) => {
    setSelectedTenantId(tenantId);
    setShowDeleteModal(true);
  }, []);

  const closeDeleteModal = useCallback(() => {
    setShowDeleteModal(false);
    setSelectedTenantId(null);
  }, []);

  const confirmDeleteTenant = useCallback(async () => {
    if (!selectedTenantId) return;

    try {
      await deleteTenant(selectedTenantId).unwrap();
      refetchTenants();
      if (onDeleted) {
        onDeleted(selectedTenantId);
      }

      logger.info("Tenant Deleted Successfully", { toast: true });
      closeDeleteModal();
    } catch (err) {
      logger.error(err, { toast: true });
    }
  }, [
    deleteTenant,
    selectedTenantId,
    closeDeleteModal,
    refetchTenants,
    onDeleted,
  ]);

  return {
    showDeleteModal,
    openDeleteModal,
    closeDeleteModal,
    confirmDeleteTenant,
  };
};
