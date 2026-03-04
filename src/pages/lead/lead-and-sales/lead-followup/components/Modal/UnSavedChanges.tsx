import { ConfirmationModal } from "@/components";

interface UnsavedChangesModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function UnsavedChangesModal({
  isOpen,
  onConfirm,
  onCancel,
}: UnsavedChangesModalProps) {
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
      cancelText="Stay on Page"
      type="warning"
      size="compact"
    />
  );
}
