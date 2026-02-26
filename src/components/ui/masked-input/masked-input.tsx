import * as React from "react";
import { useState, useRef, useCallback } from "react";
import { cn } from "@/utils";
import { Eye, EyeOff } from "lucide-react";
import {
  maskedInputSizeClasses,
  maskedInputWidthClasses,
  maskedInputVariantClasses,
} from "./variants";
type InputRestriction =
  | "numeric"
  | "alphabetic"
  | "alphanumeric"
  | "no-spaces"
  | "uppercase"
  | "lowercase"
  | "email"
  | "custom";
type MaskedInputProps = Omit<
  React.ComponentProps<"input">,
  "size" | "onChange"
> & {
  size?: keyof typeof maskedInputSizeClasses;
  width?: keyof typeof maskedInputWidthClasses;
  variant?: keyof typeof maskedInputVariantClasses;
  value: string;
  onChange: (value: string) => void;
  onTrigger?: () => void;
  maskDelay?: number;
  showToggle?: boolean;
  onFocus?: () => void;
  onBlur?: () => void;
  maxLength?: number;
  disableCopyPaste?: boolean;
  restriction?: InputRestriction;
  customPattern?: RegExp;
  allowedChars?: string;
  onRestrictedInput?: (value: string, restrictedChars: string) => void;
};

function MaskedInput({
  className,
  type = "text",
  size = "xs",
  width = "full",
  variant = "default",
  value,
  onChange,
  onTrigger,
  maskDelay = 1000,
  placeholder,
  disabled,
  showToggle = false,
  onFocus,
  onBlur,
  maxLength,
  onRestrictedInput,
  disableCopyPaste = false,
  restriction,
  customPattern,
  allowedChars,
  ...props
}: MaskedInputProps) {
  const [displayValue, setDisplayValue] = useState("");
  const [actualValue, setActualValue] = useState(value || "");
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [isRevealed, setIsRevealed] = useState(false);
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

  const filterFunction = getFilterFunction();

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const rawInputValue = e.target.value;

      // If revealed, work with the input value directly
      if (isRevealed) {
        let inputValue = rawInputValue;

        // Apply restriction filter if enabled
        if (restriction) {
          const originalValue = inputValue;
          const filteredValue = filterFunction(originalValue);

          // Check if any characters were filtered out
          if (originalValue !== filteredValue && onRestrictedInput) {
            const restrictedChars = originalValue
              .split("")
              .filter(char => !filteredValue.includes(char))
              .join("");
            onRestrictedInput(filteredValue, restrictedChars);
          }

          inputValue = filteredValue;
        }

        // ---- HARD STOP at maxLength ----
        if (maxLength && inputValue.length > maxLength) {
          return;
        }

        setActualValue(inputValue);
        const valueLength = inputValue.length;
        const maskedChars = Math.max(0, valueLength - 4);
        const visibleChars = Math.min(4, valueLength);
        setDisplayValue(
          "X".repeat(maskedChars) + inputValue.slice(-visibleChars)
        );

        onChange(inputValue);
        onTrigger?.();
        return;
      }

      // Masked typing - work with actualValue, not displayValue
      const currentLength = actualValue.length;
      const displayLength = rawInputValue.length;

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      if (displayLength > currentLength) {
        // User added character(s)
        // Extract the new character from the raw input
        // Since display shows XXX1234, we need to get what was actually typed
        const newChar = rawInputValue[rawInputValue.length - 1];

        // Apply restriction filter to the new character
        let filteredChar = newChar;
        if (restriction) {
          filteredChar = filterFunction(newChar);

          // If character was filtered out, notify and don't add it
          if (newChar !== filteredChar && onRestrictedInput) {
            onRestrictedInput(actualValue, newChar);
            return; // Don't add the filtered character
          }
        }

        const newActualValue = actualValue + filteredChar;

        // ---- HARD STOP at maxLength ----
        if (maxLength && newActualValue.length > maxLength) {
          return;
        }

        const newLength = newActualValue.length;
        const visibleChars = Math.min(4, newLength);
        const maskedChars = Math.max(0, newLength - 4);
        const tempDisplay =
          "X".repeat(maskedChars) + newActualValue.slice(-visibleChars);

        setDisplayValue(tempDisplay);
        setActualValue(newActualValue);

        timeoutRef.current = setTimeout(() => {
          const finalMaskedChars = Math.max(0, newLength - 4);
          const finalVisibleChars = Math.min(4, newLength);
          setDisplayValue(
            "X".repeat(finalMaskedChars) +
              newActualValue.slice(-finalVisibleChars)
          );
        }, maskDelay);

        onChange(newActualValue);
        onTrigger?.();
      } else if (displayLength < currentLength) {
        // User deleted character(s)
        const charsDeleted = currentLength - displayLength;
        const newActualValue = actualValue.slice(0, -charsDeleted);
        const newLength = newActualValue.length;
        const maskedChars = Math.max(0, newLength - 4);
        const visibleChars = Math.min(4, newLength);
        const newDisplayValue =
          "X".repeat(maskedChars) + newActualValue.slice(-visibleChars);

        setActualValue(newActualValue);
        setDisplayValue(newDisplayValue);
        onChange(newActualValue);
        onTrigger?.();
      }
    },
    [
      actualValue,
      isRevealed,
      onChange,
      onTrigger,
      maskDelay,
      maxLength,
      onRestrictedInput,
      restriction,
      filterFunction,
    ]
  );

  React.useEffect(() => {
    if (value !== actualValue) {
      setActualValue(value || "");
      const valueLength = value?.length || 0;
      const maskedChars = Math.max(0, valueLength - 4);
      const visibleChars = Math.min(4, valueLength);
      setDisplayValue(
        "X".repeat(maskedChars) + (value || "").slice(-visibleChars)
      );
    }
  }, [value, actualValue]);

  React.useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);
  const handleCopyPaste = useCallback(
    (e: React.ClipboardEvent<HTMLInputElement>) => {
      if (disableCopyPaste) {
        e.preventDefault();
      }
    },
    [disableCopyPaste]
  );
  return (
    <div className="relative">
      <input
        type={type}
        data-slot="masked-input"
        value={isRevealed ? actualValue : displayValue}
        onChange={handleInputChange}
        onCopy={handleCopyPaste}
        onPaste={handleCopyPaste}
        onCut={handleCopyPaste}
        onFocus={onFocus}
        onBlur={onBlur}
        placeholder={placeholder}
        disabled={disabled}
        autoComplete="off"
        maxLength={maxLength}
        className={cn(
          maskedInputVariantClasses[variant],
          maskedInputSizeClasses[size],
          maskedInputWidthClasses[width],
          "placeholder:text-cyan-300",
          className,
          showToggle ? "pr-8" : ""
        )}
        {...props}
      />
      {showToggle && (
        <button
          type="button"
          aria-label={isRevealed ? "Hide" : "Show"}
          onClick={() => setIsRevealed(prev => !prev)}
          disabled={disabled}
          className="text-muted-foreground hover:text-foreground absolute top-[-0px] right-1 flex h-full w-7 items-center justify-center rounded-sm disabled:opacity-50"
          tabIndex={-1}
        >
          {isRevealed ? (
            <EyeOff className="h-3 w-3" />
          ) : (
            <Eye className="h-3 w-3" />
          )}
        </button>
      )}
    </div>
  );
}

export { MaskedInput };
