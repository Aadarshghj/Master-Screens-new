import React from "react";
import { useAppDispatch } from "@/hooks/store";
import { ConfirmationModal } from "@/components/ui/confirmation-modal";
import { User, X } from "lucide-react";
import type { CompletionModalProps } from "@/types/customer/shared.types";
import { clearCustomerIdentity } from "@/global/reducers/customer/customer-identity.reducer";
import { clearForm60Identity } from "@/global/reducers/customer/form60-identity.reducer";
import { clearCustomerBasicInfo } from "@/utils/storage.utils";
import { useGetCustomerAllDetailsQuery } from "@/global/service/end-points/customer/all-details";
import incedeLogo from "@/assets/incede.png";
import { clearViewCustomerIdentity } from "@/global/reducers/customer/customer-identity-view.reducer";

export const CompletionModal: React.FC<CompletionModalProps> = ({
  isOpen,
  onClose,
  customerIdentity,
  handleCloseViewModal,
}) => {
  const dispatch = useAppDispatch();
  const { data: customerAllDetails } = useGetCustomerAllDetailsQuery(
    { customerId: customerIdentity ?? "" },
    { skip: !customerIdentity }
  );
  if (!isOpen) return null;
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
      "customerBasicInfo",
    ];

    keysToRemove.forEach(key => {
      sessionStorage.removeItem(key);
    });

    // Clear Redux stores
    dispatch(clearCustomerIdentity());
    dispatch(clearViewCustomerIdentity());
    dispatch(clearForm60Identity());

    // Clear customer basic info from session storage
    clearCustomerBasicInfo();
    if (handleCloseViewModal) {
      handleCloseViewModal();
      return;
    }

    // Navigate back to KYC (first step of onboarding)
    window.location.href = "/customer/management/onboarding";
  };

  const customContent = (
    <div className="flex flex-col gap-6">
      {/* Header with logos */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <img src={incedeLogo} alt="logo" className="h-6 w-34" />
        </div>
        <button
          onClick={onClose}
          className=" hover:text-card flex h-6 w-6 cursor-pointer items-center justify-center  rounded-sm hover:bg-teal-100"
        >
          <X className="h-4 w-4 text-gray-500" />
        </button>
      </div>

      {/* Success message */}
      <div className="text-start">
        <h2 className="text-reset mb-2 text-xl font-semibold">
          Onboarding Completed Successfully!
        </h2>
      </div>

      {/* Customer Information header */}
      <div className="flex items-center gap-2">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-teal-100">
          <User className="h-4 w-4 text-teal-500" />
        </div>
        <span className="text-xs text-gray-500">Customer Information</span>
      </div>

      {/* Customer Details Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Left Column */}
        <div className="space-y-6">
          <div>
            <label className="text-reset mb-1 block text-xs font-medium">
              Customer Code
            </label>
            <p className="text-xs text-gray-500">
              {customerAllDetails?.customerCode}
            </p>
          </div>

          <div>
            <label className="text-reset mb-1 block text-xs font-medium">
              Full Name
            </label>
            <p className="text-xs text-gray-500">
              {[
                customerAllDetails?.firstName,
                customerAllDetails?.middleName,
                customerAllDetails?.lastName,
              ]
                .filter(Boolean)
                .join(" ")}
            </p>
          </div>

          {customerAllDetails?.dob && (
            <div>
              <label className="text-reset mb-1 block text-xs font-medium">
                Date of Birth
              </label>
              <p className="text-xs text-gray-500">
                {new Date(customerAllDetails?.dob).toLocaleDateString()}
              </p>
            </div>
          )}
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          <div>
            <label className="text-reset mb-1 block text-xs font-medium">
              Mobile Number
            </label>
            <div className="flex items-center gap-2">
              <p className="text-xs text-gray-500">
                {customerAllDetails?.mobileNumber}
              </p>
            </div>
          </div>

          <div>
            <label className="text-reset mb-1 block text-xs font-medium">
              Onboarded Branch
            </label>
            <p className="text-xs text-gray-500">
              {customerAllDetails?.branchName}
            </p>
          </div>
        </div>
      </div>

      {/* Action Button */}
      <div className="flex justify-center">
        <button
          onClick={handleGoBack}
          className="w-full rounded-full bg-teal-500 px-6 py-2 text-xs font-medium text-white transition-colors hover:bg-teal-600"
        >
          Go Back
        </button>
      </div>
    </div>
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
