import { ConfirmationModal } from "@/components/ui";

interface Props {
  open: boolean;
  onAccept: () => void;
  onReject: () => void;
}

export const PrefillDetectedModal = ({ open, onAccept, onReject }: Props) => {
  return (
    <ConfirmationModal
      isOpen={open}
      title="Prefilled data detected"
      message="Details from the uploaded document are available. Do you want to prefill the form with this data?"
      confirmText="Prefill"
      cancelText="Skip"
      onConfirm={onAccept}
      onCancel={onReject}
      type="info"
      size="compact"
    />
  );
};
