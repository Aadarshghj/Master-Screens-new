import * as React from "react";
import { cn } from "@/utils";
import { Search } from "lucide-react";
import {
  inputSizeClasses,
  inputWidthClasses,
  inputVariantClasses,
} from "./variant";

export interface DropdownOption {
  value: string;
  label: string;
  [key: string]: unknown;
}
export interface DropdownSelectOption {
  value: string;
  label: string;
  identity?: string;
  [key: string]: unknown;
}
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
type InputWithSearchProps = Omit<React.ComponentProps<"input">, "size"> & {
  size?: keyof typeof inputSizeClasses;
  width?: keyof typeof inputWidthClasses;
  variant?: keyof typeof inputVariantClasses;
  onSearch?: () => void;
  isSearching?: boolean;
  inputType?: InputType;
  numerical?: boolean;
  showDropdown?: boolean;
  dropdownOptions?: DropdownOption[];
  onOptionSelect?: (option: DropdownSelectOption) => void;
  dropdownLoading?: boolean;
  dropdownError?: string;
  dropdownPlaceholder?: string;
  noResultsText?: string;
  restriction?: InputRestriction;
  customPattern?: RegExp;
  allowedChars?: string;
  onRestrictedInput?: (value: string, restrictedChars: string) => void;
  onClose?: () => void;
};

const InputWithSearch = React.forwardRef<
  HTMLInputElement,
  InputWithSearchProps
>(
  (
    {
      className,
      size = "md",
      width = "full",
      variant = "default",
      inputType,
      numerical = false,
      showDropdown = false,
      dropdownOptions = [],
      onOptionSelect,
      dropdownLoading = false,
      dropdownError,
      dropdownPlaceholder = "Search...", // eslint-disable-line @typescript-eslint/no-unused-vars
      noResultsText = "No results found",
      onKeyDown,
      onSearch,
      isSearching = false,
      restriction,
      customPattern,
      allowedChars,
      onRestrictedInput,
      onChange,
      onClose,
      ...props
    },
    ref
  ) => {
    const wrapperRef = React.useRef<HTMLDivElement | null>(null);

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
    const handleKeyDown = React.useCallback(
      (e: React.KeyboardEvent<HTMLInputElement>) => {
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
        if (inputType === "number" || numerical) {
          if (!/[0-9.-]/.test(e.key)) {
            e.preventDefault();
          }
        } else if (inputType === "letters") {
          if (!/[a-zA-Z\s.'-]/.test(e.key)) {
            e.preventDefault();
          }
        } else if (inputType === "alphanumeric") {
          if (!/[a-zA-Z0-9\s._-]/.test(e.key)) {
            e.preventDefault();
          }
        } else if (inputType === "phone") {
          if (!/[0-9]/.test(e.key)) {
            e.preventDefault();
          }
        }

        onKeyDown?.(e);
      },

      [inputType, numerical, onKeyDown]
    );

    // Close dropdown on outside click (pointerdown recommended)
    React.useEffect(() => {
      function handlePointerDown(e: PointerEvent) {
        const target = e.target as Node | null;
        if (
          wrapperRef.current &&
          target &&
          !wrapperRef.current.contains(target)
        ) {
          onClose?.();
        }
      }
      document.addEventListener("pointerdown", handlePointerDown);
      return () =>
        document.removeEventListener("pointerdown", handlePointerDown);
    }, [onClose]);

    // Close dropdown on Escape key
    React.useEffect(() => {
      function handleDocKey(e: KeyboardEvent) {
        if (e.key === "Escape") {
          onClose?.();
        }
      }
      document.addEventListener("keydown", handleDocKey);
      return () => document.removeEventListener("keydown", handleDocKey);
    }, [onClose]);

    const handleOptionClick = React.useCallback(
      (option: DropdownOption) => {
        if (onOptionSelect) {
          onOptionSelect(option);
        }
      },

      [onOptionSelect]
    );

    const memoizedDropdownOptions = React.useMemo(() => {
      return dropdownOptions.map((option, index) => (
        <button
          key={option.value || `option-${index}`}
          type="button"
          className="hover:bg-accent hover:text-accent-foreground flex w-full cursor-pointer items-center px-3 py-2 text-left text-sm disabled:cursor-not-allowed disabled:opacity-50"
          onClick={() => handleOptionClick(option)}
          disabled={Boolean(option.disabled)}
        >
          {option.label}
        </button>
      ));
    }, [dropdownOptions, handleOptionClick]);

    const handleChange = React.useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        // New restriction system
        if (restriction) {
          const originalValue = e.target.value;
          const filteredValue = filterFunction(originalValue);

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

        // No restrictions
        onChange?.(e);
      },
      [inputType, restriction, filterFunction, onRestrictedInput, onChange]
    );
    return (
      <div ref={wrapperRef} className="relative w-full">
        <input
          ref={ref}
          data-slot="input"
          className={cn(
            inputVariantClasses[variant],
            inputSizeClasses[size],
            inputWidthClasses[width],
            "pr-10",
            className
          )}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          {...props}
        />
        <button
          type="button"
          onClick={onSearch}
          disabled={isSearching || props.disabled}
          className={cn(
            "absolute top-0 right-0 flex h-full items-center justify-center rounded-r-sm bg-blue-700 px-3 transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50",
            size === "form" && "w-8"
          )}
          aria-label="Search "
        >
          <Search
            className={cn(
              "text-white",
              size === "form" ? "h-3 w-3" : "h-4 w-4"
            )}
          />
        </button>

        {showDropdown && (
          <div className="bg-popover text-popover-foreground absolute top-full right-0 left-0 z-50 mt-1 max-h-60 overflow-auto rounded-md border shadow-md">
            {dropdownLoading ? (
              <div className="text-muted-foreground p-3 text-center text-sm">
                Searching...
              </div>
            ) : dropdownError ? (
              <div className="text-status-error p-3 text-center text-sm">
                {dropdownError}
              </div>
            ) : dropdownOptions.length === 0 ? (
              <div className="text-muted-foreground p-3 text-center text-sm">
                {noResultsText}
              </div>
            ) : (
              memoizedDropdownOptions
            )}
          </div>
        )}
      </div>
    );
  }
);

InputWithSearch.displayName = "InputWithSearch";

export { InputWithSearch };
export type { InputWithSearchProps };
