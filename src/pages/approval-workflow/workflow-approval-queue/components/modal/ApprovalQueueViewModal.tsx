import { Modal } from "@/components";
import { OnboardingView } from "@/pages/customer/management/onboading/customer-view/onboarding-view";
import { FirmView } from "@/pages/firm/management/onboarding/firm-view/FirmView";
interface ViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  identity: string;
  readOnly?: boolean;
  moduleCode: string;
}
export function ApprovalQueueViewModal({
  isOpen = true,
  onClose,
  identity,
  readOnly = false,
  moduleCode,
}: ViewModalProps) {
  const templates = [
    {
      code: "CUSTOMER",
      template: (
        <OnboardingView
          readOnly={readOnly}
          customerIdentity={identity}
          approvalScreen
        />
      ),
    },
    {
      code: "FIRM",
      template: (
        <FirmView readOnly={readOnly} identity={identity} approvalScreen />
      ),
    },
    {
      code: "USER",
      template: <p>under construction</p>,
    },
  ];
  const selectedTemplate =
    templates.find(t => t.code === moduleCode)?.template ?? null;
  return (
    <Modal
      isOpen={isOpen}
      close={onClose}
      width="3xl"
      isClosable={true}
      compact={true}
      className="relative mx-4 max-h-[98vh] min-h-[95vh] w-full"
      titleVariant="default"
      emptyScreen
      headerAlignEnd={true}
      padding="p-2 md:p-4 lg:p-10"
    >
      {selectedTemplate}
    </Modal>
  );
}
