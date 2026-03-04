import React from "react";
import { ConfirmationModal } from "@/components/ui/confirmation-modal";

interface RefreshConfirmationModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const RefreshConfirmationModal: React.FC<
  RefreshConfirmationModalProps
> = ({ isOpen, onConfirm, onCancel }) => {
  return (
    <ConfirmationModal
      isOpen={isOpen}
      onConfirm={onConfirm}
      onCancel={onCancel}
      title="Unsaved Changes"
      message={
        "You are about to leave this page without saving. All changes will be lost. Do you really want to leave without saving?"
      }
      confirmText="Leave without saving"
      cancelText="Cancel"
      type="warning"
      size="compact"
    />
  );
};
