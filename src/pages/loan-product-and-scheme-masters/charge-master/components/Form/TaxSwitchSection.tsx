import React from "react";
import { Switch } from "@/components/ui/switch";
import { TaxConfigurationForm } from "./TaxConfigurationForm";

interface TaxSwitchSectionProps {
  id: string;
  label: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  disabled?: boolean;
  taxType?: "single" | "cgst" | "sgst" | "igst" | "cess" | "taxInclusive";
  showForm?: boolean;
  disabledReason?: string;
  helperText?: string;
}

export const TaxSwitchSection: React.FC<TaxSwitchSectionProps> = ({
  id,
  label,
  checked,
  onCheckedChange,
  disabled = false,
  taxType,
  showForm = false,
  disabledReason,
  helperText,
}) => {
  return (
    <div
      className={`
        rounded-lg border-2 p-4 transition-all
        ${
          disabled
            ? "border-gray-200 bg-gray-50 opacity-60"
            : "border-cyan-100 bg-cyan-50"
        }
      `}
    >
      <div className="mb-2 flex items-center gap-3">
        <Switch
          id={id}
          checked={checked}
          onCheckedChange={onCheckedChange}
          disabled={disabled}
        />
        <label
          htmlFor={id}
          className={`text-sm font-medium ${
            disabled ? "cursor-not-allowed text-gray-400" : "cursor-pointer"
          }`}
        >
          {label}
        </label>
      </div>

      {helperText && !disabled && (
        <p className="text-xs text-gray-500">{helperText}</p>
      )}

      {disabled && disabledReason && (
        <p className="text-xs text-gray-400">{disabledReason}</p>
      )}

      {showForm && checked && taxType && !disabled && (
        <div className="mt-4">
          <TaxConfigurationForm taxType={taxType} />
        </div>
      )}
    </div>
  );
};
