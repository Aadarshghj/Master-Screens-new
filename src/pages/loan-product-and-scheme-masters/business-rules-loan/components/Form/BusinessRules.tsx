import React, { useState } from "react";
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
import type { LoanBusinessRuleFormProps } from "@/types/loan-product-and-scheme-masters/business-rules.types";
import { useBusinessRulesForm } from "../../hooks/useBusinessRulesForm";

export const LoanBusinessRulesForm: React.FC<LoanBusinessRuleFormProps> = ({
  readonly = false,
}) => {
  const [isFormOpen, setIsFormOpen] = useState(false);

  const {
    form,
    isEditMode,
    isLoading,
    loanProductOptions,
    ruleCategoryOptions,
    isLoadingProducts,
    isLoadingCategories,
    onSubmit,
    handleReset,
    handleClear,
  } = useBusinessRulesForm(readonly);

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = form;

  const handleFormSubmit = handleSubmit(async data => {
    const success = await onSubmit(data);
    if (success && !isEditMode) {
      setIsFormOpen(false);
    }
  });

  const handleCancelClick = () => {
    handleReset();
    if (!isEditMode) {
      setIsFormOpen(false);
    }
  };

  const handleClearClick = () => {
    handleClear();
  };

  return (
    <article className="loan-business-rules-form-container">
      <FormContainer>
        <Flex justify="between" align="center" className="mb-6 w-full">
          <HeaderWrapper>
            <TitleHeader title="Business Rules for Loan Processing" />
          </HeaderWrapper>
          {!isEditMode ? (
            <Button
              variant="resetPrimary"
              size="compactWhite"
              onClick={() => setIsFormOpen(!isFormOpen)}
              disabled={isLoading}
            >
              <div className="mr-2 flex h-4 w-4 items-center justify-center rounded-full bg-white">
                <Plus className="text-primary h-3 w-3" />
              </div>
              Add Business Rule
              <ChevronDown
                className={`ml-2 h-4 w-4 transition-transform ${isFormOpen ? "rotate-180" : ""}`}
              />
            </Button>
          ) : (
            <Button
              variant="resetPrimary"
              size="compactWhite"
              onClick={handleCancelClick}
              disabled={isLoading}
            >
              <Plus className="mr-2 h-3 w-3" />
              Add New Rule
            </Button>
          )}
        </Flex>

        {(isFormOpen || isEditMode) && (
          <Form onSubmit={handleFormSubmit}>
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

              <Form.Col lg={2} md={6} span={12}>
                <Form.Field label="Rule Code" required error={errors.ruleCode}>
                  <Input
                    {...register("ruleCode")}
                    placeholder="Enter Rule Code"
                    size="form"
                    variant="form"
                    disabled={isLoading || readonly}
                  />
                </Form.Field>
              </Form.Col>

              <Form.Col lg={2} md={6} span={12}>
                <Form.Field label="Rule Name" required error={errors.ruleName}>
                  <Input
                    {...register("ruleName")}
                    placeholder="Enter Rule Name"
                    size="form"
                    variant="form"
                    disabled={isLoading || readonly}
                  />
                </Form.Field>
              </Form.Col>

              <Form.Col lg={2} md={6} span={12}>
                <Form.Field
                  label="Rule Category"
                  required
                  error={errors.ruleCategory}
                >
                  <Controller
                    name="ruleCategory"
                    control={control}
                    render={({ field }) => (
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                        disabled={isLoading || readonly || isLoadingCategories}
                        placeholder="Select Rule Category"
                        size="form"
                        variant="form"
                        fullWidth={true}
                        itemVariant="form"
                        options={ruleCategoryOptions}
                        loading={isLoadingCategories}
                      />
                    )}
                  />
                </Form.Field>
              </Form.Col>
              <Form.Col lg={4} md={12} span={12}>
                <Form.Field
                  label="Condition Expression"
                  required
                  error={errors.conditionExpression}
                >
                  <Textarea
                    {...register("conditionExpression")}
                    placeholder="Enter Condition Expression"
                    size="form"
                    variant="form"
                    rows={3}
                    disabled={isLoading || readonly}
                  />
                </Form.Field>
              </Form.Col>
            </Form.Row>

            <Form.Row className="mt-4">
              <Form.Col lg={4} md={12} span={12}>
                <Form.Field
                  label="Action Expression"
                  required
                  error={errors.actionExpression}
                >
                  <Textarea
                    {...register("actionExpression")}
                    placeholder="Enter Action Expression"
                    size="form"
                    variant="form"
                    rows={3}
                    disabled={isLoading || readonly}
                  />
                </Form.Field>
              </Form.Col>
              <Form.Col lg={2} md={6} span={12}>
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
                  onClick={handleCancelClick}
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
                  {isLoading
                    ? "Processing..."
                    : isEditMode
                      ? "Update Business Rule"
                      : "Save Business Rule"}
                </Button>
              </Flex.ActionGroup>
            </div>
          </Form>
        )}
      </FormContainer>
    </article>
  );
};
