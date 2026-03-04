import * as React from "react";
import { cn } from "@/utils";
import {
  inputSizeClasses,
  inputWidthClasses,
  inputVariantClasses,
} from "./variants";

type InputType = "text" | "number" | "letters" | "alphanumeric" | "phone";

type InputRestriction =
  | "numeric"
  | "alphabetic"
  | "alphanumeric"
  | "no-spaces"
  | "uppercase"
  | "lowercase"
  | "email"
  | "custom";

type DateFormat = "dd/mm/yyyy" | "mm/dd/yyyy" | "yyyy-mm-dd";
type TextTransform = "uppercase" | "lowercase" | "capitalize" | "none";

type InputProps = Omit<React.ComponentProps<"input">, "size"> & {
  size?: keyof typeof inputSizeClasses;
  width?: keyof typeof inputWidthClasses;
  variant?: keyof typeof inputVariantClasses;
  inputType?: InputType;
  restriction?: InputRestriction;
  customPattern?: RegExp; // For custom restrictions
  allowedChars?: string; // Alternative to customPattern
  onRestrictedInput?: (value: string, restrictedChars: string) => void;
  dateFormat?: DateFormat;
  autoComplete?: "off" | "on";
  textTransform?: TextTransform;
  maxValue?: number;
  minValue?: number;
  onValueExceeded?: (value: number, limit: "max" | "min") => void;
};

