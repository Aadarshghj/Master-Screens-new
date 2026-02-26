import { Modal } from "@/components";
import { CreateCustomer } from "../Form/CreateCustomer";

interface CustomerOnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCustomerCreated?: (customerData: Record<string, unknown>) => void;
}

export function CustomerOnboardingModal({
  isOpen,
  onClose,
}: CustomerOnboardingModalProps) {
  const handleClose = () => {
    onClose();
  };
  return (
    <Modal
      isOpen={isOpen}
      close={handleClose}
      width="3xl"
      isClosable={true}
      compact={true}
      className="relative mx-4 max-h-[98vh] min-h-[95vh] w-full"
      titleVariant="default"
      emptyScreen
      headerAlignEnd
      padding="p-2 md:p-4 lg:p-10"
    >
      <CreateCustomer handleClose={handleClose} />
    </Modal>
  );
}
