import React, { useCallback, useMemo, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Flex, HeaderWrapper, Label, TitleHeader } from "@/components";
import { InputWithSearch } from "@/components/ui/input-with-search";
import type { ChargeMasterFormData } from "@/types/loan-product-and-scheme-masters/charge-master.types";
import {
  useGetCalculationBaseQuery,
  useGetCalculationCriteriaQuery,
  useGetCalculationTypeQuery,
  useGetMonthAmountTypesQuery,
  // useGetModulesQuery,
  // useLazyGetSubModulesByModuleQuery,
  useLazySearchGLAccountsFourQuery,
} from "@/global/service/end-points/loan-product-and-service-masters/charge-master";
import { useAppSelector } from "@/hooks/store";
import { logger } from "@/global/service";
import { useGetModulesAndSubModulesQuery } from "@/global/service/end-points/approval-workflow/workflow-definitions";

interface SelectedGLAccount {
  identity: string;
  glCode: string;
  glName: string;
}

export const ChargeDetailsForm: React.FC = () => {
  const {
    control,
    register,
    watch,
    setValue,
    trigger,
    formState: { errors },
  } = useFormContext<ChargeMasterFormData>();

  const { isEditMode } = useAppSelector(state => state.chargeMaster);

  const selectedModule = watch("chargeDetails.module");

  const [selectedGLAccount, setSelectedGLAccount] =
    useState<SelectedGLAccount | null>(null);
  const [glAccountSearchTerm, setGLAccountSearchTerm] = useState("");
  const [glAccountResults, setGLAccountResults] = useState<SelectedGLAccount[]>(
    []
  );
  const [showGLAccountResults, setShowGLAccountResults] = useState(false);
  const {
    data: calculationBaseOptions = [],
    isLoading: isLoadingCalculationBase,
  } = useGetCalculationBaseQuery();

  const {
    data: calculationTypeOptions = [],
    isLoading: isLoadingCalculationType,
  } = useGetCalculationTypeQuery();

  const {
    data: calculationCriteriaOptions = [],
    isLoading: isLoadingCalculationCriteria,
  } = useGetCalculationCriteriaQuery();

  const { data: monthAmountOptions = [], isLoading: isLoadingMonthAmount } =
    useGetMonthAmountTypesQuery();

  const { data: moduleOptions = [], isLoading: isLoadingModules } =
    useGetModulesAndSubModulesQuery();

  // const [
  //   getSubModules,
  //   {
  //     data: subModuleOptions = [],
  //     isLoading: isLoadingSubModules,
  //     isFetching: isFetchingSubModules,
  //   },
  // ] = useLazyGetSubModulesByModuleQuery();

  const [triggerGLAccountSearch, { isLoading: isSearchingGLAccount }] =
    useLazySearchGLAccountsFourQuery();

  // useEffect(() => {
  //   if (selectedModule) {
  //     getSubModules(selectedModule);
  //   }
  // }, [selectedModule, getSubModules]);

  const subModuleOptions = useMemo(() => {
    if (!selectedModule || !moduleOptions.length) return [];

    const selectedModuleData = moduleOptions.find(
      mod => mod.value === selectedModule
    );

    if (!selectedModuleData?.subModules) return [];

    return selectedModuleData.subModules
      .filter(sub => sub.isActive)
      .map(sub => ({
        value: sub.identity,
        label: sub.subModuleName,
        identity: sub.identity,
      }));
  }, [selectedModule, moduleOptions]);

  const handleGLAccountSearch = useCallback((value: string) => {
    setGLAccountSearchTerm(value);

    if (value.length < 3) {
      setSelectedGLAccount(null);
      setGLAccountResults([]);
    }
  }, []);

  const handleGLAccountSearchClick = useCallback(async () => {
    const trimmedSearchTerm = glAccountSearchTerm.trim();

    if (!trimmedSearchTerm || trimmedSearchTerm.length < 3) {
      logger.info("Please enter at least 3 characters to search", {
        toast: true,
      });
      return;
    }
    try {
      const response = await triggerGLAccountSearch(trimmedSearchTerm);
      const results = response.data;
      if (results && results.length > 0) {
        setGLAccountResults(results);
        setShowGLAccountResults(true);
      } else {
        setGLAccountResults([]);
        setShowGLAccountResults(true);
        logger.error("No GL accounts found for this search term.", {
          toast: true,
        });
      }
    } catch (error) {
      logger.error(error, { toast: true });
      setGLAccountResults([]);
      setShowGLAccountResults(false);
    }
  }, [glAccountSearchTerm, triggerGLAccountSearch]);

  const handleGLAccountSelect = useCallback(
    (option: {
      value: string;
      label: string;
      glCode: string;
      glName: string;
    }) => {
      if (!option || !option.value) {
        logger.error("Invalid GL account data", { toast: true });
        return;
      }

      const selected: SelectedGLAccount = {
        identity: option.value,
        glCode: option.glCode,
        glName: option.glName,
      };

      setSelectedGLAccount(selected);
      setValue("chargeDetails.chargeIncomeGLAccount", option.value);
      setGLAccountSearchTerm("");
      setGLAccountResults([]);
      setShowGLAccountResults(false);
      void trigger("chargeDetails.chargeIncomeGLAccount");
    },
    [setValue, trigger]
  );

  const handleClearGLAccount = useCallback(() => {
    setSelectedGLAccount(null);
    setValue("chargeDetails.chargeIncomeGLAccount", "");
    setGLAccountSearchTerm("");
    setGLAccountResults([]);
    setShowGLAccountResults(false);
    void trigger("chargeDetails.chargeIncomeGLAccount");
  }, [setValue, trigger]);

  return (
    <div className="space-y-6">
      <div className="rounded-sm border border-cyan-600 bg-white p-6">
        <Flex justify="between" align="center" className="mb-6 w-full">
          <HeaderWrapper>
            <TitleHeader title="Charge Details" />
          </HeaderWrapper>
        </Flex>

        <Form>
          <Form.Row>
            {/* Charge Code - Only in edit mode */}
            {isEditMode && (
              <Form.Col lg={2} md={6} span={12}>
                <Form.Field
                  label="Charge Code"
                  required
                  error={errors.chargeDetails?.chargeCode}
                >
                  <Input
                    {...register("chargeDetails.chargeCode")}
                    placeholder="Charge Code"
                    size="form"
                    variant="form"
                    disabled
                  />
                </Form.Field>
              </Form.Col>
            )}

            {/* Charge Name */}
            <Form.Col lg={3} md={6} span={12}>
              <Form.Field
                label="Charge Name"
                required
                error={errors.chargeDetails?.chargeName}
              >
                <Input
                  {...register("chargeDetails.chargeName")}
                  placeholder="Enter Charge Name"
                  size="form"
                  variant="form"
                />
              </Form.Field>
            </Form.Col>

            {/* Module Dropdown */}
            <Form.Col lg={3} md={6} span={12}>
              <Form.Field
                label="Module"
                required
                error={errors.chargeDetails?.module}
              >
                <Controller
                  name="chargeDetails.module"
                  control={control}
                  render={({ field }) => (
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                      placeholder="Select Module"
                      size="form"
                      variant="form"
                      fullWidth={true}
                      itemVariant="form"
                      options={moduleOptions}
                      loading={isLoadingModules}
                      disabled={isLoadingModules}
                    />
                  )}
                />
              </Form.Field>
            </Form.Col>

            {/* SubModule Dropdown */}
            <Form.Col lg={3} md={6} span={12}>
              <Form.Field
                label="Sub Module"
                required
                error={errors.chargeDetails?.subModule}
              >
                <Controller
                  name="chargeDetails.subModule"
                  control={control}
                  render={({ field }) => (
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                      placeholder={
                        selectedModule
                          ? "Select Sub Module"
                          : "First select a Module"
                      }
                      size="form"
                      variant="form"
                      fullWidth={true}
                      itemVariant="form"
                      options={subModuleOptions}
                      // loading={isLoadingSubModules || isFetchingSubModules}
                      loading={isLoadingModules}
                      // disabled={
                      //   !selectedModule ||
                      //   isLoadingSubModules ||
                      //   isFetchingSubModules
                      // }
                      disabled={
                        !selectedModule ||
                        isLoadingModules ||
                        subModuleOptions.length === 0
                      }
                    />
                  )}
                />
              </Form.Field>
            </Form.Col>

            {/* Calculation On */}
            <Form.Col lg={3} md={6} span={12}>
              <Form.Field
                label="Calculation On"
                required
                error={errors.chargeDetails?.calculationOn}
              >
                <Controller
                  name="chargeDetails.calculationOn"
                  control={control}
                  render={({ field }) => (
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                      placeholder="Select Basis"
                      size="form"
                      variant="form"
                      fullWidth={true}
                      itemVariant="form"
                      options={calculationBaseOptions}
                      loading={isLoadingCalculationBase}
                      disabled={isLoadingCalculationBase}
                    />
                  )}
                />
              </Form.Field>
            </Form.Col>
          </Form.Row>

          <Form.Row className="mt-1">
            {/* Charge Calculation */}
            <Form.Col lg={2} md={6} span={12}>
              <Form.Field
                label="Charge Calculation"
                required
                error={errors.chargeDetails?.chargeCalculation}
              >
                <Controller
                  name="chargeDetails.chargeCalculation"
                  control={control}
                  render={({ field }) => (
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                      placeholder="Select Calculation Type"
                      size="form"
                      variant="form"
                      fullWidth={true}
                      itemVariant="form"
                      options={calculationTypeOptions}
                      loading={isLoadingCalculationType}
                      disabled={isLoadingCalculationType}
                    />
                  )}
                />
              </Form.Field>
            </Form.Col>

            {/* Charge Income GL Account  */}
            <Form.Col lg={3} md={6} span={12}>
              <Form.Field
                label="Charge Income GL Account"
                required
                error={errors.chargeDetails?.chargeIncomeGLAccount}
              >
                <InputWithSearch
                  placeholder="Search GL Account"
                  size="form"
                  variant="form"
                  value={
                    selectedGLAccount
                      ? `${selectedGLAccount.glName} - ${selectedGLAccount.glCode}`
                      : glAccountSearchTerm
                  }
                  onChange={e => {
                    const value = e.target.value;
                    const expectedValue = selectedGLAccount
                      ? `${selectedGLAccount.glName} - ${selectedGLAccount.glCode}`
                      : "";

                    if (selectedGLAccount && value !== expectedValue) {
                      setSelectedGLAccount(null);
                      setValue("chargeDetails.chargeIncomeGLAccount", "");
                      void trigger("chargeDetails.chargeIncomeGLAccount");
                    }
                    handleGLAccountSearch(value);
                  }}
                  onDoubleClick={() => {
                    if (selectedGLAccount) {
                      handleClearGLAccount();
                    }
                  }}
                  onKeyDown={e => {
                    if (e.key === "Escape" && selectedGLAccount) {
                      handleClearGLAccount();
                    }
                  }}
                  onSearch={handleGLAccountSearchClick}
                  isSearching={isSearchingGLAccount}
                  showDropdown={showGLAccountResults}
                  onClose={() => setShowGLAccountResults(false)}
                  dropdownOptions={glAccountResults.map(account => ({
                    value: account.identity,
                    label: `${account.glName} - ${account.glCode}`,
                    glCode: account.glCode,
                    glName: account.glName,
                  }))}
                  onOptionSelect={
                    handleGLAccountSelect as (option: unknown) => void
                  }
                  dropdownLoading={isSearchingGLAccount}
                />
              </Form.Field>
            </Form.Col>

            {/* Month/Amount */}
            <Form.Col lg={2} md={6} span={12}>
              <Form.Field
                label="Month/Amount"
                required
                error={errors.chargeDetails?.monthAmount}
              >
                <Controller
                  name="chargeDetails.monthAmount"
                  control={control}
                  render={({ field }) => (
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                      placeholder="Select Type"
                      size="form"
                      variant="form"
                      fullWidth={true}
                      itemVariant="form"
                      options={monthAmountOptions}
                      loading={isLoadingMonthAmount}
                      disabled={isLoadingMonthAmount}
                    />
                  )}
                />
              </Form.Field>
            </Form.Col>

            {/* Calculation Criteria */}
            <Form.Col lg={3} md={6} span={12}>
              <Form.Field
                label="Calculation Criteria"
                required
                error={errors.chargeDetails?.calculationCriteria}
              >
                <Controller
                  name="chargeDetails.calculationCriteria"
                  control={control}
                  render={({ field }) => (
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                      placeholder="Select Criteria"
                      size="form"
                      variant="form"
                      fullWidth={true}
                      itemVariant="form"
                      options={calculationCriteriaOptions}
                      loading={isLoadingCalculationCriteria}
                      disabled={isLoadingCalculationCriteria}
                    />
                  )}
                />
              </Form.Field>
            </Form.Col>

            {/* Charges Posting Required */}
            <Form.Col lg={2} md={6} span={12}>
              <Flex align="center" className="mt-6">
                <Controller
                  name="chargeDetails.chargesPostingRequired"
                  control={control}
                  render={({ field }) => (
                    <Switch
                      id="chargesPostingRequired"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  )}
                />
                <Label
                  htmlFor="chargesPostingRequired"
                  className="text-xs font-medium"
                >
                  Charges Posting Required
                </Label>
              </Flex>
            </Form.Col>
          </Form.Row>

          <Form.Row className="mt-1">
            {/* Active Status */}
            <Form.Col lg={2} md={6} span={12}>
              <Flex align="center" className="mt-6">
                <Controller
                  name="chargeDetails.isActive"
                  control={control}
                  render={({ field }) => (
                    <Switch
                      id="isActive"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  )}
                />
                <Label htmlFor="isActive" className="text-xs font-medium">
                  Active
                </Label>
              </Flex>
            </Form.Col>
          </Form.Row>
        </Form>
      </div>
    </div>
  );
};
