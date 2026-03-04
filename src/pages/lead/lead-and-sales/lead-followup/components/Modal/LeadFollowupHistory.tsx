import { useState, useEffect } from "react";
import { Modal } from "@/components/ui/modal/modal";
import { LeadFollowupHistory } from "../Form/LeadFollowupHistory";

interface LeadFollowupHistoryModalProps {
  isOpen?: boolean;
  onClose?: () => void;
  prefilledLeadId?: string;
}

export function LeadFollowupHistoryModal({
  isOpen = false,
  onClose,
  prefilledLeadId,
}: LeadFollowupHistoryModalProps) {
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
    }
  }, [isOpen]);

  const handleClose = () => {
    setShouldRender(false);
    if (onClose) {
      onClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      close={handleClose}
      width="3xl"
      isClosable={true}
      compact={true}
      maxHeight="90vh"
      className="mx-4 w-full"
      title="Lead Follow-up History"
      titleVariant="default"
    >
      {shouldRender && (
        <div className="space-y-4">
          <LeadFollowupHistory
            readonly={false}
            isModal={true}
            prefilledLeadId={prefilledLeadId}
          />
        </div>
      )}
    </Modal>
  );
}
