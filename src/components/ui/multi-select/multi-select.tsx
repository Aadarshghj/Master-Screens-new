import * as React from "react";
import { X, ChevronDown } from "lucide-react";
import { cn } from "@/utils/index";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";

interface MultiSelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface MultiSelectProps {
  value?: string[];
  onValueChange?: (value: string[]) => void;
  disabled?: boolean;
  placeholder?: string;
  size?: "sm" | "default" | "compact" | "form";
  variant?: "default" | "outline" | "form";
  fullWidth?: boolean;
  options: MultiSelectOption[];
  loading?: boolean;
  loadingText?: string;
  className?: string;
  maxDisplay?: number;
}

export function MultiSelect({
  value = [],
  onValueChange,
  disabled,
  placeholder = "Select options...",
  size = "default",
  variant = "default",
  fullWidth = false,
  options = [],
  loading = false,
  loadingText = "Loading...",
  className,
  maxDisplay = 2,
}: MultiSelectProps) {
  const [open, setOpen] = React.useState(false);

  const handleSelect = (optionValue: string) => {
    const newValue = value.includes(optionValue)
      ? value.filter(v => v !== optionValue)
      : [...value, optionValue];
    onValueChange?.(newValue);
  };

  const handleRemove = (optionValue: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const newValue = value.filter(v => v !== optionValue);
    onValueChange?.(newValue);
  };

  const selectedOptions = options.filter(option =>
    value.includes(option.value)
  );
  const displayedOptions = selectedOptions.slice(0, maxDisplay);
  const remainingCount = selectedOptions.length - maxDisplay;

  const triggerClasses = cn(
    "flex w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
    {
      "h-8 px-2 text-xs": size === "sm",
      "h-9 px-2": size === "compact",
      "h-10 px-3": size === "default",
      "h-[29.33px] px-2 text-[11px]": size === "form",
      "w-full": fullWidth,
      "border-input": variant === "default",
      "border-border": variant === "outline",
      "border-[var(--color-cyan-300)] bg-white text-[var(--color-cyan-300)]":
        variant === "form",
    },
    className
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={triggerClasses}
          disabled={disabled}
        >
          <div className="flex flex-1 flex-wrap gap-1 overflow-hidden">
            {loading ? (
              <span className="text-muted-foreground">{loadingText}</span>
            ) : selectedOptions.length === 0 ? (
              <span className="text-muted-foreground">{placeholder}</span>
            ) : (
              <>
                {displayedOptions.map(option => (
                  <Badge
                    key={option.value}
                    variant="secondary"
                    className="mr-1 h-5 px-1 text-xs"
                  >
                    {option.label}
                    <button
                      className="ring-offset-background focus:ring-ring ml-1 rounded-full outline-none focus:ring-2 focus:ring-offset-2"
                      onKeyDown={e => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          e.stopPropagation();
                          const newValue = value.filter(
                            v => v !== option.value
                          );
                          onValueChange?.(newValue);
                        }
                      }}
                      onMouseDown={e => {
                        e.preventDefault();
                        e.stopPropagation();
                      }}
                      onClick={e => handleRemove(option.value, e)}
                    >
                      <X className="text-muted-foreground hover:text-foreground h-3 w-3" />
                    </button>
                  </Badge>
                ))}
                {remainingCount > 0 && (
                  <Badge variant="secondary" className="h-5 px-1 text-xs">
                    +{remainingCount} more
                  </Badge>
                )}
              </>
            )}
          </div>
          <ChevronDown className="h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[290px] p-0" align="start">
        <div className="max-h-60 overflow-auto">
          {loading ? (
            <div className="text-muted-foreground p-2 text-sm">
              {loadingText}
            </div>
          ) : options.length === 0 ? (
            <div className="text-muted-foreground p-2 text-sm">
              No options available
            </div>
          ) : (
            options.map(option => (
              <div
                key={option.value}
                className={cn(
                  "hover:bg-accent hover:text-accent-foreground flex cursor-pointer items-center px-2 py-1.5 text-sm",
                  {
                    "cursor-not-allowed opacity-50": option.disabled,
                  }
                )}
                onClick={() => !option.disabled && handleSelect(option.value)}
              >
                <Checkbox
                  checked={value.includes(option.value)}
                  className="mr-2 h-4 w-4"
                />
                {option.label}
              </div>
            ))
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
