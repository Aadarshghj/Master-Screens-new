import React, { useCallback, useState, useMemo, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import { Flex } from "@/components/ui/flex";
import { Form } from "@/components/ui/form";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

import { HeaderWrapper } from "@/components/ui/header-wrapper/HeaderWrapper";
import { TitleHeader } from "@/components/ui/title-header/TitleHeader";
import { FormContainer } from "@/components/ui/form-container";
import { Filter, RefreshCw, Save } from "lucide-react";
import {
  useSearchLeadAssignmentsQuery,
  useBulkAssignLeadsMutation,
  useGetStaffQuery,
} from "@/global/service/end-points/lead/lead-assignment";

import {
  useGetProductsQuery,
  useGetLeadSourceQuery,
  useGetLeadStageQuery,
  useGetLeadStatusQuery,
  useGetAllGendersQuery,
} from "@/global/service/end-points/master/lead-master";
import { logger } from "@/global/service";
import {
  leadFilterDefaultValues,
  leadAssignmentDefaultValues,
} from "../constants/form.constants";
import type {
  LeadFilterFormData,
  LeadAssignmentFormData,
  LeadAssignmentFormProps,
  LeadSearchParams,
} from "@/types/lead";

import {
  leadAssignmentValidationSchema,
  validateLeadSelection,
} from "@/global/validation/lead/leadAssignment-schema";
import { LeadAssignmentTable } from "../Table/LeadAssignment";
import { DatePicker } from "@/components";

interface LeadData {
  leadIdentity: string;
  interestedProduct: string;
  leadSource: string;
  leadStage: string;
  leadStatus: string;
  gender: string;
  [key: string]: unknown;
}

interface TransformedLead extends LeadData {
  interestedProductId: string;
  leadSourceId: string;
  leadStageId: string;
  leadStatusId: string;
  genderId: string;
}

interface OptionType {
  value: string;
  label: string;
}

export const LeadAssignment: React.FC<LeadAssignmentFormProps> = ({
  readonly = false,
}) => {
  const [selectedLeads, setSelectedLeads] = useState<string[]>([]);
  const [searchParams, setSearchParams] = useState<LeadSearchParams | null>(
    null
  );
  const [shouldShowData, setShouldShowData] = useState(false);
  const [queryKey, setQueryKey] = useState(0);

  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize] = useState(10);

  const { data: leadProductOptions = [], isLoading: isLoadingProducts } =
    useGetProductsQuery();
  const { data: leadSourceOptions = [], isLoading: isLoadingSource } =
    useGetLeadSourceQuery();
  const { data: leadStageOptions = [], isLoading: isLoadingStage } =
    useGetLeadStageQuery();
  const { data: leadStatusOptions = [] } = useGetLeadStatusQuery();
  const { data: staffOptions = [], isLoading: isLoadingStaff } =
    useGetStaffQuery();
  const { data: genderOptions = [], isLoading: isLoadingGenders } =
    useGetAllGendersQuery();

  const {
    data: leadsResponse,
    isLoading: isLoadingLeads,
    refetch: refetchLeads,
    isError,
  } = useSearchLeadAssignmentsQuery(
    searchParams ? { ...searchParams, _key: queryKey } : null!,
    { skip: !searchParams || !shouldShowData }
  );

  const [bulkAssignLeads, { isLoading: isSaving }] =
    useBulkAssignLeadsMutation();

  const transformedLeads = useMemo(() => {
    if (!shouldShowData) return [];
    if (!searchParams) return [];
    if (isError) return [];
    if (!leadsResponse?.content) return [];

    const findNameById = (id: string, dataArray: OptionType[]) => {
      if (!id || !dataArray?.length) return id;
      const item = dataArray.find(option => option.value === id);
      return item?.label || id;
    };

    return leadsResponse.content.map(lead => {
      const {
        interestedProduct,
        leadSource,
        leadStage,
        leadStatus,
        gender,
        ...rest
      } = lead;

      return {
        ...rest,
        interestedProduct: findNameById(interestedProduct, leadProductOptions),
        leadSource: findNameById(leadSource, leadSourceOptions),
        leadStage: findNameById(leadStage, leadStageOptions),
        leadStatus: findNameById(leadStatus, leadStatusOptions),
        gender: findNameById(gender, genderOptions),
        interestedProductId: interestedProduct,
        leadSourceId: leadSource,
        leadStageId: leadStage,
        leadStatusId: leadStatus,
        genderId: gender,
      };
    });
  }, [
    shouldShowData,
    searchParams,
    leadsResponse,
    isError,
    leadProductOptions,
    leadSourceOptions,
    leadStageOptions,
    leadStatusOptions,
    genderOptions,
    // staffOptions,
  ]);

  const {
    control: filterControl,
    watch: watchFilter,
    reset: resetFilter,
    trigger,
  } = useForm<LeadFilterFormData>({
    defaultValues: {
      ...leadFilterDefaultValues,
      leadDate: new Date().toISOString().split("T")[0],
    },
  });

  const {
    handleSubmit,
    control: assignControl,
    reset: resetAssignment,
    formState: { errors },
  } = useForm<LeadAssignmentFormData>({
    resolver: yupResolver(leadAssignmentValidationSchema),
    defaultValues: leadAssignmentDefaultValues,
  });

  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    const dateParts = today.split("-");
    const formattedDate = `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;

    setSearchParams({
      page: 0,
      size: pageSize,
      leadDate: formattedDate,
    });
    setShouldShowData(true);
  }, [pageSize]);

  const handlePageChange = (newPage: number) => {
    if (searchParams) {
      setCurrentPage(newPage);
      setQueryKey(prev => prev + 1);
      setSearchParams({ ...searchParams, page: newPage });
    }
  };

  const handleFilter = useCallback(() => {
    const filters = watchFilter();
    const hasFilters = Boolean(
      (filters.leadProduct &&
        filters.leadProduct !== "" &&
        filters.leadProduct !== "all") ||
        (filters.leadSource &&
          filters.leadSource !== "" &&
          filters.leadSource !== "all") ||
        (filters.leadStage &&
          filters.leadStage !== "" &&
          filters.leadStage !== "all") ||
        (filters.gender && filters.gender !== "" && filters.gender !== "all") ||
        (filters.leadDate && filters.leadDate !== "")
    );

    if (!hasFilters) {
      setShouldShowData(false);
      setSelectedLeads([]);
      setSearchParams(null);
      setQueryKey(prev => prev + 1);
      return;
    }

    const apiParams: LeadSearchParams = {
      page: 0,
      size: pageSize,
    };

    if (filters.leadDate && filters.leadDate !== "") {
      const dateParts = filters.leadDate.split("-");
      if (dateParts.length === 3) {
        apiParams.leadDate = `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;
      }
    }

    setShouldShowData(false);
    setSelectedLeads([]);
    setCurrentPage(0);
    setQueryKey(prev => prev + 1);
    setSearchParams(apiParams);
    setShouldShowData(true);
  }, [watchFilter, pageSize]);

  const handleResetFilter = useCallback(() => {
    const today = new Date().toISOString().split("T")[0];
    resetFilter({
      ...leadFilterDefaultValues,
      leadDate: today,
    });
    setSelectedLeads([]);
    setCurrentPage(0);
    const dateParts = today.split("-");
    const formattedDate = `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;
    setSearchParams({
      page: 0,
      size: pageSize,
      leadDate: formattedDate,
    });
    setShouldShowData(true);
    setQueryKey(prev => prev + 1);
  }, [resetFilter, pageSize]);

  const leads = useMemo(() => {
    if (!shouldShowData) return [];
    if (!transformedLeads.length) return [];

    const filters = watchFilter();

    return transformedLeads.filter((lead: TransformedLead) => {
      const productMatch =
        !filters.leadProduct ||
        filters.leadProduct === "" ||
        filters.leadProduct === "all" ||
        lead.interestedProductId === filters.leadProduct;

      const sourceMatch =
        !filters.leadSource ||
        filters.leadSource === "" ||
        filters.leadSource === "all" ||
        lead.leadSourceId === filters.leadSource;

      const stageMatch =
        !filters.leadStage ||
        filters.leadStage === "" ||
        filters.leadStage === "all" ||
        lead.leadStageId === filters.leadStage;

      const genderMatch =
        !filters.gender ||
        filters.gender === "" ||
        filters.gender === "all" ||
        lead.genderId === filters.gender;

      return productMatch && sourceMatch && stageMatch && genderMatch;
    });
  }, [shouldShowData, transformedLeads, watchFilter]);

  const handleSelectAll = useCallback(
    (checked: boolean) => {
      if (checked) {
        setSelectedLeads(leads.map(lead => lead.leadIdentity));
      } else {
        setSelectedLeads([]);
      }
    },
    [leads]
  );

  const handleSelectLead = useCallback((leadId: string, checked: boolean) => {
    setSelectedLeads(prev =>
      checked ? [...prev, leadId] : prev.filter(id => id !== leadId)
    );
  }, []);

  const onSubmit = useCallback(
    async (data: LeadAssignmentFormData) => {
      const selectionError = validateLeadSelection(selectedLeads);
      if (selectionError) {
        logger.error(selectionError, { toast: true });
        return;
      }

      try {
        const payload = {
          leadIdentitys: selectedLeads,
          assignToUserIdentity: data.assignTo,
          assignmentDate: new Date().toISOString().split("T")[0],
        };

        await bulkAssignLeads(payload).unwrap();
        logger.info("Leads assigned successfully", { toast: true });
        setSelectedLeads([]);
        resetAssignment(leadAssignmentDefaultValues);
        refetchLeads();
      } catch (error) {
        logger.error(error, { toast: true });
      }
    },
    [selectedLeads, bulkAssignLeads, resetAssignment, refetchLeads]
  );

  const handleReset = useCallback(() => {
    const today = new Date().toISOString().split("T")[0];
    resetFilter({
      ...leadFilterDefaultValues,
      leadDate: today,
    });
    resetAssignment(leadAssignmentDefaultValues);
    setSelectedLeads([]);
    setCurrentPage(0);

    const dateParts = today.split("-");
    const formattedDate = `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;

    setSearchParams({
      page: 0,
      size: pageSize,
      leadDate: formattedDate,
    });
    setShouldShowData(true);
    setQueryKey(prev => prev + 1);
  }, [resetFilter, resetAssignment, pageSize]);

  return (
    <article className="lead-assignment-container">
      <FormContainer>
        <Flex justify="between" align="center" className="mb-6 w-full">
          <HeaderWrapper>
            <TitleHeader title="Lead Assignment" />
          </HeaderWrapper>
        </Flex>

        <div className="mb-7 rounded-lg bg-gray-50 p-4">
          <Form.Row>
            <Form.Col lg={2} md={6} span={12}>
              <Form.Field label="Lead Product / Service">
                <Controller
                  name="leadProduct"
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
                        ...leadProductOptions.filter(
                          option => option.value && option.value !== ""
                        ),
                      ]}
                      loading={isLoadingProducts}
                      disabled={readonly || isLoadingProducts}
                    />
                  )}
                />
              </Form.Field>
            </Form.Col>

            <Form.Col lg={2} md={6} span={12}>
              <Form.Field label="Lead Source">
                <Controller
                  name="leadSource"
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
                        ...leadSourceOptions.filter(
                          option => option.value && option.value !== ""
                        ),
                      ]}
                      loading={isLoadingSource}
                      disabled={readonly || isLoadingSource}
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
                        ...leadStageOptions.filter(
                          option => option.value && option.value !== ""
                        ),
                      ]}
                      loading={isLoadingStage}
                      disabled={readonly || isLoadingStage}
                    />
                  )}
                />
              </Form.Field>
            </Form.Col>

            <Form.Col lg={2} md={6} span={12}>
              <Form.Field label="Gender">
                <Controller
                  name="gender"
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
                        ...genderOptions.filter(
                          option => option.value && option.value !== ""
                        ),
                      ]}
                      loading={isLoadingGenders}
                      disabled={readonly || isLoadingGenders}
                    />
                  )}
                />
              </Form.Field>
            </Form.Col>

            <Form.Col lg={2} md={6} span={12}>
              <Form.Field label="Lead Date">
                <Controller
                  name="leadDate"
                  control={filterControl}
                  render={({ field }) => (
                    <DatePicker
                      value={
                        field.value || new Date().toISOString().split("T")[0]
                      }
                      onChange={(value: string) => {
                        field.onChange(value);
                        trigger?.("leadDate");
                      }}
                      onBlur={() => field.onBlur()}
                      disabled={readonly}
                      max={new Date().toISOString().split("T")[0]}
                      placeholder="dd/mm/yyyy"
                      allowManualEntry={true}
                      size="form"
                      variant="form"
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
                    variant="primary"
                    size="compact"
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

        <LeadAssignmentTable
          leads={leads}
          selectedLeads={selectedLeads}
          onSelectLead={handleSelectLead}
          onSelectAll={handleSelectAll}
          isLoading={isLoadingLeads && shouldShowData}
          staffOptions={staffOptions}
          currentPage={currentPage}
          totalPages={leadsResponse?.totalPages || 0}
          onPageChange={handlePageChange}
          onUpdateAssignment={async () => {
            refetchLeads();
          }}
          totalElements={leadsResponse?.totalElements || 0}
        />

        <Form onSubmit={handleSubmit(onSubmit)}>
          <Form.Row className="-mt-1">
            <Form.Col lg={3} md={6} span={12}>
              <Form.Field label="Assign To" required error={errors.assignTo}>
                <Controller
                  name="assignTo"
                  control={assignControl}
                  render={({ field }) => (
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                      placeholder="Select Staff"
                      size="form"
                      variant="form"
                      fullWidth={true}
                      itemVariant="form"
                      options={staffOptions.filter(
                        option => option.value && option.value !== ""
                      )}
                      loading={isLoadingStaff}
                      disabled={readonly || isLoadingStaff}
                    />
                  )}
                />
              </Form.Field>
            </Form.Col>
          </Form.Row>

          <div className="mt-1 mb-6">
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
                type="submit"
                variant="resetPrimary"
                size="compactWhite"
                disabled={isSaving || readonly || selectedLeads.length === 0}
              >
                <Save className="mr-2 h-4 w-4" />
                {isSaving ? "Processing..." : "Save Lead Assignment"}
              </Button>
            </Flex.ActionGroup>
          </div>
        </Form>
      </FormContainer>
    </article>
  );
};
