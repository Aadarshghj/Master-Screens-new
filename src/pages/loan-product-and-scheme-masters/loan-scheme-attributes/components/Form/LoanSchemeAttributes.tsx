import React from "react";
import { Controller } from "react-hook-form";
import { Flex } from "@/components/ui/flex";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { HeaderWrapper } from "@/components/ui/header-wrapper/HeaderWrapper";
import { TitleHeader } from "@/components/ui/title-header/TitleHeader";
import type { LoanSchemeAttributeFormProps } from "@/types/loan-product-and-scheme-masters/loan-scheme-attributes.types";
import { RefreshCw, Save, Plus, ChevronDown, X } from "lucide-react";
import { FormContainer } from "@/components/ui/form-container";
import { Switch, Textarea } from "@/components";
import { DynamicDefaultValue } from "@/components/shared/DynamicDefaultValue";
import { useLoanSchemeAttributesForm } from "../../hooks/useLoanSchemeAttributesForm";

export const LoanSchemeAttributesForm: React.FC<
  LoanSchemeAttributeFormProps
> = ({ readonly = false }) => {
  const {
    isFormOpen,
    isEditMode,
    isLoading,
    isLoadingProducts,
    isLoadingDataTypes,
    selectedDataType,
    selectedDataTypeName,
    control,
    register,
    errors,
    setValue,
    loanProductOptions,
    dataTypeOptions,
    onSubmit,
    handleReset,
    toggleForm,
    handleAddNew,
    handleClear,
    trigger,
  } = useLoanSchemeAttributesForm(readonly);

  const handleClearClick = () => {
    handleClear();
  };

  return (
    <article className="loan-scheme-attributes-form-container">
      <FormContainer>
        <Flex justify="between" align="center" className="mb-6 w-full">
          <HeaderWrapper>
            <TitleHeader title="Loan Scheme Attributes Master" />
          </HeaderWrapper>
          {!isEditMode ? (
            <Button
              variant="resetPrimary"
              size="compactWhite"
              onClick={toggleForm}
              disabled={isLoading}
            >
              <div className="mr-2 flex h-4 w-4 items-center justify-center rounded-full bg-white">
                <Plus className="text-primary h-3 w-3" />
              </div>
              Add Loan Scheme Attribute
              <ChevronDown
                className={`ml-2 h-4 w-4 transition-transform ${isFormOpen ? "rotate-180" : ""}`}
              />
            </Button>
          ) : (
            <Button
              variant="resetPrimary"
              size="compactWhite"
              onClick={handleAddNew}
              disabled={isLoading}
            >
              <Plus className="mr-2 h-3 w-3" />
              Add New Attribute
            </Button>
          )}
        </Flex>

        {(isFormOpen || isEditMode) && (
          <Form onSubmit={onSubmit}>
            <Form.Row>
              <Form.Col lg={2} md={6} span={12}>
                <Form.Field
                  label="Loan Product"
                  required
                  error={errors.loanProduct}
                >
                  <Controller
                    name="loanProduct"
                    control={control}
                    render={({ field }) => (
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                        disabled={isLoading || readonly || isLoadingProducts}
                        placeholder="Select Loan Product"
                        size="form"
                        variant="form"
                        fullWidth={true}
                        itemVariant="form"
                        options={loanProductOptions}
                        loading={isLoadingProducts}
                      />
                    )}
                  />
                </Form.Field>
              </Form.Col>

              <Form.Col lg={3} md={6} span={12}>
                <Form.Field
                  label="Attribute Key"
                  required
                  error={errors.attributeKey}
                >
                  <Input
                    {...register("attributeKey")}
                    placeholder="Enter Attribute Key"
                    size="form"
                    variant="form"
                    disabled={isLoading || readonly}
                  />
                </Form.Field>
              </Form.Col>

              <Form.Col lg={2} md={6} span={12}>
                <Form.Field
                  label="Attribute Name"
                  required
                  error={errors.attributeName}
                >
                  <Input
                    {...register("attributeName")}
                    placeholder="Enter Attribute Name"
                    size="form"
                    variant="form"
                    disabled={isLoading || readonly}
                  />
                </Form.Field>
              </Form.Col>

              <Form.Col lg={2} md={6} span={12}>
                <Form.Field label="Data Type" required error={errors.dataType}>
                  <Controller
                    name="dataType"
                    control={control}
                    render={({ field }) => (
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                        disabled={isLoading || readonly || isLoadingDataTypes}
                        placeholder="Select Data Type"
                        size="form"
                        variant="form"
                        fullWidth={true}
                        itemVariant="form"
                        options={dataTypeOptions}
                        loading={isLoadingDataTypes}
                      />
                    )}
                  />
                </Form.Field>
              </Form.Col>

              {selectedDataTypeName === "string" && (
                <Form.Col lg={3} md={6} span={12}>
                  <Form.Field label="List Values" error={errors.listValues}>
                    <Input
                      {...register("listValues")}
                      placeholder="Enter comma-separated values"
                      size="form"
                      variant="form"
                      disabled={isLoading || readonly}
                    />
                  </Form.Field>
                </Form.Col>
              )}
            </Form.Row>

            <Form.Row className="mt-4">
              <Form.Col lg={3} md={6} span={12}>
                <Form.Field
                  label="Default Value"
                  required
                  error={errors.defaultValue}
                >
                  <DynamicDefaultValue
                    control={control}
                    name="defaultValue"
                    dataType={selectedDataType}
                    dataTypeOptions={dataTypeOptions}
                    isLoading={isLoading}
                    readonly={readonly}
                    setValue={setValue}
                    error={errors.defaultValue}
                    trigger={trigger}
                  />
                </Form.Field>
              </Form.Col>

              <Form.Col lg={3} md={6} span={12}>
                <Form.Field label="Description" error={errors.description}>
                  <Textarea
                    {...register("description")}
                    placeholder="Enter Description"
                    size="form"
                    variant="form"
                    rows={3}
                    disabled={isLoading || readonly}
                  />
                </Form.Field>
              </Form.Col>

              <Form.Col lg={3} md={6} span={12}>
                <div className="flex gap-6 pt-6">
                  <Form.Field label="Required">
                    <Controller
                      name="isRequired"
                      control={control}
                      render={({ field }) => (
                        <Switch
                          id="isRequired"
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          disabled={isLoading || readonly}
                        />
                      )}
                    />
                  </Form.Field>

                  <Form.Field label="Active">
                    <Controller
                      name="isActive"
                      control={control}
                      render={({ field }) => (
                        <Switch
                          id="isActive"
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          disabled={isLoading || readonly}
                        />
                      )}
                    />
                  </Form.Field>

                  <Form.Field label="Takeover (BT) Scheme">
                    <Controller
                      name="takeoverBtiScheme"
                      control={control}
                      render={({ field }) => (
                        <Switch
                          id="takeoverBtiScheme"
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          disabled={isLoading || readonly}
                        />
                      )}
                    />
                  </Form.Field>
                </div>
              </Form.Col>
            </Form.Row>

            <div className="mt-6">
              <Flex.ActionGroup>
                <Button
                  type="button"
                  variant="resetCompact"
                  size="compactWhite"
                  onClick={handleReset}
                  disabled={isLoading || readonly}
                >
                  <X className="mr-2 h-4 w-4" />
                  Cancel
                </Button>
                <Button
                  type="button"
                  variant="resetCompact"
                  size="compactWhite"
                  onClick={handleClearClick}
                  disabled={isLoading || readonly}
                >
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Reset
                </Button>
                <Button
                  type="submit"
                  variant="resetPrimary"
                  size="compactWhite"
                  disabled={isLoading || readonly}
                >
                  <Save className="mr-2 h-4 w-4" />
                  {isLoading ? "Processing..." : isEditMode ? "Update" : "Save"}
                </Button>
              </Flex.ActionGroup>
            </div>
          </Form>
        )}
      </FormContainer>
    </article>
  );
};
