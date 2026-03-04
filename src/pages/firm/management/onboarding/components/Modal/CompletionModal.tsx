import React, { useEffect, useRef } from "react";
import { useAppDispatch } from "@/hooks/store";
import { ConfirmationModal } from "@/components/ui/confirmation-modal";
import { X, Building2 } from "lucide-react";
import { apiInstance } from "@/global/service/api-instance";
import { resetOnboarding } from "@/global/reducers/firm/firmOnboarding.reducer";
import {
  useGetFirmByIdQuery,
  useUpdateFirmStatusMutation,
} from "@/global/service/end-points/Firm/firmDetails";
import incedeLogo from "@/assets/incede.png";

interface CompletionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CompletionModal: React.FC<CompletionModalProps> = ({
  isOpen,
  onClose,
}) => {
  const dispatch = useAppDispatch();
  const firmIdentity = localStorage.getItem("firmIdentity");
  const firmId = localStorage.getItem("firmId");

  const [updateFirmStatus, { isLoading: isUpdating }] =
    useUpdateFirmStatusMutation();

  const hasTriggeredRef = useRef(false);

  useEffect(() => {
    if (!isOpen || !firmIdentity || hasTriggeredRef.current) return;

    hasTriggeredRef.current = true;

    updateFirmStatus({
      firmIdentity,
      status: "PENDING_APPROVAL",
    })
      .unwrap()
      .catch(error => {
        console.error("Failed to update firm status", error);
      });
  }, [isOpen, firmIdentity, updateFirmStatus]);

  const { data: firmData, isLoading } = useGetFirmByIdQuery(firmId ?? "", {
    skip: !firmId || !isOpen,
    refetchOnMountOrArgChange: true,
  });

  const handleClose = () => {
    dispatch(resetOnboarding());
    dispatch(apiInstance.util.resetApiState());

    localStorage.removeItem("firmId");
    localStorage.removeItem("firmCode");
    localStorage.removeItem("apiTested");
    localStorage.removeItem("firmIdentity");

    onClose();
    window.location.href = "/firm/management/onboarding/firm-details";
  };

  if (!isOpen) return null;

  const formatDate = (dateString?: string | null): string => {
    if (!dateString) return "Not available";
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  const formatStatus = (status?: string | null): string => {
    if (!status) return "Unknown";
    return status
      .replace(/_/g, " ")
      .toLowerCase()
      .split(" ")
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const getStatusColor = (status?: string | null): string => {
    if (!status) return "text-gray-500";
    const s = status.toLowerCase();
    if (s.includes("pending")) return "text-yellow-600";
    if (s.includes("approved")) return "text-green-600";
    if (s.includes("rejected")) return "text-red-600";
    return "text-gray-500";
  };

  const firmName = firmData?.firmName || "Not available";
  const firmCode = firmData?.firmCode || "Not available";
  const registrationNo = firmData?.registrationNo || "Not available";
  const registrationDate = formatDate(firmData?.registrationDate);
  const status = firmData?.status || "UNKNOWN";

  const customContent = (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <img src={incedeLogo} alt="logo" className="h-6 w-34" />
        <button
          onClick={handleClose}
          className="flex h-6 w-6 items-center justify-center rounded-sm hover:bg-teal-100"
        >
          <X className="h-4 w-4 text-gray-500" />
        </button>
      </div>

      <div>
        <h2 className="mb-1 text-xl font-semibold">
          Firm Onboarding Completed!
        </h2>
        <p className="text-sm text-gray-500">
          The onboarding has been successfully completed and sent for approval.
        </p>
      </div>

      {(isLoading || isUpdating) && (
        <div className="flex justify-center py-8">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-teal-200 border-t-teal-500" />
        </div>
      )}

      {!isLoading && (
        <>
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-teal-100">
              <Building2 className="h-4 w-4 text-teal-500" />
            </div>
            <span className="text-xs text-gray-500">Firm Information</span>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="space-y-4">
              <div>
                <label className="text-xs font-medium text-gray-700">
                  Firm Name
                </label>
                <p className="text-xs text-gray-500">{firmName}</p>
              </div>

              <div>
                <label className="text-xs font-medium text-gray-700">
                  Firm Code
                </label>
                <p className="text-xs text-gray-500">{firmCode}</p>
              </div>

              <div>
                <label className="text-xs font-medium text-gray-700">
                  Registration No
                </label>
                <p className="text-xs text-gray-500">{registrationNo}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-medium text-gray-700">
                  Registration Date
                </label>
                <p className="text-xs text-gray-500">{registrationDate}</p>
              </div>

              <div>
                <label className="text-xs font-medium text-gray-700">
                  Status
                </label>
                <p className={`text-xs font-medium ${getStatusColor(status)}`}>
                  {formatStatus(status)}
                </p>
              </div>
            </div>
          </div>
        </>
      )}

      <button
        onClick={handleClose}
        disabled={isLoading || isUpdating}
        className="w-full rounded-full bg-teal-500 px-6 py-2 text-xs font-medium text-white hover:bg-teal-600 disabled:bg-gray-300"
      >
        Go Back
      </button>
    </div>
  );

  return (
    <ConfirmationModal
      isOpen={isOpen}
      onConfirm={handleClose}
      onCancel={handleClose}
      title=""
      message=""
      type="completion"
      size="completion"
      customContent={customContent}
    />
  );
};
