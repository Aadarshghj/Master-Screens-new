import React from "react";
import { useAppDispatch } from "@/hooks/store";
import { ConfirmationModal } from "@/components/ui/confirmation-modal";
import { Flex } from "@/components/ui/flex";
import { Grid } from "@/components/ui/grid";
import { Button } from "@/components/ui/button";
import { Phone, User } from "lucide-react";
import type { CompletionModalProps } from "@/types/customer/shared.types";
import { clearCustomerIdentity } from "@/global/reducers/customer/customer-identity.reducer";
import { clearForm60Identity } from "@/global/reducers/customer/form60-identity.reducer";
import { clearViewCustomerIdentity } from "@/global/reducers/customer/customer-identity-view.reducer";

export const CompletionModal: React.FC<CompletionModalProps> = ({
  isOpen,
  onClose,
  customerData,
}) => {
  const dispatch = useAppDispatch();

  // Don't render if modal is not open
  if (!isOpen) return null;

  // Show loading state if customerData is not available yet
  if (!customerData) {
    const loadingContent = (
      <Flex direction="col" gap={2} sm={{ gap: 3 }} md={{ gap: 4 }}>
        {/* Header with logos */}
        <Flex justify="between" align="center">
          <Flex gap={1} sm={{ gap: 2 }}>
            <Flex gap={1} sm={{ gap: 1 }}>
              <div className="text-xs font-bold text-blue-900 sm:text-sm">
                INDEL
              </div>
              <div className="text-[8px] text-blue-900 sm:text-[10px]">
                MONEY
              </div>
            </Flex>
            <div className="h-2 w-px bg-blue-400 sm:h-3"></div>
            <div className="text-[8px] text-blue-900 sm:text-[10px]">
              incede
            </div>
          </Flex>
          <Button
            onClick={onClose}
            variant="ghost"
            size="icon-xs"
            className="h-3 w-3 sm:h-4 sm:w-4"
          >
            <svg
              width="8"
              height="8"
              viewBox="0 0 16 16"
              fill="none"
              className="sm:h-[10px] sm:w-[10px]"
            >
              <path
                d="M12 4L4 12M4 4L12 12"
                stroke="#020618"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Button>
        </Flex>

        {/* Success message */}
        <Flex justify="center">
          <h2 className="text-xs font-semibold text-blue-900 sm:text-sm">
            Onboarding Completed Successfully!
          </h2>
        </Flex>

        {/* Loading state */}
        <Flex align="center" justify="center" className="py-2">
          <div className="text-[8px] text-gray-500 sm:text-[10px]">
            Loading customer information...
          </div>
        </Flex>

        {/* Action Button */}
        <Flex justify="center" className="pt-1">
          <Button
            onClick={onClose}
            variant="primary"
            size="compact"
            className="bg-teal-500 px-2 text-[8px] hover:bg-teal-600 sm:px-3 sm:text-[10px]"
          >
            Go Back
          </Button>
        </Flex>
      </Flex>
    );

    return (
      <ConfirmationModal
        isOpen={isOpen}
        onConfirm={onClose}
        onCancel={onClose}
        title=""
        message=""
        type="completion"
        size="completion"
        customContent={loadingContent}
      />
    );
  }

  const {
    customerCode,
    firstName,
    middleName,
    lastName,
    dob,
    mobileNumber,
    branchName,
  } = customerData;

  const handleGoBack = () => {
    // Clear all customer-related data from sessionStorage
    const keysToRemove = [
      "customerId",
      "customerIdentity",
      "form60Identity",
      "kycData",
      "basicInfo",
      "customerData",
      "onboardingData",
      "customerProfile",
      "panSubmitted",
      "aadhaarSubmitted",
    ];

    keysToRemove.forEach(key => {
      sessionStorage.removeItem(key);
    });

    // Clear Redux stores
    dispatch(clearCustomerIdentity());
    dispatch(clearViewCustomerIdentity());
    dispatch(clearForm60Identity());

    // Navigate back to KYC (first step of onboarding)
    window.location.href = "/customer/management/onboarding";
  };

  const customContent = (
    <Flex direction="col" gap={2} sm={{ gap: 3 }} md={{ gap: 4 }}>
      {/* Header with logos */}
      <Flex justify="between" align="center">
        <Flex gap={1} sm={{ gap: 2 }}>
          <Flex gap={1} sm={{ gap: 1 }}>
            <div className="text-xs font-bold text-blue-900 sm:text-sm">
              INDEL
            </div>
            <div className="text-[8px] text-blue-900 sm:text-[10px]">MONEY</div>
          </Flex>
          <div className="h-2 w-px bg-blue-400 sm:h-3"></div>
          <div className="text-[8px] text-blue-900 sm:text-[10px]">incede</div>
        </Flex>
        <Button
          onClick={onClose}
          variant="ghost"
          size="icon-xs"
          className="h-3 w-3 sm:h-4 sm:w-4"
        >
          <svg
            width="8"
            height="8"
            viewBox="0 0 16 16"
            fill="none"
            className="sm:h-[10px] sm:w-[10px]"
          >
            <path
              d="M12 4L4 12M4 4L12 12"
              stroke="#020618"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </Button>
      </Flex>

      {/* Success message */}
      <Flex justify="center">
        <h2 className="text-xs font-semibold text-blue-900 sm:text-sm">
          Onboarding Completed Successfully!
        </h2>
      </Flex>

      {/* Customer Information header */}
      <Flex align="center" gap={1}>
        <Flex
          align="center"
          justify="center"
          className="h-3 w-3 rounded bg-teal-100 sm:h-4 sm:w-4"
        >
          <User className="h-2 w-2 text-teal-500 sm:h-2.5 sm:w-2.5" />
        </Flex>
        <span className="text-[8px] text-gray-500 sm:text-[10px]">
          Customer Information
        </span>
      </Flex>

      {/* Customer Details Grid - Responsive layout */}
      <Grid cols={1} gap={3} sm={{ cols: 2 }}>
        {/* Left Column */}
        <Flex direction="col" gap={2}>
          <div>
            <label className="mb-0.5 block text-[8px] font-medium text-blue-900 sm:text-[10px]">
              Customer Code
            </label>
            <p className="text-[8px] text-gray-500 sm:text-[10px]">
              {customerCode}
            </p>
          </div>

          <div>
            <label className="mb-0.5 block text-[8px] font-medium text-blue-900 sm:text-[10px]">
              Full Name
            </label>
            <p className="text-[8px] leading-tight text-gray-500 sm:text-[10px]">
              {[firstName, middleName, lastName].filter(Boolean).join(" ")}
            </p>
          </div>

          <div>
            <label className="mb-0.5 block text-[8px] font-medium text-blue-900 sm:text-[10px]">
              Date of Birth
            </label>
            <p className="text-[8px] text-gray-500 sm:text-[10px]">
              {dob
                ? new Date(dob).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                  })
                : "Not provided"}
            </p>
          </div>
        </Flex>

        {/* Right Column */}
        <Flex direction="col" gap={2}>
          <div>
            <label className="mb-0.5 block text-[8px] font-medium text-blue-900 sm:text-[10px]">
              Mobile Number
            </label>
            <Flex align="center" gap={1}>
              <Phone className="h-2 w-2 text-gray-400 sm:h-2.5 sm:w-2.5" />
              <p className="text-[8px] text-gray-500 sm:text-[10px]">
                {mobileNumber}
              </p>
            </Flex>
          </div>

          <div>
            <label className="mb-0.5 block text-[8px] font-medium text-blue-900 sm:text-[10px]">
              Display Name
            </label>
            <p className="text-[8px] text-gray-500 sm:text-[10px]">
              {customerData.displayName || "Not specified"}
            </p>
          </div>

          <div>
            <label className="mb-0.5 block text-[8px] font-medium text-blue-900 sm:text-[10px]">
              Onboarded Branch
            </label>
            <p className="text-[8px] text-gray-500 sm:text-[10px]">
              {branchName || "Not specified"}
            </p>
          </div>
        </Flex>
      </Grid>

      {/* Action Button */}
      <Flex justify="center" className="pt-1">
        <Button
          onClick={handleGoBack}
          variant="primary"
          size="compact"
          className="bg-teal-500 px-2 text-[8px] hover:bg-teal-600 sm:px-3 sm:text-[10px]"
        >
          Go Back
        </Button>
      </Flex>
    </Flex>
  );

  return (
    <ConfirmationModal
      isOpen={isOpen}
      onConfirm={handleGoBack}
      onCancel={onClose}
      title=""
      message=""
      type="completion"
      size="completion"
      customContent={customContent}
    />
  );
};
