import * as React from "react";
import { format, parse, isValid } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { logger } from "@/global/service";
import {
  datePickerSizeClasses,
  datePickerVariantClasses,
  datePickerWidthClasses,
} from "./variant";

interface DatePickerProps {
  size?: keyof typeof datePickerSizeClasses;
  width?: keyof typeof datePickerWidthClasses;
  variant?: keyof typeof datePickerVariantClasses;
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  allowManualEntry?: boolean;
  disableFutureDates?: boolean;
  min?: string;
  max?: string;
  onBlur?: () => void;
}

export function DatePicker({
  size = "md",
  width = "full",
  variant = "default",
  value,
  onChange,
  placeholder = "dd/mm/yyyy",
  disabled = false,
  className,
  allowManualEntry = true,
  disableFutureDates = true,
  min,
  max,
  onBlur,
}: DatePickerProps) {
  const [date, setDate] = React.useState<Date | undefined>(() => {
    if (value) {
      try {
        const parsedDate = new Date(value);
        return isValid(parsedDate) ? parsedDate : undefined;
      } catch {
        return undefined;
      }
    }
    return undefined;
  });

  const [inputValue, setInputValue] = React.useState<string>("");
  const [isOpen, setIsOpen] = React.useState(false);

  React.useEffect(() => {
    if (date) {
      setInputValue(format(date, "dd/MM/yyyy"));
    } else {
      setInputValue("");
    }
  }, [date]);

  React.useEffect(() => {
    if (value) {
      try {
        const parsedDate = new Date(value);
        if (isValid(parsedDate)) {
          setDate(parsedDate);
        }
      } catch (error) {
        logger.error(error);
      }
    } else {
      setDate(undefined);
    }
  }, [value]);

  const handleSelect = (selectedDate: Date | undefined) => {
    setDate(selectedDate);
    // Convert to YYYY-MM-DD for backend
    const backendFormat = selectedDate
      ? format(selectedDate, "yyyy-MM-dd")
      : "";
    onChange?.(backendFormat);
    onBlur?.();
    setIsOpen(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputVal = e.target.value;

    const digitsOnly = inputVal.replace(/\D/g, "");

    if (digitsOnly.length > 8) return;

    const restrictedDigits = digitsOnly;

    if (digitsOnly.length >= 2) {
      const day = parseInt(digitsOnly.slice(0, 2), 10);
      if (day > 31) return;
    }

    if (digitsOnly.length >= 4) {
      const month = parseInt(digitsOnly.slice(2, 4), 10);
      if (month > 12) return;
    }

    if (restrictedDigits.length >= 4) {
      const day = parseInt(restrictedDigits.slice(0, 2), 10);
      const month = parseInt(restrictedDigits.slice(2, 4), 10);

      const tempDate = new Date(2024, month - 1, day);

      const isValidRealDate =
        tempDate.getMonth() === month - 1 && tempDate.getDate() === day;

      if (!isValidRealDate) {
        return;
      }
    }

    let formatted = restrictedDigits;

    if (restrictedDigits.length > 2) {
      formatted = `${restrictedDigits.slice(0, 2)}/${restrictedDigits.slice(2)}`;
    }
    if (restrictedDigits.length > 4) {
      formatted = `${restrictedDigits.slice(0, 2)}/${restrictedDigits.slice(
        2,
        4
      )}/${restrictedDigits.slice(4)}`;
    }

    setInputValue(formatted);

    if (formatted.length === 10) {
      const parsed = parse(formatted, "dd/MM/yyyy", new Date());
      if (isValid(parsed)) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const parsedMidnight = new Date(parsed);
        parsedMidnight.setHours(0, 0, 0, 0);

        let finalDate = parsed;

        if (disableFutureDates && parsedMidnight > today) {
          finalDate = today;
        }

        if (min) {
          const minDate = new Date(min);
          minDate.setHours(0, 0, 0, 0);
          if (parsedMidnight < minDate) {
            finalDate = minDate;
          }
        }

        if (max) {
          const maxDate = new Date(max);
          maxDate.setHours(0, 0, 0, 0);
          if (parsedMidnight > maxDate) {
            finalDate = maxDate;
          }
        }

        setDate(finalDate);
        onChange?.(format(finalDate, "yyyy-MM-dd"));
      }
    }
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Allow only numbers and forward slashes
    const allowedKeys = [
      "Backspace",
      "Delete",
      "Tab",
      "Enter",
      "ArrowLeft",
      "ArrowRight",
      "ArrowUp",
      "ArrowDown",
    ];
    const char = e.key;

    if (!allowedKeys.includes(char) && !/[0-9/]/.test(char)) {
      e.preventDefault();
    }
  };

  const handleInputPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedText = e.clipboardData.getData("text");
    const cleanText = pastedText.replace(/[^0-9/]/g, "");
    if (cleanText) {
      setInputValue(cleanText);
    }
  };

  if (allowManualEntry) {
    return (
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <div className="relative w-full">
          <Input
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleInputKeyDown}
            onPaste={handleInputPaste}
            placeholder={placeholder}
            disabled={disabled}
            size="xs"
            className={cn(
              datePickerVariantClasses[variant],
              datePickerSizeClasses[size],
              datePickerWidthClasses[width],
              "bg-white placeholder:text-cyan-300",
              className
            )}
            onBlur={onBlur}
          />
          <PopoverTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute  right-0 h-7 w-7 hover:bg-transparent"
              disabled={disabled}
            >
              <CalendarIcon className="text-muted-foreground  h-3 w-3" />
            </Button>
          </PopoverTrigger>
        </div>
        <PopoverContent
          align="end"
          className="mt-2 w-[--radix-popover-trigger-available-width] p-0 "
        >
          <Calendar
            mode="single"
            selected={date && isValid(date) ? date : undefined}
            onSelect={handleSelect}
            captionLayout="dropdown"
            className="border "
            disabled={date => {
              const today = new Date();
              today.setHours(0, 0, 0, 0);

              if (disableFutureDates && date > today) {
                return true;
              }

              if (min) {
                const minDate = new Date(min);
                minDate.setHours(0, 0, 0, 0);
                if (date < minDate) {
                  return true;
                }
              }

              if (max) {
                const maxDate = new Date(max);
                maxDate.setHours(0, 0, 0, 0);
                if (date > maxDate) {
                  return true;
                }
              }

              return false;
            }}
            toYear={2050}
          />
        </PopoverContent>
      </Popover>
    );
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={cn(
            "absolute top-[-0px] h-8 w-full justify-start text-left font-normal",
            !date && "text-muted-foreground",
            className
          )}
          disabled={disabled}
        >
          <CalendarIcon className="mr-2 h-3 w-3" />
          {date ? format(date, "dd/MM/yyyy") : placeholder}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        className="w-[--radix-popover-trigger-width] p-0"
      >
        <Calendar
          mode="single"
          selected={date && isValid(date) ? date : undefined}
          onSelect={handleSelect}
          captionLayout="dropdown"
          className="rounded-sm border shadow-sm"
          toYear={2100}
          disabled={date => {
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            if (disableFutureDates && date > today) {
              return true;
            }

            if (min) {
              const minDate = new Date(min);
              minDate.setHours(0, 0, 0, 0);
              if (date < minDate) {
                return true;
              }
            }

            if (max) {
              const maxDate = new Date(max);
              maxDate.setHours(0, 0, 0, 0);
              if (date > maxDate) {
                return true;
              }
            }

            return false;
          }}
        />
      </PopoverContent>
    </Popover>
  );
}
