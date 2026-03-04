import React from "react";
import {
  type Control,
  type FieldErrors,
  type FieldError,
  type UseFormRegister,
} from "react-hook-form";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { TitleHeader } from "@/components/ui/title-header/TitleHeader";
import { DatePicker } from "@/components/ui/date-picker";
import type {
  AdditionalOptionalFormData,
  MoreDetailsConfig,
} from "@/types/customer/additional.types";

interface MoreDetailsSectionProps {
  control: Control<AdditionalOptionalFormData>;
  errors: FieldErrors<AdditionalOptionalFormData>;
  register: UseFormRegister<AdditionalOptionalFormData>;
  moreDetailsConfig: MoreDetailsConfig[];
  isLoading: boolean;
  readOnly: boolean;
  watch?: (name: string) => unknown;
  setValue?: (name: string, value: unknown) => void;
}

export const MoreDetailsSection: React.FC<MoreDetailsSectionProps> = ({
  errors,
  register,
  moreDetailsConfig,
  isLoading,
  readOnly,
  watch,
  setValue,
}) => {
  const renderMoreDetailsField = (field: MoreDetailsConfig) => {
    const fieldKey = `moreDetails.${field.identity}` as const;
    if (field.valueType === "DATE") {
      return (
        <DatePicker
          key={field.identity}
          value={watch?.(fieldKey) as string | undefined}
          onChange={(value: string) => setValue?.(fieldKey, value)}
          placeholder="dd/mm/yyyy"
          allowManualEntry={true}
          disabled={isLoading || readOnly}
          variant="form"
          size="form"
        />
      );
    } else if (field.valueType === "NUMBER") {
      return (
        <Input
          key={field.identity}
          {...register(fieldKey)}
          placeholder="Enter value"
          size="form"
          variant="form"
          disabled={isLoading || readOnly}
          restriction="numeric"
          className="w-full"
        />
      );
    } else {
      return (
        <Input
          key={field.identity}
          {...register(fieldKey)}
          placeholder="Enter value"
          size="form"
          variant="form"
          disabled={isLoading || readOnly}
          className="w-full"
        />
      );
    }
  };

  const getMoreDetailsError = (identity: string): FieldError | undefined => {
    const moreDetailsErrors = errors.moreDetails as
      | Record<string, FieldError>
      | undefined;
    return moreDetailsErrors?.[identity];
  };

  const activeFields = moreDetailsConfig?.filter(field => field.isActive) || [];

  if (activeFields.length === 0) {
    return null;
  }

  return (
    <div className="mt-8">
      <TitleHeader title="More Details" />

      <div className="mt-4 w-1/2">
        <div className="overflow-hidden  rounded-lg border-1 border-cyan-300 shadow-sm">
          <div className="rounded-lg border-1 border-t-0 border-cyan-300 bg-cyan-900">
            <div className="grid grid-cols-2 gap-0">
              <div className="border-r border-cyan-300 px-4 py-3">
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
            {activeFields.map((field: MoreDetailsConfig, index: number) => (
              <div
                key={field.identity}
                className={`grid grid-cols-2 gap-0 ${
                  index !== activeFields.length - 1
                    ? "border-b border-gray-100"
                    : ""
                }`}
              >
                <div className="bg-gray-25 border-r border-cyan-300 px-4 py-3">
                  <div className="flex items-center">
                    <span className="text-sm text-gray-700">
                      {field.customerRefName}
                    </span>
                    {field.isMandatory && (
                      <span className="text-status-error ml-1">*</span>
                    )}
                  </div>
                </div>

                <div className="px-4 py-3">
                  <div className="flex flex-col">
                    {renderMoreDetailsField(field)}
                    {getMoreDetailsError(field.identity) && (
                      <Form.Error error={getMoreDetailsError(field.identity)} />
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
