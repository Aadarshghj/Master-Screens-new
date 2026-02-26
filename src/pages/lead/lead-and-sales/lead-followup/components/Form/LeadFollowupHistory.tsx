import React, { useCallback, useEffect, useState } from "react";
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
import {
  useLazyGetLeadFollowupHistoryQuery,
  useSearchFollowupHistoryQuery,
} from "@/global/service/end-points/lead/lead-followup";
import {
  useGetFollowupTypeQuery,
  useGetLeadStageQuery,
  useGetUsersQuery,
} from "@/global/service/end-points/master/lead-master";
import type {
  LeadFollowupHistoryFilterFormData,
  LeadFollowupFormProps,
  LeadFollowupHistorySearchParams,
  LeadFollowupHistoryData,
} from "@/types/lead/lead-followup.types";
import { leadFollowupHistoryFilterDefaultValues } from "../../constants/form.constants";
import { LeadFollowupHistoryTable } from "../Table/LeadFollowupHistory";
import { DatePicker } from "@/components";

export const LeadFollowupHistory: React.FC<LeadFollowupFormProps> = ({
  readonly = false,
  isModal = false,
  prefilledLeadId,
}) => {
  const [historySearchParams, setHistorySearchParams] =
    useState<LeadFollowupHistorySearchParams | null>(null);
  const [shouldShowHistory, setShouldShowHistory] = useState(false);
  const [historyCurrentPage, setHistoryCurrentPage] = useState(0);
  const [historyPageSize] = useState(10);
  const [queryKey, setQueryKey] = useState(0);

  const [isViewingSpecificLead, setIsViewingSpecificLead] = useState(false);

  const [historyData, setHistoryData] = useState<LeadFollowupHistoryData[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  const [
    fetchLeadHistory,
    {
      data: specificLeadHistory,
      isLoading: isLoadingSpecificHistory,
      isError: isSpecificHistoryError,
    },
  ] = useLazyGetLeadFollowupHistoryQuery();

  const { data: leadStageOptions = [], isLoading: isLoadingStage } =
    useGetLeadStageQuery();

  const {
    data: leadFollowupTypeOptions = [],
    isLoading: isLoadingFoloowupTypes,
  } = useGetFollowupTypeQuery();

  const { data: usersOptions = [], isLoading: isLoadingUsers } =
    useGetUsersQuery();

  const {
    data: historyResponse,
    isLoading: isLoadingHistory,
    isError: isHistoryError,
  } = useSearchFollowupHistoryQuery(
    historySearchParams ? { ...historySearchParams, _key: queryKey } : null!,
    {
      skip: !historySearchParams || !shouldShowHistory || isViewingSpecificLead,
    }
  );

  const {
    control: historyFilterControl,
    watch: watchHistoryFilter,
    reset: resetHistoryFilter,
    setValue: setFilterValue,
    trigger,
  } = useForm<LeadFollowupHistoryFilterFormData>({
    defaultValues: {
      ...leadFollowupHistoryFilterDefaultValues,
    },
  });

  useEffect(() => {
    if (isViewingSpecificLead && specificLeadHistory?.histories) {
      setHistoryData(specificLeadHistory.histories);
      setTotalPages(specificLeadHistory.totalPages || 0);
      setTotalElements(specificLeadHistory.totalElements || 0);
    }
  }, [isViewingSpecificLead, specificLeadHistory]);

  useEffect(() => {
    if (
      !isViewingSpecificLead &&
      shouldShowHistory &&
      historyResponse?.histories
    ) {
      setHistoryData(historyResponse.histories);
      setTotalPages(historyResponse.totalPages || 0);
      setTotalElements(historyResponse.totalElements || 0);
    } else if (
      !isViewingSpecificLead &&
      shouldShowHistory &&
      historyResponse?.histories?.length === 0
    ) {
      setHistoryData([]);
      setTotalPages(0);
      setTotalElements(0);
    }
  }, [isViewingSpecificLead, shouldShowHistory, historyResponse]);

  useEffect(() => {
    if (prefilledLeadId && isModal) {
      setIsViewingSpecificLead(true);

      fetchLeadHistory({
        leadIdentity: prefilledLeadId,
        page: historyCurrentPage,
        size: historyPageSize,
      });
    }
  }, [
    prefilledLeadId,
    isModal,
    historyCurrentPage,
    historyPageSize,
    fetchLeadHistory,
  ]);

  useEffect(() => {
    if (!isModal || !prefilledLeadId) {
      setIsViewingSpecificLead(false);
      setHistoryData([]);
      setTotalPages(0);
      setTotalElements(0);
    }
  }, [isModal, prefilledLeadId]);

  const handleHistoryFilter = useCallback(() => {
    const filters = watchHistoryFilter();

    const hasFilters =
      (filters.leadId && filters.leadId.trim() !== "") ||
      (filters.assignee && filters.assignee !== "all") ||
      (filters.followUpType && filters.followUpType !== "all") ||
      (filters.leadStage && filters.leadStage !== "all") ||
      (filters.leadDateFrom && filters.leadDateFrom !== "") ||
      (filters.leadDateTo && filters.leadDateTo !== "");

    if (!hasFilters) {
      setShouldShowHistory(false);
      setHistorySearchParams(null);
      setQueryKey(prev => prev + 1);
      return;
    }

    const apiParams: LeadFollowupHistorySearchParams = {
      leadIdentity: "",
      staffId: "",
      followUpTypeIdentity: "",
      leadStageIdentity: "",
      leadDateFrom: "",
      leadDateTo: "",
      page: 0,
      size: historyPageSize,
      _key: 0,
    };

    if (filters.leadId && filters.leadId.trim() !== "") {
      apiParams.leadIdentity = filters.leadId.trim();
    }

    if (filters.leadDateFrom) {
      const dateParts = filters.leadDateFrom.split("-");
      if (dateParts.length === 3) {
        apiParams.leadDateFrom = `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;
      }
    }

    if (filters.leadDateTo) {
      const dateParts = filters.leadDateTo.split("-");
      if (dateParts.length === 3) {
        apiParams.leadDateTo = `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;
      }
    }

    if (filters.assignee && filters.assignee !== "all") {
      apiParams.staffId = filters.assignee;
    }

    if (filters.followUpType && filters.followUpType !== "all") {
      apiParams.followUpTypeIdentity = filters.followUpType;
    }

    if (filters.leadStage && filters.leadStage !== "all") {
      apiParams.leadStageIdentity = filters.leadStage;
    }

    setShouldShowHistory(false);
    setHistoryCurrentPage(0);
    setQueryKey(prev => prev + 1);
    setHistorySearchParams(apiParams);
    setShouldShowHistory(true);
  }, [watchHistoryFilter, historyPageSize]);

  const handleResetFilter = useCallback(() => {
    resetHistoryFilter({
      ...leadFollowupHistoryFilterDefaultValues,
    });
    setHistoryCurrentPage(0);

    setHistorySearchParams({
      leadIdentity: "",
      staffId: undefined,
      followUpTypeIdentity: "",
      leadStageIdentity: "",
      leadDateFrom: "",
      leadDateTo: "",
      page: 0,
      size: historyPageSize,
      _key: 0,
    });
    setShouldShowHistory(true);
    setQueryKey(prev => prev + 1);
  }, [resetHistoryFilter, historyPageSize]);

  const handleHistoryPageChange = (newPage: number) => {
    setHistoryCurrentPage(newPage);

    if (isViewingSpecificLead && prefilledLeadId) {
      fetchLeadHistory({
        leadIdentity: prefilledLeadId,
        page: newPage,
        size: historyPageSize,
      });
    } else if (historySearchParams) {
      setHistorySearchParams({ ...historySearchParams, page: newPage });
      setQueryKey(prev => prev + 1);
    }
  };

  useEffect(() => {
    if (!isViewingSpecificLead && !isModal) {
      setHistorySearchParams({
        leadIdentity: "",
        staffId: undefined,
        followUpTypeIdentity: "",
        leadStageIdentity: "",
        leadDateFrom: "",
        leadDateTo: "",
        page: 0,
        size: historyPageSize,
        _key: 0,
      });
      setShouldShowHistory(true);
    }
  }, [historyPageSize, isViewingSpecificLead, isModal]);

  const isLoading = isViewingSpecificLead
    ? isLoadingSpecificHistory
    : isLoadingHistory && shouldShowHistory;

  const isError = isViewingSpecificLead
    ? isSpecificHistoryError
    : isHistoryError;

  return (
    <article className="lead-followup-history-container">
      <FormContainer>
        {!isModal && (
          <Flex justify="between" align="center" className="mb-6 w-full">
            <HeaderWrapper>
              <TitleHeader title="Lead Follow-up History" />
            </HeaderWrapper>
          </Flex>
        )}

        {!isViewingSpecificLead && (
          <div className="mb-7 rounded-lg bg-gray-50 p-4">
            <Form.Row>
              <Form.Col lg={2} md={6} span={12}>
                <Form.Field label="Lead Name">
                  <Controller
                    name="leadId"
                    control={historyFilterControl}
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
                    control={historyFilterControl}
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
                    control={historyFilterControl}
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
                        disabled={readonly || isLoadingFoloowupTypes}
                      />
                    )}
                  />
                </Form.Field>
              </Form.Col>

              <Form.Col lg={2} md={6} span={12}>
                <Form.Field label="Lead Date ">
                  <Controller
                    name="leadDateFrom"
                    control={historyFilterControl}
                    render={({ field }) => (
                      <DatePicker
                        value={field.value}
                        onChange={(value: string) => {
                          field.onChange(value);
                          const nextFollowUpDate =
                            watchHistoryFilter().leadDateTo;
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
                    control={historyFilterControl}
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
                    control={historyFilterControl}
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
                        min={watchHistoryFilter().leadDateFrom || undefined}
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
                  <Button
                    type="button"
                    variant="resetPrimary"
                    size="compactWhite"
                    onClick={handleHistoryFilter}
                    disabled={readonly}
                  >
                    <Filter className="mr-2 h-4 w-4" />
                    Filter
                  </Button>
                </Flex>
              </Form.Col>
            </Form.Row>
          </div>
        )}

        <LeadFollowupHistoryTable
          history={historyData}
          isLoading={isLoading}
          isError={isError}
          currentPage={historyCurrentPage}
          totalPages={totalPages}
          totalElements={totalElements}
          onPageChange={handleHistoryPageChange}
        />
      </FormContainer>
    </article>
  );
};
