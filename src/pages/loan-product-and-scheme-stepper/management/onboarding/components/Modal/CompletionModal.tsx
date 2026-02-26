import React from "react";
import { useAppDispatch } from "@/hooks/store";
import { ConfirmationModal } from "@/components/ui/confirmation-modal";
import { Building, X, Send } from "lucide-react";
import { resetLoanProductState } from "@/global/reducers/loan-stepper/loan-product.reducer";
import {
  useGetLoanSchemeStatusQuery,
  useSendLoanSchemeForApprovalMutation,
} from "@/global/service/end-points/loan-product-and-scheme/loan-approval";
import { logger } from "@/global/service";
import incedeLogo from "@/assets/incede.png";

interface LoanCompletionModalProps {
  isOpen: boolean;
  onClose: () => void;
  schemeId?: string;
}

export const LoanCompletionModal: React.FC<LoanCompletionModalProps> = ({
  isOpen,
  onClose,
  schemeId,
}) => {
  const dispatch = useAppDispatch();
  const [sendForApproval, { isLoading: isSending }] =
    useSendLoanSchemeForApprovalMutation();
  const { data: statusData, isLoading } = useGetLoanSchemeStatusQuery(
    schemeId || "",
    {
      skip: !schemeId || !isOpen,
    }
  );

  if (!isOpen) return null;

  const handleGoBack = () => {
    // Clear all loan-related data from sessionStorage
    const keysToRemove = [
      "loanCompletedSteps",
      "loanSchemeId",
      "loanProductData",
      "loanOnboardingData",
    ];

    keysToRemove.forEach(key => {
      sessionStorage.removeItem(key);
    });

    // Clear Redux stores
    dispatch(resetLoanProductState());

    // Navigate back to first step of loan onboarding
    window.location.href = "/loan-product-schema/management/onboarding";
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
          Loan Scheme Setup Completed Successfully!
        </h2>
      </div>

      {/* Loan Scheme Information header */}
      <div className="flex items-center gap-2">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-teal-100">
          <Building className="h-4 w-4 text-teal-500" />
        </div>
        <span className="text-xs text-gray-500">Loan Scheme Information</span>
      </div>

      {/* Loan Scheme Details */}
      <div className="grid grid-cols-1 gap-6">
        <div className="space-y-6">
          <div>
            <label className="text-reset mb-1 block text-xs font-medium">
              Scheme ID
            </label>
            <p className="text-xs text-gray-500">
              {schemeId || "Generated successfully"}
            </p>
          </div>

          <div>
            <label className="text-reset mb-1 block text-xs font-medium">
              Status
            </label>
            {isLoading ? (
              <p className="text-xs text-gray-500">Loading status...</p>
            ) : (
              <p className="text-xs font-medium text-green-600">
                {statusData?.status || "Setup Complete - Ready for Use"}
              </p>
            )}
          </div>

          <div>
            <label className="text-reset mb-1 block text-xs font-medium">
              Next Steps
            </label>
            <p className="text-xs text-gray-500">
              {statusData?.message ||
                "The loan scheme is now available for loan applications and can be managed through the loan products section."}
            </p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <button
          onClick={handleGoBack}
          className="flex-1 rounded-full bg-gray-500 px-6 py-2 text-xs font-medium text-white transition-colors hover:bg-gray-600"
        >
          Go Back to Loan Management
        </button>
        <button
          onClick={async () => {
            console.log("Send for approval clicked", schemeId);
            if (!schemeId) {
              console.log("No schemeId provided");
              return;
            }
            try {
              console.log("Calling sendForApproval mutation...");
              const result = await sendForApproval(schemeId).unwrap();
              console.log("Approval success:", result);
              logger.info("Loan scheme sent for approval successfully", {
                toast: true,
              });
              handleGoBack();
            } catch (error) {
              console.error("Approval error:", error);
              logger.error("Failed to send loan scheme for approval", {
                toast: true,
              });
            }
          }}
          disabled={isSending}
          className="flex flex-1 items-center justify-center gap-2 rounded-full bg-teal-500 px-6 py-2 text-xs font-medium text-white transition-colors hover:bg-teal-600 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Send className="h-3 w-3" />
          {isSending ? "Sending..." : "Send for Approval"}
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
