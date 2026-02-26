import React, { useEffect, useState } from "react";
import { Modal } from "@/components/ui/modal/modal";
import { LeadDetailsForm } from "../Form/LeadDetails";
import { useAppDispatch } from "@/hooks/store";
import {
  setEditMode,
  resetLeadState,
} from "@/global/reducers/lead/lead-details.reducer";
import { useLazySearchLeadQuery } from "@/global/service/end-points/lead/lead-details";
import { logger } from "@/global/service";
import type {
  LeadSearchData,
  LeadSearchApiResponse,
} from "@/types/lead/lead-details.types";
import { LeadFollowupHistory } from "../../../lead-followup/components/Form/LeadFollowupHistory";
import { LeadSingleFollowup } from "../../../lead-followup/components/Form/LeadSingleFollowup";

interface LeadDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  leadId: string;
}

export const LeadDetailsModal: React.FC<LeadDetailsModalProps> = ({
  isOpen,
  onClose,
  leadId,
}) => {
  const dispatch = useAppDispatch();
  const [leadData, setLeadData] = useState<LeadSearchData | null>(null);
  const [triggerSearch, { isLoading }] = useLazySearchLeadQuery();
  const [historyRefreshKey, setHistoryRefreshKey] = useState(0);

  useEffect(() => {
    if (isOpen && leadId) {
      fetchLeadDetails();
    }
  }, [isOpen, leadId]);

  useEffect(() => {
    if (!isOpen) {
      setLeadData(null);
      dispatch(resetLeadState());
      setHistoryRefreshKey(0);
    }
  }, [isOpen, dispatch]);

  const fetchLeadDetails = async () => {
    try {
      const result = await triggerSearch({
        fullName: "",
        contactNumber: "",
        email: "",
        page: 0,
        size: 1,
      }).unwrap();

      if (result.content && result.content.length > 0) {
        const apiLead: LeadSearchApiResponse = result.content[0];

        const transformedLead: LeadSearchData = {
          leadId: apiLead.leadIdentity,
          leadCode: apiLead.leadCode,
          fullName: apiLead.fullName,
          gender: apiLead.gender,
          contactNumber: apiLead.contactNumber,
          email: apiLead.email || "",
          leadSource: apiLead.leadSource,
          leadStage: apiLead.leadStage,
          leadStatus: apiLead.leadStatus,
          assignTo: "",
          interestedProducts: apiLead.interestedProduct,
          remarks: apiLead.remarks || "",
          canvassedTypeIdentity: apiLead.canvassedTypeIdentity,
          canvasserIdentity:
            apiLead.canvasserResponseDtos?.[0]?.canvasserIdentity || "",
          canvasserName:
            apiLead.canvasserResponseDtos?.[0]?.canvasserName || "",
          canvasserCode:
            apiLead.canvasserResponseDtos?.[0]?.canvasserCode || "",
          nextFollowUpDate: apiLead.nextFollowUpDate,
          preferredTime: apiLead.preferredTime,
          leadProbability: apiLead.leadProbability,
          highPriority: apiLead.highPriority,
          createdAt: "",
          updatedAt: "",
          addresses: apiLead.addresses,
          dynamicReferences: apiLead.dynamicReferences,
          originalData: {
            gender: apiLead.gender,
            leadSource: apiLead.leadSource,
            leadStage: apiLead.leadStage,
            leadStatus: apiLead.leadStatus,
            interestedProducts: apiLead.interestedProduct,
          },
        };

        setLeadData(transformedLead);
        dispatch(setEditMode({ isEdit: true, leadId: transformedLead.leadId }));
      } else {
        logger.error("Lead not found", { toast: true });
      }
    } catch (error) {
      logger.error(error, { toast: true });
    }
  };

  const handleClose = () => {
    setLeadData(null);
    dispatch(resetLeadState());
    onClose();
  };

  const handleFollowupUpdateSuccess = () => {
    setHistoryRefreshKey(prev => prev + 1);
  };

  return (
    <Modal
      isOpen={isOpen}
      close={handleClose}
      width="4xl"
      isClosable={true}
      compact={false}
      maxHeight="90vh"
      className="mx-4 w-full"
      title="Lead Follow-up Details"
      titleVariant="default"
    >
      <div className="space-y-6">
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <p className="text-sm text-gray-500">Loading lead details...</p>
          </div>
        ) : leadData ? (
          <>
            {/*  Lead Details and History  */}
            <div className="rounded-lg border-1 border-cyan-300 p-6">
              <LeadDetailsForm
                readonly={false}
                isViewMode={true}
                initialLeadData={leadData}
              />

              <div className="mt-8 border-t pt-6">
                <h3 className="mb-4 text-lg font-semibold">Lead History</h3>
                <LeadFollowupHistory
                  readonly={false}
                  isModal={true}
                  prefilledLeadId={leadId}
                  key={historyRefreshKey}
                />
              </div>
            </div>

            {/*  Lead Follow-up Details Form */}
            <LeadSingleFollowup
              leadId={leadId}
              onSuccess={handleFollowupUpdateSuccess}
            />
          </>
        ) : null}
      </div>
    </Modal>
  );
};
