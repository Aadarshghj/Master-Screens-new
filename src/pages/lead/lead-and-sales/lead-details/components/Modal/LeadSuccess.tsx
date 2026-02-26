import React from "react";
import { Modal } from "@/components/ui/modal/modal";
import { Button } from "@/components/ui/button";
import { Flex } from "@/components/ui/flex";
import { X, User } from "lucide-react";
import type { LeadCreationSuccessResponse } from "@/types/lead/lead-details.types";
import type { ConfigOption } from "@/types/lead/lead-details.types";
import incede from "@/assets/incede.png";

interface LeadSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  leadData: LeadCreationSuccessResponse | null;
  genderOptions: ConfigOption[];
  productsOptions: ConfigOption[];
}

export const LeadSuccessModal: React.FC<LeadSuccessModalProps> = ({
  isOpen,
  onClose,
  leadData,
  genderOptions,
  productsOptions,
}) => {
  if (!leadData) {
    return null;
  }

  const getDisplayName = (
    identity: string,
    options: ConfigOption[]
  ): string => {
    const option = options.find(
      opt => opt.value === identity || opt.identity === identity
    );
    return option?.label || identity;
  };

  const genderDisplay = getDisplayName(
    leadData.leadDetails.gender,
    genderOptions
  );
  const productDisplay = getDisplayName(
    leadData.leadDetails.interestedProductIdentity,
    productsOptions
  );

  const formatDate = (dateString?: string): string => {
    if (!dateString) return new Date().toLocaleDateString("en-GB");
    return new Date(dateString).toLocaleDateString("en-GB");
  };

  return (
    <Modal
      isOpen={isOpen}
      close={onClose}
      width="md"
      isClosable={false}
      compact={true}
      className="mx-4 w-full max-w-sm"
    >
      <div className="space-y-0">
        <div className="border-b px-4 py-3">
          <Flex justify="between" align="center">
            <div className="flex items-center gap-2">
              <div className="flex items-center">
                <img src={incede} className="h-5" alt="Logo" />
              </div>
            </div>

            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-8 w-8 rounded-full border border-pink-400 bg-pink-100 text-pink-500 transition-colors hover:bg-pink-200 hover:text-pink-600"
            >
              <X className="h-4 w-4" strokeWidth={2} />
            </Button>
          </Flex>
        </div>

        <div className="px-4 py-2.5">
          <h3 className="text-left text-sm font-semibold text-gray-900">
            Lead Created Successfully!
          </h3>
        </div>

        {/* Lead Information Section */}
        <div className="space-y-2.5 px-4 pb-4">
          <Flex align="center" gap={2} className="pb-1.5">
            <div
              className="flex items-center justify-center rounded-full p-1"
              style={{ backgroundColor: "#16DBCC" }}
            >
              <User className="h-3.5 w-3.5 text-white" />
            </div>
            <h4 className="text-xs font-semibold text-gray-900">
              Lead Information
            </h4>
          </Flex>

          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <p className="mb-0.5 text-xs text-gray-900">Lead Code</p>
              <p className="text-xs font-medium text-gray-500">
                {leadData.leadCode}
              </p>
            </div>
            <div>
              <p className="mb-0.5 text-xs text-gray-900">Full Name</p>
              <p className="text-xs font-medium text-gray-500">
                {leadData.leadDetails.fullName}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <p className="mb-0.5 text-xs text-gray-900">Contact Number</p>
              <p className="text-xs font-medium text-gray-500">
                {leadData.leadDetails.contactNumber}
              </p>
            </div>
            <div>
              <p className="mb-0.5 text-xs text-gray-900">Gender</p>
              <p className="text-xs font-medium text-gray-500">
                {genderDisplay}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <p className="mb-0.5 text-xs text-gray-900">Created On</p>
              <p className="text-xs font-medium text-gray-500">
                {formatDate(leadData.createdAt)}
              </p>
            </div>
            <div>
              <p className="mb-0.5 text-xs text-gray-900">Interested Product</p>
              <p className="text-xs font-medium text-gray-500">
                {productDisplay}
              </p>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};
