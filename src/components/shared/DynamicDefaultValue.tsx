import React from "react";
import {
  Controller,
  type UseFormSetValue,
  type Control,
  type FieldValues,
  type Path,
  type PathValue,
} from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { DatePicker } from "../ui";

interface DynamicDefaultValueProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  dataType: string;
  dataTypeOptions: Array<{ value: string; label: string; identity?: string }>;
  isLoading?: boolean;
  readonly?: boolean;
  setValue: UseFormSetValue<T>;
  error?: { message?: string };
  trigger?: (
    name?: Path<T> | Path<T>[] | readonly Path<T>[] | undefined,
    options?:
      | Partial<{
          shouldFocus: boolean;
        }>
      | undefined
  ) => Promise<boolean>;
}

const booleanOptions = [
  { value: "true", label: "True" },
  { value: "false", label: "False" },
];

export const DynamicDefaultValue = <T extends FieldValues>({
  control,
  trigger,
  name,
  dataType,
  dataTypeOptions,
  isLoading,
  readonly,
  setValue,
}: DynamicDefaultValueProps<T>) => {
  const getDataTypeName = (identity: string): string => {
    const option = dataTypeOptions.find(
      opt => opt.identity === identity || opt.value === identity
    );
    return option?.label?.toUpperCase() || "";
  };

  const dataTypeName = getDataTypeName(dataType);

  React.useEffect(() => {
    if (dataType) {
      setValue(name, "" as PathValue<T, Path<T>>);
    }
  }, [dataType, setValue, name]);
  switch (dataTypeName) {
    case "BOOLEAN":
      return (
        <Controller
          name={name}
          control={control}
          render={({ field }) => (
            <Select
              value={field.value}
              onValueChange={field.onChange}
              disabled={isLoading || readonly}
              placeholder="Select True/False"
              size="form"
              variant="form"
              fullWidth={true}
              itemVariant="form"
              options={booleanOptions}
            />
          )}
        />
      );

    case "DATE":
      return (
        <Controller
          name={name}
          control={control}
          render={({ field }) => (
            <DatePicker
              value={field.value}
              onChange={(value: string) => {
                field.onChange(value);
                trigger?.(name);
              }}
              onBlur={() => field.onBlur()}
              placeholder="dd/mm/yyyy"
              allowManualEntry={true}
              size="form"
              variant="form"
              disabled={isLoading || readonly}
              disableFutureDates={false}
            />
          )}
        />
      );

    case "INTEGER":
      return (
        <Controller
          name={name}
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              type="text"
              placeholder="Enter Integer (e.g., 10)"
              size="form"
              variant="form"
              disabled={isLoading || readonly}
              onChange={e => {
                const value = e.target.value;
                if (value === "" || /^-?\d+$/.test(value)) {
                  field.onChange(e);
                }
              }}
            />
          )}
        />
      );

    case "NUMBER":
    case "DECIMAL":
      return (
        <Controller
          name={name}
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              type="text"
              placeholder={`Enter ${dataTypeName === "NUMBER" ? "Number" : "Decimal"} (e.g., 10.5)`}
              size="form"
              variant="form"
              disabled={isLoading || readonly}
              onChange={e => {
                const value = e.target.value;
                if (value === "" || /^-?\d*\.?\d*$/.test(value)) {
                  field.onChange(e);
                }
              }}
            />
          )}
        />
      );

    case "STRING":
    default:
      return (
        <Controller
          name={name}
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              type="text"
              placeholder="Enter Default Value"
              size="form"
              variant="form"
              disabled={isLoading || readonly}
            />
          )}
        />
      );
  }
};
