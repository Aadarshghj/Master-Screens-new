import React, { useCallback, useState, useMemo, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { Flex } from "@/components/ui/flex";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { HeaderWrapper } from "@/components/ui/header-wrapper/HeaderWrapper";
import { TitleHeader } from "@/components/ui/title-header/TitleHeader";
import { FormContainer } from "@/components/ui/form-container";
import { Filter, RefreshCw } from "lucide-react";
import { useSearchLeadFollowupQuery } from "@/global/service/end-points/lead/lead-followup";
import {
  useGetFollowupTypeQuery,
  useGetLeadStageQuery,
  useGetUsersQuery,
} from "@/global/service/end-points/master/lead-master";
import { logger } from "@/global/service";
import type {
  LeadFollowupData,
  LeadFollowupFilterFormData,
  LeadFollowupFormProps,
  LeadFollowupSearchRequest,
} from "@/types/lead/lead-followup.types";
import { LeadFollowupTable } from "../Table/LeadFollowup";
import { leadFollowupFilterDefaultValues } from "../../constants/form.constants";
import { LeadFollowupHistoryModal } from "../Modal/LeadFollowupHistory";
import { UnsavedChangesModal } from "../Modal/UnSavedChanges";
import { LeadDetailsModal } from "../../../lead-details/components/Modal/LeadDetails";
import { DatePicker } from "@/components";

export const LeadFollowupDetails: React.FC<LeadFollowupFormProps> = ({
  readonly = false,
}) => {
  const [selectedLeads, setSelectedLeads] = useState<string[]>([]);
  const [leadsData, setLeadsData] = useState<LeadFollowupData[]>([]);

  const [searchParams, setSearchParams] =
    useState<LeadFollowupSearchRequest | null>(null);

  const [shouldShowData, setShouldShowData] = useState(false);

  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize] = useState(10);
  const [queryKey, setQueryKey] = useState(0);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [editedLeads, setEditedLeads] = useState<Set<string>>(new Set());
  const [showUnsavedWarning, setShowUnsavedWarning] = useState(false);
  const [pendingPageChange, setPendingPageChange] = useState<number | null>(
    null
  );

  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedLeadId, setSelectedLeadId] = useState<string>("");
  const [isLeadHistoryModalOpen, setIsLeadHistoryModalOpen] = useState(false);

  const { data: leadStageOptions = [], isLoading: isLoadingStage } =
    useGetLeadStageQuery();

  const { data: usersOptions = [], isLoading: isLoadingUsers } =
    useGetUsersQuery();

  const {
    data: leadFollowupTypeOptions = [],
    isLoading: isLoadingFollowupTypes,
  } = useGetFollowupTypeQuery();

  const { data: leadsResponse, isLoading: isLoadingLeads } =
    useSearchLeadFollowupQuery(
      searchParams ? { ...searchParams, _key: queryKey } : null!,
      {
        skip: !searchParams || !shouldShowData,
      }
    );

  // const [bulkSaveFollowup, { isLoading: isSaving }] =
  //   useBulkSaveLeadFollowupMutation();

  const {
    control: filterControl,
    watch: watchFilter,
    reset: resetFilter,
    trigger,
    setValue: setFilterValue,
  } = useForm<LeadFollowupFilterFormData>({
    defaultValues: {
      ...leadFollowupFilterDefaultValues,
      // leadDateFrom: new Date().toISOString().split("T")[0],
      // leadDateTo: new Date().toISOString().split("T")[0],
    },
  });

  useMemo(() => {
    if (shouldShowData && leadsResponse?.content) {
      const transformedLeads = leadsResponse.content.map(item => ({
        leadIdentity: item.leadIdentity.toString(),
        leadCode: item.leadCode,
        leadFullName: item.leadFullName,
        gender: "",
        contactNumber: item.mobileno,
        email: "",
        interestedProduct: "",
        leadSource: "",
        staffId: item.staffId,
        leadStage: item.leadStageIdentity,
        leadStageName: item.leadStageName,
        leadStatus: "",
        assignToUser: item.staffName,
        followUpDate: item.followUpDate || "",
        nextFollowUpDate: item.nextFollowUpDate || "",
        followUpType:
          item.followUpTypeIdentity || item.followupTypeIdentity || "",
        followUpTypeName: item.currentFollowupType || "",
        followUpNotes: item.stageChangeRemarks || "",
        staffIdentity: item.staffIdentity,
      }));

      setLeadsData(transformedLeads);
      setEditedLeads(new Set());
    } else if (shouldShowData && leadsResponse?.content?.length === 0) {
      setLeadsData([]);
      setEditedLeads(new Set());
    }
  }, [shouldShowData, leadsResponse]);

  // const handleOpenHistoryModal = () => {
  //   setIsHistoryModalOpen(true);
  // };

  const handleCloseHistoryModal = () => {
    setIsHistoryModalOpen(false);
  };

  const handleFilter = useCallback(() => {
    const filters = watchFilter();

    if (filters.leadDateFrom && filters.leadDateTo) {
      if (filters.leadDateTo < filters.leadDateFrom) {
        logger.error("Next Follow-up Date cannot be before Lead Date", {
          toast: true,
        });
        return;
      }
    }

    const apiParams: LeadFollowupSearchRequest = {
      page: 0,
      size: pageSize,
      leadName: filters.leadName?.trim() || undefined,
      staffId: filters.assignee !== "all" ? filters.assignee : "",
      followUpTypeIdentity:
        filters.followUpType !== "all" ? filters.followUpType : "",
      leadStageIdentity: filters.leadStage !== "all" ? filters.leadStage : "",
      leadDateFrom: filters.leadDateFrom
        ? filters.leadDateFrom.split("-").reverse().join("-")
        : "",
      leadDateTo: filters.leadDateTo
        ? filters.leadDateTo.split("-").reverse().join("-")
        : "",
    };

    setShouldShowData(false);
    setSelectedLeads([]);
    setLeadsData([]);
    setCurrentPage(0);
    setQueryKey(prev => prev + 1);
    setSearchParams(apiParams);
    setShouldShowData(true);
  }, [watchFilter, pageSize]);

  const handleResetFilter = useCallback(() => {
    resetFilter({
      ...leadFollowupFilterDefaultValues,
    });
    setSelectedLeads([]);
    setCurrentPage(0);
    setSearchParams({
      leadName: undefined,
      staffId: "",
      followUpTypeIdentity: "",
      leadStageIdentity: "",
      leadDateFrom: "",
      leadDateTo: "",
      page: 0,
      size: pageSize,
      _key: 0,
    });
    setShouldShowData(true);
    setQueryKey(prev => prev + 1);
  }, [resetFilter, pageSize]);

  const handleSelectAll = useCallback(
    (checked: boolean) => {
      if (checked) {
        setSelectedLeads(leadsData.map(lead => lead.leadIdentity));
      } else {
        setSelectedLeads([]);
      }
    },
    [leadsData]
  );

  const handleSelectLead = useCallback((leadId: string, checked: boolean) => {
    setSelectedLeads(prev =>
      checked ? [...prev, leadId] : prev.filter(id => id !== leadId)
    );
  }, []);

  const handleUpdateLeadData = useCallback(
    (leadId: string, field: string, value: string) => {
      setLeadsData(prev =>
        prev.map(lead => {
          if (lead.leadIdentity === leadId) {
            if (field === "leadStage") {
              const stageOption = leadStageOptions.find(
                opt => opt.value === value
              );
              return {
                ...lead,
                leadStage: value,
                leadStageName: stageOption?.label || "",
              };
            }
            if (field === "followUpType") {
              const typeOption = leadFollowupTypeOptions.find(
                opt => opt.value === value
              );
              return {
                ...lead,
                followUpType: value,
                followUpTypeName: typeOption?.label || "",
              };
            }
            return { ...lead, [field]: value };
          }
          return lead;
        })
      );
      setEditedLeads(prev => new Set(prev).add(leadId));
    },
    [leadStageOptions, leadFollowupTypeOptions]
  );

  useEffect(() => {
    // const today = new Date().toISOString().split("T")[0];
    // const dateParts = today.split("-");
    // const formattedDate = `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;

    setSearchParams({
      leadName: undefined,
      staffId: "",
      followUpTypeIdentity: "",
      leadStageIdentity: "",
      leadDateFrom: "",
      leadDateTo: "",
      // leadDateFrom: formattedDate,
      // leadDateTo: formattedDate,
      page: 0,
      size: pageSize,
      _key: 0,
    });
    setShouldShowData(true);
  }, [pageSize]);

  // const onSubmit = useCallback(async () => {
  //   const editedLeadsArray = Array.from(editedLeads);

  //   if (editedLeadsArray.length === 0) {
  //     logger.error("No changes to save", { toast: true });
  //     return;
  //   }

  //   const editedLeadsData = leadsData.filter(lead =>
  //     editedLeadsArray.includes(lead.leadIdentity)
  //   );

  //   for (const lead of editedLeadsData) {
  //     const validationError = validateFollowupData(lead);
  //     if (validationError) {
  //       logger.error(`${lead.leadCode}: ${validationError}`, { toast: true });
  //       return;
  //     }
  //   }

  //   try {
  //     const payload: BulkSaveLeadFollowupPayload = editedLeadsData.map(
  //       lead => ({
  //         leadIdentity: lead.leadIdentity,
  //         leadStageIdentity: lead.leadStage,
  //         staffIdentity: lead.staffIdentity || "0",
  //         followUpTypeIdentity: lead.followUpType!,
  //         followUpDate: lead.followUpDate!,
  //         nextFollowUpDate: lead.nextFollowUpDate!,
  //         followUpNotes: lead.followUpNotes || "",
  //         changeType: "FOLLOW_UP",
  //         stageChangeRemarks: lead.followUpNotes || "",
  //       })
  //     );

  //     await bulkSaveFollowup(payload).unwrap();
  //     logger.info("Follow-ups saved successfully", { toast: true });
  //     setEditedLeads(new Set());

  //     setQueryKey(prev => prev + 1);
  //     refetchLeads();
  //   } catch (error) {
  //     logger.error(error, { toast: true });
  //   }
  // }, [editedLeads, leadsData, bulkSaveFollowup, refetchLeads, setQueryKey]);

  // const handleReset = useCallback(() => {
  //   setSelectedLeads([]);
  //   setEditedLeads(new Set());

  //   if (leadsResponse?.content) {
  //     const transformedLeads = leadsResponse.content.map(item => ({
  //       leadIdentity: item.leadIdentity.toString(),
  //       leadCode: item.leadCode,
  //       leadFullName: item.leadFullName,
  //       gender: "",
  //       contactNumber: item.mobileno,
  //       email: "",
  //       interestedProduct: "",
  //       leadSource: "",
  //       staffId: item.staffId,
  //       leadStage: item.leadStageIdentity,
  //       leadStageName: item.leadStageName,
  //       leadStatus: "",
  //       assignToUser: item.staffName,
  //       followUpDate: item.followUpDate || "",
  //       nextFollowUpDate: item.nextFollowUpDate || "",
  //       followUpType:
  //         item.followUpTypeIdentity || item.followupTypeIdentity || "",
  //       followUpTypeName: item.currentFollowupType || "",
  //       followUpNotes: item.stageChangeRemarks || "",
  //       staffIdentity: item.staffIdentity,
  //     }));
  //     setLeadsData(transformedLeads);
  //   }
  // }, [leadsResponse]);

  const handlePageChange = (newPage: number) => {
    if (editedLeads.size > 0) {
      setPendingPageChange(newPage);
      setShowUnsavedWarning(true);
      return;
    }

    proceedWithPageChange(newPage);
  };

  const proceedWithPageChange = (newPage: number) => {
    if (searchParams) {
      setCurrentPage(newPage);
      setQueryKey(prev => prev + 1);
      setSearchParams({ ...searchParams, page: newPage });
      setEditedLeads(new Set());
    }
  };

  const handleConfirmPageChange = () => {
    if (pendingPageChange !== null) {
      proceedWithPageChange(pendingPageChange);
    }
    setShowUnsavedWarning(false);
    setPendingPageChange(null);
  };

  const handleCancelPageChange = () => {
    setShowUnsavedWarning(false);
    setPendingPageChange(null);
  };

  const totalPages = leadsResponse?.totalPages || 0;

  const handleViewDetails = useCallback((leadId: string) => {
    setSelectedLeadId(leadId);
    setIsDetailsModalOpen(true);
  }, []);

  const handleViewHistory = useCallback((leadId: string) => {
    setSelectedLeadId(leadId);
    setIsLeadHistoryModalOpen(true);
  }, []);

  const handleCloseDetailsModal = useCallback(() => {
    setIsDetailsModalOpen(false);
    setSelectedLeadId("");
  }, []);

  const handleCloseLeadHistoryModal = useCallback(() => {
    setIsLeadHistoryModalOpen(false);
    setSelectedLeadId("");
  }, []);

  return (
    <article className="lead-followup-details-container">
      <FormContainer>
        <Flex justify="between" align="center" className="mb-4 w-full">
          <HeaderWrapper>
            <TitleHeader title="Lead Follow-up Details" />
          </HeaderWrapper>
          {/* <Button
            variant="defaultViolet"
            size="default"
            className="text-card flex items-center gap-1"
            onClick={handleOpenHistoryModal}
          >
            <Eye className="h-2 w-2" />
            Follow up History
          </Button> */}
        </Flex>

        {/* Filter Section */}
        <div className="mb-2 rounded-lg bg-gray-50 p-4">
          <Form.Row>
            <Form.Col lg={2} md={6} span={12}>
              <Form.Field label="Lead Name">
                <Controller
                  name="leadName"
                  control={filterControl}
                  render={({ field }) => (
                    <Input
                      {...field}
                      placeholder="Enter Lead Name"
                      size="form"
                      variant="form"
                      disabled={readonly}
                    />
                  )}
                />
              </Form.Field>
            </Form.Col>

            <Form.Col lg={2} md={6} span={12}>
              <Form.Field label="Assignee">
                <Controller
                  name="assignee"
                  control={filterControl}
                  render={({ field }) => (
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                      placeholder="All"
                      size="form"
                      variant="form"
                      fullWidth={true}
                      itemVariant="form"
                      options={[
                        { value: "all", label: "All" },
                        ...usersOptions,
                      ]}
                      loading={isLoadingUsers}
                      disabled={readonly || isLoadingUsers}
                    />
                  )}
                />
              </Form.Field>
            </Form.Col>

            <Form.Col lg={2} md={6} span={12}>
              <Form.Field label="Follow-up Type">
                <Controller
                  name="followUpType"
                  control={filterControl}
                  render={({ field }) => (
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                      placeholder="All"
                      size="form"
                      variant="form"
                      fullWidth={true}
                      itemVariant="form"
                      options={[
                        { value: "all", label: "All" },
                        ...leadFollowupTypeOptions,
                      ]}
                      disabled={readonly || isLoadingFollowupTypes}
                    />
                  )}
                />
              </Form.Field>
            </Form.Col>

            <Form.Col lg={2} md={6} span={12}>
              <Form.Field label="Lead Date">
                <Controller
                  name="leadDateFrom"
                  control={filterControl}
                  render={({ field }) => (
                    <DatePicker
                      value={field.value}
                      onChange={(value: string) => {
                        field.onChange(value);
                        const nextFollowUpDate = watchFilter().leadDateTo;
                        if (nextFollowUpDate && value > nextFollowUpDate) {
                          setFilterValue("leadDateTo", "");
                        }
                      }}
                      onBlur={() => field.onBlur()}
                      placeholder="dd/mm/yyyy"
                      allowManualEntry={true}
                      size="form"
                      variant="form"
                      disabled={readonly}
                      disableFutureDates={false}
                    />
                  )}
                />
              </Form.Field>
            </Form.Col>

            <Form.Col lg={2} md={6} span={12}>
              <Form.Field label="Lead Stage">
                <Controller
                  name="leadStage"
                  control={filterControl}
                  render={({ field }) => (
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                      placeholder="All"
                      size="form"
                      variant="form"
                      fullWidth={true}
                      itemVariant="form"
                      options={[
                        { value: "all", label: "All" },
                        ...leadStageOptions,
                      ]}
                      loading={isLoadingStage}
                      disabled={readonly || isLoadingStage}
                    />
                  )}
                />
              </Form.Field>
            </Form.Col>
            <Form.Col lg={2} md={6} span={12}>
              <Form.Field label="Next Follow-up Date">
                <Controller
                  name="leadDateTo"
                  control={filterControl}
                  render={({ field }) => (
                    <DatePicker
                      value={field.value}
                      onChange={(value: string) => {
                        field.onChange(value);
                        trigger?.("leadDateTo");
                      }}
                      onBlur={() => field.onBlur()}
                      placeholder="dd/mm/yyyy"
                      allowManualEntry={true}
                      size="form"
                      variant="form"
                      min={watchFilter().leadDateFrom || undefined}
                      disabled={readonly}
                      disableFutureDates={false}
                    />
                  )}
                />
              </Form.Field>
            </Form.Col>
          </Form.Row>
          <Form.Row>
            <Form.Col span={12}>
              <Flex justify="end" className="mt-2">
                <Button
                  type="button"
                  variant="outline"
                  size="compactPrimary"
                  onClick={handleResetFilter}
                  disabled={readonly}
                >
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Reset
                </Button>

                <div>
                  <Button
                    type="button"
                    variant="resetPrimary"
                    size="compactWhite"
                    onClick={handleFilter}
                    className="w-full"
                    disabled={readonly}
                  >
                    <Filter className="mr-2 h-4 w-4" />
                    Filter
                  </Button>
                </div>
              </Flex>
            </Form.Col>
          </Form.Row>
        </div>

        {/* Table Section */}
        <LeadFollowupTable
          leads={leadsData}
          selectedLeads={selectedLeads}
          onSelectLead={handleSelectLead}
          onSelectAll={handleSelectAll}
          onUpdateLeadData={handleUpdateLeadData}
          isLoading={isLoadingLeads && shouldShowData}
          followUpTypeOptions={leadFollowupTypeOptions.filter(
            opt => opt.value !== "all"
          )}
          leadStageOptions={leadStageOptions}
          currentPage={currentPage}
          totalPages={totalPages}
          totalElements={leadsResponse?.totalElements || 0}
          onPageChange={handlePageChange}
          onViewDetails={handleViewDetails}
          onViewHistory={handleViewHistory}
        />

        {/* Action Buttons */}
        {/* <div className="mb-6">
          <Flex.ActionGroup>
            <Button
              type="button"
              variant="resetCompact"
              size="compactWhite"
              onClick={handleReset}
              disabled={isSaving || readonly}
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Reset
            </Button>
            <Button
              type="button"
              variant="resetPrimary"
              size="compactWhite"
              onClick={onSubmit}
              disabled={isSaving || readonly || editedLeads.size === 0}
            >
              <Save className="mr-2 h-4 w-4" />
              {isSaving ? "Processing..." : "Save Follow-up Details"}
            </Button>
          </Flex.ActionGroup>
        </div> */}
      </FormContainer>

      {isHistoryModalOpen && (
        <LeadFollowupHistoryModal
          isOpen={isHistoryModalOpen}
          onClose={handleCloseHistoryModal}
        />
      )}

      {showUnsavedWarning && (
        <UnsavedChangesModal
          isOpen={showUnsavedWarning}
          onConfirm={handleConfirmPageChange}
          onCancel={handleCancelPageChange}
        />
      )}
      {isDetailsModalOpen && (
        <LeadDetailsModal
          isOpen={isDetailsModalOpen}
          onClose={handleCloseDetailsModal}
          leadId={selectedLeadId}
        />
      )}

      {isLeadHistoryModalOpen && (
        <LeadFollowupHistoryModal
          isOpen={isLeadHistoryModalOpen}
          onClose={handleCloseLeadHistoryModal}
          prefilledLeadId={selectedLeadId}
        />
      )}
    </article>
  );
};
