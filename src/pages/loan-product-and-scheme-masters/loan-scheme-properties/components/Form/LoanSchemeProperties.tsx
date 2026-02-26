import React from "react";
import { Controller } from "react-hook-form";
import { Flex } from "@/components/ui/flex";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { HeaderWrapper } from "@/components/ui/header-wrapper/HeaderWrapper";
import { TitleHeader } from "@/components/ui/title-header/TitleHeader";
import { RefreshCw, Save, Plus, ChevronDown, X } from "lucide-react";
import { FormContainer } from "@/components/ui/form-container";
import { Label, Switch, Textarea } from "@/components";
import { DynamicDefaultValue } from "@/components/shared/DynamicDefaultValue";
import { useLoanSchemePropertyForm } from "../../hooks/useLoanSchemePropertyForm";
import type { LoanSchemePropertyFormProps } from "@/types/loan-product-and-scheme-masters/loan-scheme-properties.types";

export const LoanSchemePropertiesForm: React.FC<
  LoanSchemePropertyFormProps
> = ({ readonly = false }) => {
  const {
    formMethods,
    isFormOpen,
    isEditMode,
    loanProductOptions,
    dataTypeOptions,
    selectedDataType,
    isLoading,
    isLoadingProducts,
    isLoadingDataTypes,
    onSubmit,
    handleReset,
    toggleForm,
    handleAddNew,
    handleClear,
  } = useLoanSchemePropertyForm(readonly);

  const {
    register,
    control,
    setValue,
    formState: { errors },
  } = formMethods;

  const handleClearClick = () => {
    handleClear();
  };

  return (
    <article className="loan-scheme-properties-form-container">
      <FormContainer>
        <Flex justify="between" align="center" className="mb-6 w-full">
          <HeaderWrapper>
            <TitleHeader title="Loan Scheme Properties Master" />
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
              Add Loan Scheme Properties
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
              Add New Property
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
                  label="Property Key"
                  required
                  error={errors.propertyKey}
                >
                  <Input
                    {...register("propertyKey")}
                    placeholder="Enter Property Key"
                    size="form"
                    variant="form"
                    disabled={isLoading || readonly}
                  />
                </Form.Field>
              </Form.Col>

              <Form.Col lg={2} md={6} span={12}>
                <Form.Field
                  label="Property Name"
                  required
                  error={errors.propertyName}
                >
                  <Input
                    {...register("propertyName")}
                    placeholder="Enter Property Name"
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
                  />
                </Form.Field>
              </Form.Col>
            </Form.Row>

            <Form.Row className="mt-4">
              <Form.Col lg={4} md={6} span={12}>
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

              <Form.Col lg={1} md={6} span={12}>
                <Flex align="center" gap={2} className="mt-9 h-full">
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
                  <Label htmlFor="isRequired" className="text-xs font-medium">
                    Required
                  </Label>
                </Flex>
              </Form.Col>

              <Form.Col lg={1} md={6} span={12}>
                <Flex align="center" gap={2} className="mt-9 h-full">
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
                  <Label htmlFor="isActive" className="text-xs font-medium">
                    Active
                  </Label>
                </Flex>
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
