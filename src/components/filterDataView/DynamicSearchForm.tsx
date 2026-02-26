import { useForm, get, Controller } from "react-hook-form";
import type { FieldValues, DefaultValues, FieldError } from "react-hook-form";
import { RefreshCw, Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Form } from "@/components/ui/form";
import { Flex } from "@/components/ui/flex";
import { DatePicker, Select } from "../ui";
import NeumorphicButton from "../ui/neumorphic-button/neumorphic-button";

export interface FieldProps<T extends FieldValues> {
  name: keyof T;
  label: string;
  placeholder: string;
  type?: "text" | "email" | "number";
  fieldType: "input" | "select" | "date";
  options?: { label: string; value: string }[];
  restriction?: "numeric" | "alphabetic" | "alphanumeric";
  maxLength?: number;
  colSpan?: {
    lg?: number;
    md?: number;
    span?: number;
  };
}

export interface ActionButton {
  type: "submit" | "reset" | "both";
  submitIcon?: "search" | "filter" | "none";
  submitText?: string;
  resetText?: string;
  showResetIcon?: boolean;
}

interface DynamicSearchFormProps<T extends FieldValues> {
  fields: FieldProps<T>[];
  readonly?: boolean;
  onSubmit: (data: T) => void;
  onReset: () => void;
  isLoading?: boolean;
  defaultValues: DefaultValues<T>;
  submitButtonText?: string;
  resetButtonText?: string;
  theme?: "normal" | "primary" | "error" | "success";
  actionButtons?: ActionButton;
  inlineAlignment?: boolean;
}

export function DynamicSearchForm<T extends FieldValues>({
  fields,
  readonly = false,
  onSubmit,
  onReset,
  isLoading = false,
  defaultValues,
  submitButtonText = "Search",
  resetButtonText = "Reset",
  theme = "normal",
  actionButtons = {
    type: "both",
    submitIcon: "search",
    submitText: submitButtonText,
    resetText: resetButtonText,
    showResetIcon: true,
  },
  inlineAlignment = false,
}: DynamicSearchFormProps<T>) {
  const {
    register,
    handleSubmit,
    reset,
    trigger,
    control,
    formState: { errors },
  } = useForm<T>({ defaultValues });

  const handleReset = () => {
    reset();
    onReset();
  };

  const themeClasses = {
    normal: "bg-white",
    primary: "bg-blue-50",
    error: "bg-red-50",
    success: "bg-green-50",
  };
  const containerClass = themeClasses[theme] || themeClasses.normal;

  const getSubmitIcon = () => {
    if (actionButtons.submitIcon === "filter") {
      return <Filter className="mr-1 h-3 w-3" />;
    } else if (actionButtons.submitIcon === "search") {
      return <Search className="mr-1 h-3 w-3" />;
    }
    return null;
  };

  const renderField = (field: FieldProps<T>) => {
    if (readonly) {
      return (
        <Input
          type={field.type ?? "text"}
          value={
            (defaultValues[field.name as keyof DefaultValues<T>] as
              | string
              | number
              | undefined) ?? ""
          }
          size="form"
          variant="form"
          readOnly
        />
      );
    }

    switch (field.fieldType) {
      case "input":
        return (
          <>
            <Input
              type={field.type ?? "text"}
              {...register(field.name as import("react-hook-form").Path<T>)}
              placeholder={field.placeholder}
              size="form"
              variant="form"
              disabled={isLoading}
              restriction={field.restriction}
              maxLength={field.maxLength}
            />
          </>
        );

      case "select":
        return (
          <>
            <Controller
              name={field.name as import("react-hook-form").Path<T>}
              control={control}
              render={({ field: controllerField }) => (
                <Select
                  value={controllerField.value}
                  onValueChange={controllerField.onChange}
                  placeholder={field.placeholder}
                  fullWidth={true}
                  options={field.options || []}
                  size="form"
                  variant="form"
                  itemVariant="form"
                  disabled={isLoading}
                />
              )}
            />
          </>
        );

      case "date":
        return (
          <>
            <Controller
              name={field.name as import("react-hook-form").Path<T>}
              control={control}
              render={({ field }) => (
                <DatePicker
                  value={field.value}
                  onChange={(value: string) => {
                    field.onChange(value);
                    trigger?.(field.name as import("react-hook-form").Path<T>);
                  }}
                  onBlur={() => field.onBlur()}
                  placeholder="dd/mm/yyyy"
                  allowManualEntry={true}
                  size="form"
                  variant="form"
                  disabled={isLoading}
                  disableFutureDates={false}
                />
              )}
            />
          </>
        );

      default:
        return null;
    }
  };

  if (readonly) {
    return (
      <div
        className={`${containerClass} ${theme === "normal" ? "" : "rounded-md p-4"} `}
      >
        <Form.Row className="gap-3">
          {fields.map(field => {
            const error = get(errors, field.name as string) as
              | FieldError
              | undefined;
            return (
              <Form.Col
                key={String(field.name)}
                lg={field.colSpan?.lg ?? 3}
                md={field.colSpan?.md ?? 6}
                span={field.colSpan?.span ?? 12}
              >
                <Form.Field label={field.label} error={error}>
                  {renderField(field)}
                </Form.Field>
              </Form.Col>
            );
          })}
        </Form.Row>
      </div>
    );
  }

  return (
    <Form
      onSubmit={handleSubmit(onSubmit)}
      className={`${containerClass} ${theme === "normal" ? "" : "rounded-md p-8 pb-6"} ${inlineAlignment && "flex w-full items-center justify-between"}`}
    >
      <Form.Row className=" mb-3 gap-3">
        {fields.map(field => {
          const error = get(errors, field.name as string) as
            | FieldError
            | undefined;
          return (
            <Form.Col
              key={String(field.name)}
              lg={field.colSpan?.lg ?? 3}
              md={field.colSpan?.md ?? 6}
              span={field.colSpan?.span ?? 12}
            >
              <Form.Field label={field.label} error={error}>
                {renderField(field)}
              </Form.Field>
            </Form.Col>
          );
        })}
      </Form.Row>

      <Form.Row className={`gap-3 ${inlineAlignment && "w-fit"}`}>
        <Form.Col span={12}>
          <Flex justify="end" gap={2}>
            {(actionButtons.type === "both" ||
              actionButtons.type === "reset") && (
              <NeumorphicButton
                type="button"
                variant="outline"
                onClick={handleReset}
                disabled={isLoading}
              >
                {actionButtons.showResetIcon !== false && (
                  <RefreshCw className="mr-2 h-4 w-4" />
                )}
                {actionButtons.resetText || resetButtonText}
              </NeumorphicButton>
            )}

            {(actionButtons.type === "both" ||
              actionButtons.type === "submit") && (
              <NeumorphicButton
                type="submit"
                variant="default"
                disabled={isLoading}
              >
                {actionButtons.submitIcon !== "none" && getSubmitIcon()}
                {isLoading
                  ? "Loading..."
                  : actionButtons.submitText || submitButtonText}
              </NeumorphicButton>
            )}
          </Flex>
        </Form.Col>
      </Form.Row>
    </Form>
  );
}