function Input({
  className,
  type,
  size = "md",
  width = "full",
  variant = "default",
  inputType,
  restriction,
  customPattern,
  allowedChars,
  onRestrictedInput,
  dateFormat,
  onChange,
  onKeyDown,
  onKeyPress,
  name,
  autoComplete = "off",
  textTransform = "none",
  maxValue,
  minValue,
  onValueExceeded,
  ...props
}: InputProps) {
  // Generate a unique random name to prevent browser autocomplete
  const [randomName] = React.useState(
    () => name || `input-${Math.random().toString(36).substring(2, 15)}`
  );

  // Legacy inputType handling
  const handleKeyDown = React.useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      // Always allow special keys like backspace, delete, arrow keys, etc.
      const allowedKeys = [
        "Backspace",
        "Delete",
        "ArrowLeft",
        "ArrowRight",
        "ArrowUp",
        "ArrowDown",
        "Home",
        "End",
        "Tab",
        "Enter",
        "Escape",
        "Control",
        "Meta",
        "Alt",
        "Shift",
        "CapsLock",
        "NumLock",
        "ScrollLock",
        "Pause",
        "Insert",
        "PageUp",
        "PageDown",
        "F1",
        "F2",
        "F3",
        "F4",
        "F5",
        "F6",
        "F7",
        "F8",
        "F9",
        "F10",
        "F11",
        "F12",
      ];

      if (allowedKeys.includes(e.key)) {
        onKeyDown?.(e);
        return;
      }

      if (e.key === " ") {
        const value = e.currentTarget.value;
        const pos = e.currentTarget.selectionStart ?? value.length;
        if (value[pos - 1] === " ") {
          e.preventDefault();
          return;
        }
      }

      // Handle different input types (legacy)
      if (inputType === "number") {
        // Allow numbers, decimal point, and minus sign
        if (!/[0-9.-]/.test(e.key)) {
          e.preventDefault();
        }
      } else if (inputType === "letters") {
        // Allow letters, spaces, and common name characters
        if (!/[a-zA-Z\s.'-]/.test(e.key)) {
          e.preventDefault();
        }
      } else if (inputType === "alphanumeric") {
        // Allow letters, numbers, and common characters
        if (!/[a-zA-Z0-9\s._-]/.test(e.key)) {
          e.preventDefault();
        }
      } else if (inputType === "phone") {
        // Allow only numbers for phone
        if (!/[0-9]/.test(e.key)) {
          e.preventDefault();
        }
      }

      onKeyDown?.(e);
    },
    [inputType, onKeyDown]
  );

  // New restriction system
  const getFilterFunction = () => {
    switch (restriction) {
      case "numeric":
        return (value: string) => value.replace(/[^0-9]/g, "");

      case "alphabetic":
        return (value: string) => value.replace(/[^a-zA-Z\s]/g, "");

      case "alphanumeric":
        return (value: string) => value.replace(/[^a-zA-Z0-9\s]/g, "");

      case "no-spaces":
        return (value: string) => value.replace(/\s/g, "");

      case "uppercase":
        return (value: string) =>
          value.toUpperCase().replace(/[^A-Z0-9\s]/g, "");

      case "lowercase":
        return (value: string) =>
          value.toLowerCase().replace(/[^a-z0-9\s]/g, "");

      case "email":
        return (value: string) => value.replace(/[^a-zA-Z0-9@._+-]/g, "");

      case "custom":
        if (customPattern) {
          return (value: string) => value.replace(customPattern, "");
        }

        if (allowedChars) {
          const pattern = new RegExp(
            `[^${allowedChars.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}]`,
            "g"
          );

          return (value: string) => value.replace(pattern, "");
        }

        return (value: string) => value;

      default:
        return (value: string) => value;
    }
  };

  const getKeyPressRestriction = () => {
    switch (restriction) {
      case "numeric":
        return /[0-9]/;

      case "alphabetic":
        return /[a-zA-Z\s]/;

      case "alphanumeric":
        return /[a-zA-Z0-9\s]/;

      case "no-spaces":
        return /[^\s]/;

      case "uppercase":
        return /[A-Z0-9\s]/;

      case "email":
        return /[a-zA-Z0-9@._+-]/;

      case "lowercase":
        return /[a-z0-9\s]/;

      case "custom":
        if (allowedChars) {
          return new RegExp(
            `[${allowedChars.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}]`
          );
        }

        return null;

      default:
        return null;
    }
  };

  const filterFunction = getFilterFunction();
  const keyPressPattern = getKeyPressRestriction();

  // Date formatting functions
  const formatDateInput = (value: string, format: DateFormat): string => {
    if (!value) return "";

    // Remove all non-digit characters
    const digits = value.replace(/\D/g, "");

    if (format === "dd/mm/yyyy") {
      // Format as DD/MM/YYYY
      if (digits.length <= 2) {
        return digits;
      } else if (digits.length <= 4) {
        return `${digits.slice(0, 2)}/${digits.slice(2)}`;
      } else {
        return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4, 8)}`;
      }
    } else if (format === "mm/dd/yyyy") {
      // Format as MM/DD/YYYY
      if (digits.length <= 2) {
        return digits;
      } else if (digits.length <= 4) {
        return `${digits.slice(0, 2)}/${digits.slice(2)}`;
      } else {
        return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4, 8)}`;
      }
    } else if (format === "yyyy-mm-dd") {
      // Format as YYYY-MM-DD
      if (digits.length <= 4) {
        return digits;
      } else if (digits.length <= 6) {
        return `${digits.slice(0, 4)}-${digits.slice(4)}`;
      } else {
        return `${digits.slice(0, 4)}-${digits.slice(4, 6)}-${digits.slice(6, 8)}`;
      }
    }

    return value;
  };

  const parseDateInput = (value: string, format: DateFormat): string => {
    if (!value) return "";

    if (format === "dd/mm/yyyy") {
      // Convert DD/MM/YYYY to YYYY-MM-DD for form submission
      const parts = value.split("/");
      if (parts.length === 3) {
        const day = parts[0].padStart(2, "0");
        const month = parts[1].padStart(2, "0");
        const year = parts[2];
        return `${year}-${month}-${day}`;
      }
    } else if (format === "mm/dd/yyyy") {
      // Convert MM/DD/YYYY to YYYY-MM-DD for form submission
      const parts = value.split("/");
      if (parts.length === 3) {
        const month = parts[0].padStart(2, "0");
        const day = parts[1].padStart(2, "0");
        const year = parts[2];
        return `${year}-${month}-${day}`;
      }
    }

    return value;
  };
  const shouldValidateNumericValue = () => {
    return (
      (maxValue !== undefined || minValue !== undefined) &&
      (type === "number" || inputType === "number" || restriction === "numeric")
    );
  };

  // NEW: Validate and clamp numeric value
  const validateNumericValue = (value: string): string => {
    if (!shouldValidateNumericValue() || value === "" || value === "-") {
      return value;
    }

    const numValue = parseFloat(value);

    if (isNaN(numValue)) {
      return value;
    }

    let clampedValue = numValue;
    let wasExceeded = false;
    let limitType: "max" | "min" | undefined;

    if (maxValue !== undefined && numValue > maxValue) {
      clampedValue = maxValue;
      wasExceeded = true;
      limitType = "max";
    }

    if (minValue !== undefined && numValue < minValue) {
      clampedValue = minValue;
      wasExceeded = true;
      limitType = "min";
    }

    if (wasExceeded && limitType) {
      onValueExceeded?.(numValue, limitType);
    }

    return wasExceeded ? clampedValue.toString() : value;
  };

  const handleChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      // Apply uppercase transformation if textTransform is uppercase
      if (textTransform === "uppercase" && e.target.value) {
        e.target.value = e.target.value.toUpperCase();
      }

      // Date formatting handling
      if (dateFormat) {
        const formattedValue = formatDateInput(e.target.value, dateFormat);
        e.target.value = formattedValue;

        // Create a new event with the parsed value for form submission
        const parsedValue = parseDateInput(formattedValue, dateFormat);
        const syntheticEvent = {
          ...e,
          target: {
            ...e.target,
            value: parsedValue,
          },
        };

        onChange?.(syntheticEvent as React.ChangeEvent<HTMLInputElement>);
        return;
      }

      // Legacy inputType handling
      if (inputType && !restriction) {
        let sanitizedValue = e.target.value;

        // Apply validation based on inputType
        if (inputType === "letters") {
          // Allow only letters, spaces, dots, hyphens, and apostrophes
          sanitizedValue = e.target.value.replace(/[^a-zA-Z\s.'-]/g, "");
        } else if (inputType === "phone") {
          // Allow only numbers
          sanitizedValue = e.target.value.replace(/[^0-9]/g, "");
        } else if (inputType === "alphanumeric") {
          // Allow letters, numbers, and common characters
          sanitizedValue = e.target.value.replace(/[^a-zA-Z0-9\s._-]/g, "");
        } else if (inputType === "number") {
          // Allow numbers, decimal point, and minus sign
          sanitizedValue = e.target.value.replace(/[^0-9.-]/g, "");
          sanitizedValue = validateNumericValue(sanitizedValue);
        }

        // Update the input value with sanitized value
        e.target.value = sanitizedValue;
        onChange?.(e);
        return;
      }

      // New restriction system
      if (restriction) {
        const originalValue = e.target.value;
        let filteredValue = filterFunction(originalValue);
        if (restriction === "numeric") {
          filteredValue = validateNumericValue(filteredValue);
        }
        // Check if any characters were filtered out
        if (originalValue !== filteredValue && onRestrictedInput) {
          const restrictedChars = originalValue.replace(
            new RegExp(`[${filteredValue}]`, "g"),
            ""
          );

          onRestrictedInput(filteredValue, restrictedChars);
        }

        // Update the event target value with filtered value
        e.target.value = filteredValue;
        onChange?.(e);
        return;
      }
      if (type === "number" && shouldValidateNumericValue()) {
        e.target.value = validateNumericValue(e.target.value);
      }
      // No restrictions
      onChange?.(e);
    },
    [
      dateFormat,
      inputType,
      restriction,
      filterFunction,
      onRestrictedInput,
      onChange,
    ]
  );

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Allow control keys (backspace, delete, tab, enter, arrows, etc.)
    const controlKeys = [
      "Backspace",
      "Delete",
      "Tab",
      "Enter",
      "Escape",
      "ArrowLeft",
      "ArrowRight",
      "ArrowUp",
      "ArrowDown",
      "Home",
      "End",
      "PageUp",
      "PageDown",
    ];

    if (controlKeys.includes(e.key) || e.ctrlKey || e.metaKey || e.altKey) {
      if (onKeyPress) onKeyPress(e);
      return;
    }

    // Apply restriction if pattern exists
    if (keyPressPattern && !keyPressPattern.test(e.key)) {
      e.preventDefault();

      if (onRestrictedInput) {
        onRestrictedInput("", e.key);
      }

      return;
    }

    if (onKeyPress) {
      onKeyPress(e);
    }
  };

  // Determine input mode for mobile keyboards
  const getInputMode =
    (): React.HTMLAttributes<HTMLInputElement>["inputMode"] => {
      if (restriction === "numeric") return "numeric";
      if (restriction === "alphabetic") return "text";
      return undefined;
    };

  // Determine pattern for HTML5 validation
  const getPattern = (): string | undefined => {
    if (restriction === "numeric") return "[0-9]*";
    if (restriction === "alphabetic") return "[a-zA-Z\\s]*";
    if (restriction === "alphanumeric") return "[a-zA-Z0-9\\s]*";
    return undefined;
  };

  return (
    <input
      type={type}
      name={randomName}
      data-slot="input"
      className={cn(
        inputVariantClasses[variant],
        inputSizeClasses[size],
        inputWidthClasses[width],
        className
      )}
      onKeyDown={handleKeyDown}
      onChange={handleChange}
      onKeyPress={handleKeyPress}
      inputMode={getInputMode()}
      pattern={getPattern()}
      autoCorrect="off"
      autoCapitalize="off"
      autoComplete={autoComplete}
      spellCheck="false"
      data-form-type="other"
      {...props}
    />
  );
}

export { Input };
export type { InputProps, InputRestriction, DateFormat };
