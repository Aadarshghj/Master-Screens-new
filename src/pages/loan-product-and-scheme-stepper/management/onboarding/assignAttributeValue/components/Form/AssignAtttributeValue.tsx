import React from "react";
import { Flex } from "@/components/ui/flex";
import { HeaderWrapper } from "@/components/ui/header-wrapper/HeaderWrapper";
import { TitleHeader } from "@/components/ui/title-header/TitleHeader";
import { FormContainer } from "@/components/ui/form-container";
import { Button, Form, Input, Switch, Select } from "@/components";
import { Controller } from "react-hook-form";
import { Save } from "lucide-react";
import type { AssignAttributeValuesProps } from "@/types/loan-product-and schema Stepper";
import { Pagination } from "@/components/ui/paginationUp";
import { useAttributeValue } from "../hooks/useAttributeValue";
import { useAppSelector } from "@/hooks/store";

export const AssignAttributeValues: React.FC<AssignAttributeValuesProps> = ({
  onComplete,
  onSave,
  onUnsavedChanges,
}) => {
  const { approvalStatus } = useAppSelector(state => state.loanProduct);
  const isSentForApproval =
    approvalStatus === "PENDING" || approvalStatus === "APPROVED";

  const {
    control,
    handleSubmit,
    errors,
    tableData,
    touchedFields,
    currentPage,
    setCurrentPage,
    itemsPerPage,
    totalPages,
    startIndex,
    endIndex,
    firstTableData,
    secondTableData,
    getInputType,
    handleAttributeValueChange,
    handleBooleanValueChange,
    handleStatusChange,
    onSubmit,
    hasUnsavedChanges,
    hasBeenSaved,
  } = useAttributeValue();

  const hasCalledCompletionRef = React.useRef(false);

  React.useEffect(() => {
    if (onUnsavedChanges) {
      onUnsavedChanges(hasUnsavedChanges);
    }
  }, [hasUnsavedChanges, onUnsavedChanges]);

  // Only call onComplete when data is saved
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
          <TitleHeader title="Assign attribute values for loan scheme" />
        </HeaderWrapper>
      </Flex>

      <Form onSubmit={handleSubmit(() => onSubmit(onSave, onComplete))}>
        <Form.Row>
          <Form.Col lg={3} md={6} span={12}>
            <Form.Field label="Loan Product" required>
              <Controller
                name="loanProductName"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    placeholder="// Auto fetch from first stepper"
                    size="form"
                    disabled
                  />
                )}
              />
              <Form.Error error={errors.loanProductName} />
            </Form.Field>
          </Form.Col>

          <Form.Col lg={3} md={6} span={12}>
            <Form.Field label="Loan Scheme" required>
              <Controller
                name="loanSchemeName"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    placeholder="// Auto fetch from first stepper"
                    size="form"
                    disabled
                  />
                )}
              />
              <Form.Error error={errors.loanSchemeName} />
            </Form.Field>
          </Form.Col>
        </Form.Row>

        <div className="mt-6 w-full">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <h3 className="mb-4 text-sm font-medium">Attributes (1-15)</h3>
              <div className="overflow-hidden rounded-lg border border-gray-200">
                <table className="min-w-full table-fixed divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="w-1/3 px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                        Attribute Name
                      </th>
                      <th className="w-1/6 px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                        Default Value
                      </th>
                      <th className="w-1/3 px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                        Attribute Value
                      </th>
                      <th className="w-1/6 px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {firstTableData.length > 0 ? (
                      firstTableData.map((item, index) => {
                        const actualIndex = currentPage * itemsPerPage + index;
                        const isEmpty =
                          !item.attributeValue ||
                          item.attributeValue.trim() === "";
                        const hasError =
                          touchedFields.has(actualIndex) &&
                          item.status &&
                          isEmpty;

                        return (
                          <tr key={`first-${item.attributeName}-${index}`}>
                            <td
                              className="truncate px-4 py-2 text-xs"
                              title={item.attributeName}
                            >
                              {item.attributeName}
                            </td>
                            <td className="truncate px-4 py-2 text-xs">
                              {String(item.defaultValue)}
                            </td>
                            <td className="px-4 py-2">
                              {getInputType(item.defaultValue) === "boolean" ? (
                                <Select
                                  value={(
                                    item.attributeValue ||
                                    String(item.defaultValue)
                                  ).toLowerCase()}
                                  onValueChange={value =>
                                    handleBooleanValueChange(
                                      actualIndex,
                                      value === "true"
                                    )
                                  }
                                  size="form"
                                  variant="form"
                                  fullWidth={true}
                                  disabled={!item.status}
                                  options={[
                                    { value: "true", label: "True" },
                                    { value: "false", label: "False" },
                                  ]}
                                  className="h-8 w-full"
                                />
                              ) : item.listValues &&
                                item.listValues.length > 0 ? (
                                <Select
                                  value={
                                    item.attributeValue ||
                                    String(item.defaultValue)
                                  }
                                  onValueChange={value =>
                                    handleAttributeValueChange(
                                      actualIndex,
                                      value
                                    )
                                  }
                                  size="form"
                                  variant="form"
                                  fullWidth={true}
                                  disabled={!item.status}
                                  options={item.listValues.map(val => ({
                                    value: val,
                                    label: val,
                                  }))}
                                  className="h-8 w-full"
                                />
                              ) : (
                                <Input
                                  value={item.attributeValue || ""}
                                  onChange={e =>
                                    handleAttributeValueChange(
                                      actualIndex,
                                      e.target.value
                                    )
                                  }
                                  size="form"
                                  disabled={!item.status}
                                  className={`text-xxs h-8 ${hasError ? "border-red-500" : ""}`}
                                  placeholder={
                                    getInputType(item.defaultValue) === "number"
                                      ? "Enter number"
                                      : "Enter text"
                                  }
                                  type={
                                    getInputType(item.defaultValue) === "number"
                                      ? "number"
                                      : "text"
                                  }
                                />
                              )}
                              {hasError && (
                                <div className="mt-1 text-xs text-red-500">
                                  Value required
                                </div>
                              )}
                            </td>
                            <td className="px-4 py-2">
                              <Switch
                                checked={item.status}
                                onCheckedChange={checked =>
                                  handleStatusChange(actualIndex, checked)
                                }
                              />
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td
                          colSpan={4}
                          className="px-4 py-8 text-center text-gray-500"
                        >
                          No data available
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <div>
              <h3 className="mb-4 text-sm font-medium">Attributes (16-30)</h3>
              <div className="overflow-hidden rounded-lg border border-gray-200">
                <table className="min-w-full table-fixed divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="w-1/3 px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                        Attribute Name
                      </th>
                      <th className="w-1/6 px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                        Default Value
                      </th>
                      <th className="w-1/3 px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                        Attribute Value
                      </th>
                      <th className="w-1/6 px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {secondTableData.length > 0 ? (
                      secondTableData.map((item, index) => {
                        const actualIndex =
                          currentPage * itemsPerPage + index + 15;
                        const isEmpty =
                          !item.attributeValue ||
                          item.attributeValue.trim() === "";
                        const hasError =
                          touchedFields.has(actualIndex) &&
                          item.status &&
                          isEmpty;

                        return (
                          <tr key={`second-${item.attributeName}-${index}`}>
                            <td
                              className="truncate px-4 py-2 text-xs"
                              title={item.attributeName}
                            >
                              {item.attributeName}
                            </td>
                            <td className="truncate px-4 py-2 text-xs">
                              {String(item.defaultValue)}
                            </td>
                            <td className="px-4 py-2">
                              {getInputType(item.defaultValue) === "boolean" ? (
                                <Select
                                  value={(
                                    item.attributeValue ||
                                    String(item.defaultValue)
                                  ).toLowerCase()}
                                  onValueChange={value =>
                                    handleBooleanValueChange(
                                      actualIndex,
                                      value === "true"
                                    )
                                  }
                                  size="form"
                                  variant="form"
                                  fullWidth={true}
                                  disabled={!item.status}
                                  options={[
                                    { value: "true", label: "True" },
                                    { value: "false", label: "False" },
                                  ]}
                                  className="h-8 w-full"
                                />
                              ) : item.listValues &&
                                item.listValues.length > 0 ? (
                                <Select
                                  value={
                                    item.attributeValue ||
                                    String(item.defaultValue)
                                  }
                                  onValueChange={value =>
                                    handleAttributeValueChange(
                                      actualIndex,
                                      value
                                    )
                                  }
                                  size="form"
                                  variant="form"
                                  fullWidth={true}
                                  disabled={!item.status}
                                  options={item.listValues.map(val => ({
                                    value: val,
                                    label: val,
                                  }))}
                                  className="h-8 w-full"
                                />
                              ) : (
                                <Input
                                  value={item.attributeValue || ""}
                                  onChange={e =>
                                    handleAttributeValueChange(
                                      actualIndex,
                                      e.target.value
                                    )
                                  }
                                  size="form"
                                  disabled={!item.status}
                                  className={`text-xxs h-8 ${hasError ? "border-red-500" : ""}`}
                                  placeholder={
                                    getInputType(item.defaultValue) === "number"
                                      ? "Enter number"
                                      : "Enter text"
                                  }
                                  type={
                                    getInputType(item.defaultValue) === "number"
                                      ? "number"
                                      : "text"
                                  }
                                />
                              )}
                              {hasError && (
                                <div className="mt-1 text-xs text-red-500">
                                  Value required
                                </div>
                              )}
                            </td>
                            <td className="px-4 py-2">
                              <Switch
                                checked={item.status}
                                onCheckedChange={checked =>
                                  handleStatusChange(actualIndex, checked)
                                }
                              />
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td
                          colSpan={4}
                          className="px-4 py-8 text-center text-gray-500"
                        >
                          No data available
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {totalPages > 1 && (
            <div className="mt-4 flex items-center justify-between text-sm">
              <div className="text-muted-foreground whitespace-nowrap">
                Showing {startIndex + 1} to{" "}
                {Math.min(endIndex, tableData.length)} of {tableData.length}{" "}
                entries
              </div>
              <div className="flex items-center gap-3">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                  onPreviousPage={() =>
                    setCurrentPage(prev => Math.max(0, prev - 1))
                  }
                  onNextPage={() =>
                    setCurrentPage(prev => Math.min(totalPages - 1, prev + 1))
                  }
                  canPreviousPage={currentPage > 0}
                  canNextPage={currentPage < totalPages - 1}
                  maxVisiblePages={5}
                />
              </div>
            </div>
          )}
        </div>

        <Flex justify="end" className="mt-6">
          <Button
            type="submit"
            variant="primary"
            size="compactWhite"
            className="flex items-center gap-2"
            disabled={isSentForApproval}
          >
            <Save className="h-3 w-3" />
            Save Attribute Value
          </Button>
        </Flex>
      </Form>
    </FormContainer>
  );
};
