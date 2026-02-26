import React, { useState } from "react";
import { Flex } from "@/components/ui/flex";
import { HeaderWrapper } from "@/components/ui/header-wrapper/HeaderWrapper";
import { TitleHeader } from "@/components/ui/title-header/TitleHeader";
import { logger } from "@/global/service";

import { FormContainer } from "@/components/ui/form-container";
import { Form, Input, Select, Textarea, Switch } from "@/components";
import NeumorphicButton from "@/components/ui/neumorphic-button/neumorphic-button";
import { Controller } from "react-hook-form";
import { Search, Save } from "lucide-react";
import { SchemeSearch } from "../Modal/SchemeSearch";
import ReverseInterest from "../Modal/ReverseSearch";
import CapsuleButton from "@/components/ui/capsule-button/capsule-button";
import type { CreateLoanSchemeProps } from "@/types/loan-product-and schema Stepper/create-loan-and-product.types";
import { useLoanScheme } from "../hooks/useLoanScheme";
import { useAppSelector } from "@/hooks/store";

export const CreateLoanScheme: React.FC<CreateLoanSchemeProps> = ({
  onComplete,
  onSave,
  onUnsavedChanges,
}) => {
  const { approvalStatus } = useAppSelector(state => state.loanProduct);
  const isSentForApproval =
    approvalStatus === "PENDING" || approvalStatus === "APPROVED";

  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [isReverseInterestModalOpen, setIsReverseInterestModalOpen] =
    useState(false);

  const {
    control,
    register,
    handleSubmit,
    reset,
    errors,
    watch,
    trigger,
    isEditMode,
    localEditMode,
    loanProductOptions,
    schemeTypeOptions,
    periodMinTypeOptions,
    periodMaxTypeOptions,
    interestTypeOptions,
    penalInterestBaseOptions,
    rebateBaseOptions,
    slabPeriodTypeOptions,
    watchMoratoriumInterestRequired,
    watchRebateApplicable,
    watchPenalInterestApplicable,
    watchEmiApplicable,
    watchInterestType,
    onSubmit,
    isCreating,
    isUpdating,
    isLoadingScheme,
    formState,
    hasBeenSaved,
  } = useLoanScheme();

  const isSlabwise =
    watchInterestType &&
    interestTypeOptions.some(
      opt =>
        opt.value === watchInterestType &&
        opt.label?.toLowerCase().includes("slab")
    );

  const hasCalledCompletionRef = React.useRef(false);

  React.useEffect(() => {
    if (onUnsavedChanges) {
      onUnsavedChanges(formState.isDirty);
    }
  }, [formState.isDirty, onUnsavedChanges]);

  React.useEffect(() => {
    hasCalledCompletionRef.current = false;
  }, [hasBeenSaved]);

  React.useEffect(() => {
    if (hasBeenSaved && onComplete && !hasCalledCompletionRef.current) {
      onComplete();
      hasCalledCompletionRef.current = true;
    }
  }, [hasBeenSaved, onComplete]);

  return (
    <FormContainer>
      <Flex justify="between" align="center" className="mb-4 w-full">
        <HeaderWrapper>
          <TitleHeader title="Create New Loan Scheme" />
        </HeaderWrapper>
        <CapsuleButton
          onClick={() => setIsSearchModalOpen(true)}
          label="Search Scheme"
          icon={Search}
        />
      </Flex>

      <Form
        onSubmit={handleSubmit(
          data => onSubmit(data, onSave, onComplete),
          errors => {
            if (Object.keys(errors).length > 0) {
              logger.error("Form validation failed", { pushLog: false });
            }
          }
        )}
      >
        {/* Row 1 */}
        <Form.Row>
          <Form.Col lg={2} md={6} span={12}>
            <Form.Field label="Loan Product" required>
              <Controller
                name="loanProductName"
                control={control}
                render={({ field }) => (
                  <Select
                    key={`loan-product-${field.value}-${loanProductOptions.length}`}
                    value={field.value || ""}
                    onValueChange={field.onChange}
                    placeholder="Select loan product"
                    size="form"
                    variant="form"
                    fullWidth={true}
                    itemVariant="form"
                    options={loanProductOptions}
                  />
                )}
              />
              <Form.Error error={errors.loanProductName} />
            </Form.Field>
          </Form.Col>

          {(isEditMode || localEditMode) && (
            <Form.Col lg={2} md={6} span={12}>
              <Form.Field label="Scheme Code">
                <Input
                  {...register("schemeCode")}
                  placeholder="Auto-generate new record"
                  size="form"
                  disabled={true}
                />
                <Form.Error error={errors.schemeCode} />
              </Form.Field>
            </Form.Col>
          )}

          <Form.Col lg={2} md={6} span={12}>
            <Form.Field label="Scheme Name" required>
              <Input
                {...register("schemeName")}
                placeholder="Enter scheme name"
                size="form"
                textTransform="uppercase"
              />
              <Form.Error error={errors.schemeName} />
            </Form.Field>
          </Form.Col>

          <Form.Col lg={2} md={6} span={12}>
            <Form.Field label="Scheme Type" required>
              <Controller
                name="schemeTypeName"
                control={control}
                render={({ field }) => (
                  <Select
                    key={`scheme-type-${field.value}-${schemeTypeOptions.length}`}
                    value={field.value || ""}
                    onValueChange={field.onChange}
                    placeholder="Select scheme type"
                    size="form"
                    variant="form"
                    fullWidth={true}
                    itemVariant="form"
                    options={schemeTypeOptions}
                  />
                )}
              />
              <Form.Error error={errors.schemeTypeName} />
            </Form.Field>
          </Form.Col>

          <Form.Col lg={2} md={6} span={12}>
            <Form.Field label="Effective From" required>
              <Input
                {...register("effectiveFrom")}
                type="date"
                size="form"
                placeholder="dd-mm-yyyy"
              />
              <Form.Error error={errors.effectiveFrom} />
            </Form.Field>
          </Form.Col>

          <Form.Col lg={2} md={6} span={12}>
            <Form.Field label="Effective To">
              <Input
                {...register("effectiveTo")}
                type="date"
                size="form"
                placeholder="dd-mm-yyyy"
              />
              <Form.Error error={errors.effectiveTo} />
            </Form.Field>
          </Form.Col>
        </Form.Row>

        {/* Row 2 */}
        <Form.Row>
          <Form.Col lg={2} md={6} span={12}>
            <Form.Field label="From Amount" required>
              <Input
                {...register("fromAmount")}
                type="text"
                placeholder="Enter From Amount"
                size="form"
              />
              <Form.Error error={errors.fromAmount} />
            </Form.Field>
          </Form.Col>

          <Form.Col lg={2} md={6} span={12}>
            <Form.Field label="To Amount" required>
              <Input
                {...register("toAmount")}
                type="text"
                placeholder="Enter To Amount"
                size="form"
              />
              <Form.Error error={errors.toAmount} />
            </Form.Field>
          </Form.Col>

          <Form.Col lg={1} md={3} span={12}>
            <Form.Field label="MinimumPeriod" required>
              <Input
                {...register("minimumPeriod")}
                type="text"
                placeholder="Enter period"
                size="form"
              />
              <Form.Error error={errors.minimumPeriod} />
            </Form.Field>
          </Form.Col>

          <Form.Col lg={2} md={6} span={12}>
            <Form.Field label=" Period Type" required>
              <Controller
                name="minPeriodTypeName"
                control={control}
                render={({ field }) => (
                  <Select
                    key={`min-period-${field.value}-${periodMinTypeOptions.length}`}
                    value={field.value || ""}
                    onValueChange={value => {
                      field.onChange(value);
                      trigger("minPeriodTypeName");
                      trigger("periodTypeName");
                    }}
                    placeholder="Select min period type"
                    size="form"
                    variant="form"
                    fullWidth={true}
                    itemVariant="form"
                    options={periodMinTypeOptions}
                  />
                )}
              />
              <Form.Error error={errors.minPeriodTypeName} />
            </Form.Field>
          </Form.Col>

          <Form.Col lg={1} md={6} span={12}>
            <Form.Field label="MaximumPeriod" required>
              <Input
                {...register("maximumPeriod")}
                type="text"
                placeholder="Enter period"
                size="form"
              />
              <Form.Error error={errors.maximumPeriod} />
            </Form.Field>
          </Form.Col>

          <Form.Col lg={2} md={6} span={12}>
            <Form.Field label="Period Type" required>
              <Controller
                name="periodTypeName"
                control={control}
                render={({ field }) => (
                  <Select
                    key={`max-period-${field.value}-${periodMaxTypeOptions.length}`}
                    value={field.value || ""}
                    onValueChange={value => {
                      field.onChange(value);
                      trigger("periodTypeName");
                      trigger("maximumPeriod");
                    }}
                    placeholder="Select period type"
                    size="form"
                    variant="form"
                    fullWidth={true}
                    itemVariant="form"
                    options={periodMaxTypeOptions}
                  />
                )}
              />
              <Form.Error error={errors.periodTypeName} />
            </Form.Field>
          </Form.Col>
          <Form.Col lg={2} md={6} span={12}>
            <Form.Field label="Interest Type Flag" required>
              <Controller
                name="interestTypeName"
                control={control}
                render={({ field }) => (
                  <Select
                    key={`interest-type-${field.value}-${interestTypeOptions.length}`}
                    value={field.value || ""}
                    onValueChange={field.onChange}
                    placeholder="Select interest Type Flag"
                    size="form"
                    variant="form"
                    fullWidth={true}
                    itemVariant="form"
                    options={interestTypeOptions}
                  />
                )}
              />
              <Form.Error error={errors.interestTypeName} />
            </Form.Field>
          </Form.Col>
        </Form.Row>

        {/* Row 3 - All Toggles and Conditional Fields in ONE Row */}
        <Form.Row>
          {!isSlabwise && (
            <Form.Col lg={2} md={12} span={12}>
              <Form.Field label="Fixed Interest rate" required>
                <Input
                  {...register("fixedInterestRate")}
                  type="text"
                  placeholder="Enter Fixed Interest Rate"
                  size="form"
                />
                <Form.Error error={errors.fixedInterestRate} />
              </Form.Field>
            </Form.Col>
          )}

          {isSlabwise && (
            <Form.Col lg={2} md={12} span={12}>
              <Form.Field label="Slab Period Type">
                <Controller
                  name="maxPeriodTypeName"
                  control={control}
                  render={({ field }) => (
                    <Select
                      value={field.value || ""}
                      onValueChange={field.onChange}
                      placeholder="Select Slab Period Type"
                      size="form"
                      variant="form"
                      fullWidth={true}
                      itemVariant="form"
                      options={slabPeriodTypeOptions}
                    />
                  )}
                />
                <Form.Error error={errors.maxPeriodTypeName} />
              </Form.Field>
            </Form.Col>
          )}

          <Form.Col lg={2} md={12} span={12}>
            <Form.Field>
              <div className="flex items-center gap-2 pt-6 pl-8">
                <Controller
                  name="penalInterestApplicable"
                  control={control}
                  render={({ field }) => (
                    <Switch
                      id="penalInterestApplicable"
                      checked={field.value || false}
                      onCheckedChange={field.onChange}
                    />
                  )}
                />
                <label
                  htmlFor="penalInterestApplicable"
                  className="text-[10px] font-medium text-gray-700"
                >
                  Penal Interest Applicable
                </label>
              </div>
            </Form.Field>
          </Form.Col>

          {watchPenalInterestApplicable && (
            <>
              <Form.Col lg={2} md={12} span={12}>
                <Form.Field label="Penal Interest" required>
                  <Input
                    {...register("penalInterest")}
                    type="text"
                    placeholder="Enter Penal Interest"
                    size="form"
                  />
                  <Form.Error error={errors.penalInterest} />
                </Form.Field>
              </Form.Col>

              <Form.Col lg={2} md={12} span={12}>
                <Form.Field label="Penal Interest On" required>
                  <Controller
                    name="penalInterestBaseName"
                    control={control}
                    render={({ field }) => (
                      <Select
                        value={field.value || ""}
                        onValueChange={field.onChange}
                        placeholder="Select Penal interest on"
                        size="form"
                        variant="form"
                        fullWidth={true}
                        itemVariant="form"
                        options={penalInterestBaseOptions}
                      />
                    )}
                  />
                  <Form.Error error={errors.penalInterestBaseName} />
                </Form.Field>
              </Form.Col>
            </>
          )}

          <Form.Col lg={2} md={12} span={12}>
            <Form.Field>
              <div className="flex items-center gap-2 pt-6 pl-8">
                <Controller
                  name="emiApplicable"
                  control={control}
                  render={({ field }) => (
                    <Switch
                      id="emiApplicable"
                      checked={field.value || false}
                      onCheckedChange={field.onChange}
                    />
                  )}
                />
                <label
                  htmlFor="emiApplicable"
                  className="text-[10px] font-medium text-gray-700"
                >
                  EMI Applicable
                </label>
              </div>
            </Form.Field>
          </Form.Col>

          {watchEmiApplicable && (
            <Form.Col lg={2} md={12} span={12}>
              <Form.Field label="Grace Period" required>
                <Input
                  {...register("gracePeriod")}
                  type="text"
                  placeholder="Enter Grace Period"
                  size="form"
                />
                <Form.Error error={errors.gracePeriod} />
              </Form.Field>
            </Form.Col>
          )}

          <Form.Col lg={2} md={12} span={12}>
            <Form.Field>
              <div className="flex items-center gap-2 pt-4 pl-4">
                <Controller
                  name="moratoriumInterestRequired"
                  control={control}
                  render={({ field }) => (
                    <Switch
                      id="moratoriumInterestRequired"
                      checked={field.value || false}
                      onCheckedChange={field.onChange}
                    />
                  )}
                />
                <label
                  htmlFor="moratoriumInterestRequired"
                  className="text-[10px] font-medium text-gray-700"
                >
                  Moratorium Interest Variation Required
                </label>
              </div>
            </Form.Field>
          </Form.Col>

          {watchMoratoriumInterestRequired && (
            <Form.Col lg={2} md={12} span={12}>
              <Form.Field label="Moratorium Interest Rate" required>
                <Input
                  {...register("moratoriumInterestRate")}
                  type="text"
                  placeholder="Enter Moratorium Interest Rate"
                  size="form"
                />
                <Form.Error error={errors.moratoriumInterestRate} />
              </Form.Field>
            </Form.Col>
          )}

          <Form.Col lg={2} md={12} span={12}>
            <Form.Field>
              <div className="flex items-center gap-2 pt-6 pl-8">
                <Controller
                  name="rebateApplicable"
                  control={control}
                  render={({ field }) => (
                    <Switch
                      id="rebateToggle"
                      checked={field.value || false}
                      onCheckedChange={field.onChange}
                    />
                  )}
                />
                <label
                  htmlFor="rebateToggle"
                  className="text-[10px] font-medium text-gray-700"
                >
                  Rebate
                </label>
              </div>
            </Form.Field>
          </Form.Col>

          {watchRebateApplicable && (
            <>
              <Form.Col lg={2} md={12} span={12}>
                <Form.Field label="Rebate On" required>
                  <Controller
                    name="rebateBaseName"
                    control={control}
                    render={({ field }) => (
                      <Select
                        key={`rebate-base-${rebateBaseOptions.length}`}
                        value={field.value || ""}
                        onValueChange={field.onChange}
                        placeholder="Select Rebate on"
                        size="form"
                        variant="form"
                        fullWidth={true}
                        itemVariant="form"
                        options={rebateBaseOptions}
                      />
                    )}
                  />
                  <Form.Error error={errors.rebateBaseName} />
                </Form.Field>
              </Form.Col>

              <Form.Col lg={2} md={12} span={12}>
                <Form.Field label="Rebate %" required>
                  <Input
                    {...register("rebatePercentage")}
                    type="text"
                    placeholder="Enter Rebate Percentage"
                    size="form"
                  />
                  <Form.Error error={errors.rebatePercentage} />
                </Form.Field>
              </Form.Col>
            </>
          )}

          <Form.Col lg={2} md={12} span={12}>
            <Form.Field>
              <div className="flex items-center gap-2 pt-6 pl-4">
                <Controller
                  name="reverseInterestApplicable"
                  control={control}
                  render={({ field }) => (
                    <Switch
                      id="reverseInterestApplicable"
                      checked={field.value || false}
                      onCheckedChange={field.onChange}
                    />
                  )}
                />
                <label
                  htmlFor="reverseInterestApplicable"
                  className="text-[10px] font-medium text-gray-700"
                >
                  Reverse Interest Applicable
                </label>
              </div>
            </Form.Field>
          </Form.Col>

          <Form.Col lg={3} md={12} span={12}>
            <Form.Field label="Remarks">
              <Textarea
                {...register("remarks")}
                placeholder="Enter remarks"
                rows={3}
                className="w-full text-xs placeholder:text-xs"
              />
              <Form.Error error={errors.remarks} />
            </Form.Field>
          </Form.Col>

          <Form.Col lg={2} md={6} span={12}>
            <Form.Field>
              <div className="flex items-center gap-2 pt-6 pl-8">
                <Controller
                  name="takeoverScheme"
                  control={control}
                  render={({ field }) => (
                    <Switch
                      id="takeoverScheme"
                      checked={field.value || false}
                      onCheckedChange={field.onChange}
                    />
                  )}
                />
                <label
                  htmlFor="takeoverScheme"
                  className="text-[10px] font-medium text-gray-700"
                >
                  Takeover Scheme
                </label>
              </div>
            </Form.Field>
          </Form.Col>

          <Form.Col lg={2} md={6} span={12}>
            <Form.Field>
              <div className="flex items-center gap-2 pt-6 pl-8">
                <Controller
                  name="coLendingScheme"
                  control={control}
                  render={({ field }) => (
                    <Switch
                      id="coLendingScheme"
                      checked={field.value || false}
                      onCheckedChange={field.onChange}
                    />
                  )}
                />
                <label
                  htmlFor="coLendingScheme"
                  className="text-[10px] font-medium text-gray-700"
                >
                  Co-Lending Scheme
                </label>
              </div>
            </Form.Field>
          </Form.Col>

          {(isEditMode || localEditMode) && (
            <Form.Col lg={2} md={6} span={12}>
              <Form.Field>
                <div className="flex items-center gap-2 pt-6 pl-8">
                  <Controller
                    name="active"
                    control={control}
                    render={({ field }) => (
                      <Switch
                        id="active"
                        checked={field.value || false}
                        onCheckedChange={field.onChange}
                      />
                    )}
                  />
                  <label
                    htmlFor="active"
                    className="text-[10px] font-medium text-gray-700"
                  >
                    Active
                  </label>
                </div>
              </Form.Field>
            </Form.Col>
          )}
        </Form.Row>

        {/* Action Buttons */}
        <Flex justify="end" className="mt-9">
          <NeumorphicButton
            type="submit"
            variant="default"
            size="default"
            disabled={
              isCreating || isUpdating || isLoadingScheme || isSentForApproval
            }
          >
            <Save width={12} />
            Save Loan Scheme
          </NeumorphicButton>
        </Flex>
      </Form>

      <SchemeSearch
        isOpen={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
        onSelectScheme={() => {
          setIsSearchModalOpen(false);
        }}
      />

      <ReverseInterest
        isOpen={isReverseInterestModalOpen}
        onClose={() => setIsReverseInterestModalOpen(false)}
        onToggleDisable={() =>
          reset({ ...watch(), reverseInterestApplicable: false })
        }
      />
    </FormContainer>
  );
};
