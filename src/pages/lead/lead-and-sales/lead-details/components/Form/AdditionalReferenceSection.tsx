import React from "react";
import {
  type Control,
  type FieldErrors,
  type FieldError,
  type UseFormRegister,
  Controller,
} from "react-hook-form";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { TitleHeader } from "@/components/ui/title-header/TitleHeader";
import type {
  LeadDetailsFormData,
  AdditionalReferenceConfig,
} from "@/types/lead/lead-details.types";
import { Loader2 } from "lucide-react";
import { Select } from "@/components";

interface AdditionalReferenceSectionProps {
  control: Control<LeadDetailsFormData>;
  errors: FieldErrors<LeadDetailsFormData>;
  register: UseFormRegister<LeadDetailsFormData>;
  additionalReferenceConfig: AdditionalReferenceConfig[];
  isLoading: boolean;
  readonly: boolean;
  isLoadingConfig?: boolean;
}

export const AdditionalReferenceSection: React.FC<
  AdditionalReferenceSectionProps
> = ({
  errors,
  control,
  // register,
  additionalReferenceConfig,
  isLoading,
  readonly,
  isLoadingConfig = false,
}) => {
  const renderAdditionalReferenceField = (field: AdditionalReferenceConfig) => {
    const fieldKey = `additionalReferences.${field.identity}` as const;
    const dataType = field.dataType.toUpperCase();

    if (dataType === "BOOLEAN") {
      const booleanOptions = [
        { label: "Yes", value: "true" },
        { label: "No", value: "false" },
      ];
      return (
        <Controller
          key={field.identity}
          name={fieldKey}
          control={control}
          render={({ field: controllerField }) => (
            <Select
              value={controllerField.value ?? ""}
              onValueChange={controllerField.onChange}
              size="form"
              variant="form"
              disabled={isLoading || readonly}
              placeholder="Select"
              fullWidth={true}
              itemVariant="form"
              options={booleanOptions}
            />
          )}
        />
      );
    }

    return (
      <Controller
        key={field.identity}
        name={fieldKey}
        control={control}
        render={({ field: controllerField }) => {
          const inputProps = {
            value: controllerField.value ?? "",
            onChange: controllerField.onChange,
            onBlur: controllerField.onBlur,
            size: "form" as const,
            variant: "form" as const,
            disabled: isLoading || readonly,
            placeholder: field.placeholderText || "Enter value",
            title: field.helpText || undefined,
          };

          if (dataType === "DATE") {
            return <Input {...inputProps} type="date" />;
          } else if (dataType === "NUMBER") {
            return (
              <Input
                {...inputProps}
                restriction="numeric"
                maxLength={field.maxLength || undefined}
              />
            );
          } else if (dataType === "EMAIL") {
            return (
              <Input
                {...inputProps}
                type="email"
                maxLength={field.maxLength || undefined}
              />
            );
          } else if (dataType === "PHONE" || dataType === "MOBILE") {
            return (
              <Input
                {...inputProps}
                restriction="numeric"
                maxLength={field.maxLength || 10}
              />
            );
          } else {
            return (
              <Input
                {...inputProps}
                type="text"
                maxLength={field.maxLength || undefined}
              />
            );
          }
        }}
      />
    );
  };

  const getAdditionalReferenceError = (
    identity: string
  ): FieldError | undefined => {
    const additionalReferencesErrors = errors.additionalReferences as
      | Record<string, FieldError>
      | undefined;
    return additionalReferencesErrors?.[identity];
  };

  const activeFields =
    additionalReferenceConfig?.filter(field => field.isActive) || [];

  return (
    <div className="mt-8">
      <TitleHeader title="Additional Reference" />

      <div className="mt-4 w-1/2">
        <div className="overflow-hidden rounded-lg border border-gray-200 shadow-sm">
          <div className="border-b border-gray-200 bg-gray-50">
            <div className="grid grid-cols-2 gap-0">
              <div className="border-r border-gray-200 px-4 py-3">
                <h4 className="text-sm font-semibold text-gray-900">
                  Reference Name
                </h4>
              </div>
              <div className="px-4 py-3">
                <h4 className="text-sm font-semibold text-gray-900">
                  Reference Value
                </h4>
              </div>
            </div>
          </div>

          <div className="bg-white">
            {isLoadingConfig ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
                <span className="ml-2 text-sm text-gray-500">
                  Loading additional fields...
                </span>
              </div>
            ) : activeFields.length === 0 ? (
              <div className="py-8 text-center">
                <p className="text-sm text-gray-500">
                  No additional reference fields available for the selected
                  product/service
                </p>
              </div>
            ) : (
              activeFields.map(
                (field: AdditionalReferenceConfig, index: number) => (
                  <div
                    key={field.identity}
                    className={`grid grid-cols-2 gap-0 ${
                      index !== activeFields.length - 1
                        ? "border-b border-gray-100"
                        : ""
                    }`}
                  >
                    <div className="bg-gray-25 border-r border-gray-100 px-4 py-3">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center">
                          <span className="text-sm text-gray-700">
                            {field.referenceFieldName}
                          </span>
                          {field.isMandatory && (
                            <span className="ml-1 text-red-500">*</span>
                          )}
                        </div>
                        {field.helpText && (
                          <span className="text-xs text-gray-500">
                            {field.helpText}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="px-4 py-3">
                      <div className="flex flex-col">
                        {renderAdditionalReferenceField(field)}
                        {getAdditionalReferenceError(field.identity) && (
                          <Form.Error
                            error={getAdditionalReferenceError(field.identity)}
                          />
                        )}
                      </div>
                    </div>
                  </div>
                )
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
