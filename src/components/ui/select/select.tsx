import * as React from "react";
import * as SelectPrimitive from "@radix-ui/react-select";
import { CheckIcon, ChevronDownIcon, ChevronUpIcon } from "lucide-react";
import { cn } from "@/utils/index";
import {
  selectTriggerVariants,
  selectContentVariants,
  selectViewportVariants,
  selectLabelVariants,
  selectItemVariants,
  selectSeparatorVariants,
  selectScrollButtonVariants,
  type SelectTriggerVariants,
  type SelectContentVariants,
  type SelectItemVariants,
} from "./variants";

interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface SelectProps {
  value?: string;
  onValueChange?: (value: string) => void;
  disabled?: boolean;
  placeholder?: string;
  size?: "sm" | "default" | "compact" | "form";
  variant?: "default" | "outline" | "form";
  fullWidth?: boolean;
  contentVariant?: "default" | "minimal";
  itemVariant?: "default" | "compact" | "form";
  options: SelectOption[];
  loading?: boolean;
  loadingText?: string;
  className?: string;
  triggerClassName?: string;
  contentClassName?: string;
  capitalize?: boolean;
  onBlur?: () => void;
}

function Select({
  value,
  onValueChange,
  disabled,
  placeholder,
  size = "default",
  variant = "default",
  fullWidth = false,
  contentVariant = "default",
  itemVariant = "default",
  options = [],
  loading = false,
  loadingText = "Loading...",
  className,
  triggerClassName,
  contentClassName,
  capitalize = false,
  onBlur,
}: SelectProps) {
  return (
    <div className={className}>
      <SelectPrimitive.Root
        value={value}
        onValueChange={onValueChange}
        disabled={disabled}
        data-slot="select"
      >
        <SelectPrimitive.Trigger
          data-slot="select-trigger"
          data-size={size}
          data-variant={variant}
          data-full-width={fullWidth}
          className={cn(
            selectTriggerVariants({ size, variant, fullWidth }),
            "flex items-center gap-2 overflow-hidden ",
            triggerClassName
          )}
          onBlur={() => onBlur?.()}
        >
          <span
            className={cn(
              "min-w-0 flex-1 truncate text-left text-cyan-300",
              capitalize && "capitalize"
            )}
          >
            <SelectPrimitive.Value
              placeholder={loading ? loadingText : placeholder}
            />
          </span>
          <SelectPrimitive.Icon asChild>
            <ChevronDownIcon className="size-4 shrink-0 opacity-50" />
          </SelectPrimitive.Icon>
        </SelectPrimitive.Trigger>

        <SelectPrimitive.Portal>
          <SelectPrimitive.Content
            data-slot="select-content"
            data-variant={contentVariant}
            className={cn(
              selectContentVariants({ variant: contentVariant }),
              contentClassName
            )}
            position="popper"
          >
            <SelectScrollUpButton />
            <SelectPrimitive.Viewport
              className={cn(
                selectViewportVariants({
                  position: "popper",
                })
              )}
            >
              {/* {options?.map(option => ( */}
              {loading ? (
                <SelectPrimitive.Item
                  // key={option.value}
                  // value={option.value}
                  // disabled={option.disabled}
                  key="loading"
                  value="loading"
                  disabled
                  data-slot="select-item"
                  data-variant={itemVariant}
                  className={cn(selectItemVariants({ variant: itemVariant }))}
                >
                  <span className="absolute right-2 flex size-3.5 items-center justify-center">
                    <SelectPrimitive.ItemIndicator>
                      <CheckIcon className="size-4" />
                    </SelectPrimitive.ItemIndicator>
                  </span>
                  <SelectPrimitive.ItemText>
                    {/* {option.label} */}
                    {loadingText}
                  </SelectPrimitive.ItemText>
                </SelectPrimitive.Item>
              ) : options.length === 0 ? (
                <SelectPrimitive.Item
                  key="no-data"
                  value="no-data"
                  disabled
                  data-slot="select-item"
                  data-variant={itemVariant}
                  className={cn(selectItemVariants({ variant: itemVariant }))}
                >
                  <SelectPrimitive.ItemText>
                    No data available
                  </SelectPrimitive.ItemText>
                </SelectPrimitive.Item>
              ) : (
                options.map(option => (
                  <SelectPrimitive.Item
                    key={option.value}
                    value={option.value}
                    disabled={option.disabled}
                    data-slot="select-item"
                    data-variant={itemVariant}
                    className={cn(selectItemVariants({ variant: itemVariant }))}
                  >
                    <span className="absolute right-2 flex size-3.5 items-center justify-center">
                      <SelectPrimitive.ItemIndicator>
                        <CheckIcon className="size-4" />
                      </SelectPrimitive.ItemIndicator>
                    </span>

                    <SelectPrimitive.ItemText>
                      {option.label}
                    </SelectPrimitive.ItemText>
                  </SelectPrimitive.Item>
                ))
              )}
            </SelectPrimitive.Viewport>
            <SelectScrollDownButton />
          </SelectPrimitive.Content>
        </SelectPrimitive.Portal>
      </SelectPrimitive.Root>
    </div>
  );
}

function SelectRoot({
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Root>) {
  return <SelectPrimitive.Root data-slot="select" {...props} />;
}

function SelectGroup({
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Group>) {
  return <SelectPrimitive.Group data-slot="select-group" {...props} />;
}

function SelectValue({
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Value>) {
  return <SelectPrimitive.Value data-slot="select-value" {...props} />;
}

interface SelectTriggerProps
  extends React.ComponentProps<typeof SelectPrimitive.Trigger>,
    SelectTriggerVariants {
  size?: "sm" | "default" | "compact" | "form";
  variant?: "default" | "outline" | "form";
  fullWidth?: boolean;
}

function SelectTrigger({
  className,
  size = "default",
  variant = "default",
  fullWidth = false,
  children,
  ...props
}: SelectTriggerProps) {
  return (
    <SelectPrimitive.Trigger
      data-slot="select-trigger"
      data-size={size}
      data-variant={variant}
      data-full-width={fullWidth}
      className={cn(
        selectTriggerVariants({ size, variant, fullWidth }),
        className
      )}
      {...props}
    >
      {children}
      <SelectPrimitive.Icon asChild>
        <ChevronDownIcon className="size-4 opacity-50" />
      </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
  );
}

interface SelectContentProps
  extends React.ComponentProps<typeof SelectPrimitive.Content>,
    SelectContentVariants {
  variant?: "default" | "minimal";
}

function SelectContent({
  className,
  variant = "default",
  children,
  position = "popper",
  ...props
}: SelectContentProps) {
  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Content
        data-slot="select-content"
        data-variant={variant}
        className={cn(
          selectContentVariants({ variant }),
          position === "popper" &&
            "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
          className
        )}
        position={position}
        {...props}
      >
        <SelectScrollUpButton />
        <SelectPrimitive.Viewport
          className={cn(
            selectViewportVariants({
              position: position === "popper" ? "popper" : "item",
            })
          )}
        >
          {children}
        </SelectPrimitive.Viewport>
        <SelectScrollDownButton />
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  );
}

function SelectLabel({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Label>) {
  return (
    <SelectPrimitive.Label
      data-slot="select-label"
      className={cn(selectLabelVariants(), className)}
      {...props}
    />
  );
}

interface SelectItemProps
  extends React.ComponentProps<typeof SelectPrimitive.Item>,
    SelectItemVariants {
  variant?: "default" | "compact" | "form";
}

function SelectItem({
  className,
  variant = "default",
  children,
  ...props
}: SelectItemProps) {
  return (
    <SelectPrimitive.Item
      data-slot="select-item"
      data-variant={variant}
      className={cn(selectItemVariants({ variant }), className)}
      {...props}
    >
      <span className="absolute right-2 flex size-3.5 items-center justify-center">
        <SelectPrimitive.ItemIndicator>
          <CheckIcon className="size-4" />
        </SelectPrimitive.ItemIndicator>
      </span>
      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
    </SelectPrimitive.Item>
  );
}

function SelectSeparator({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Separator>) {
  return (
    <SelectPrimitive.Separator
      data-slot="select-separator"
      className={cn(selectSeparatorVariants(), className)}
      {...props}
    />
  );
}

function SelectScrollUpButton({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.ScrollUpButton>) {
  return (
    <SelectPrimitive.ScrollUpButton
      data-slot="select-scroll-up-button"
      className={cn(selectScrollButtonVariants(), className)}
      {...props}
    >
      <ChevronUpIcon className="size-4" />
    </SelectPrimitive.ScrollUpButton>
  );
}

function SelectScrollDownButton({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.ScrollDownButton>) {
  return (
    <SelectPrimitive.ScrollDownButton
      data-slot="select-scroll-down-button"
      className={cn(selectScrollButtonVariants(), className)}
      {...props}
    >
      <ChevronDownIcon className="size-4" />
    </SelectPrimitive.ScrollDownButton>
  );
}

export {
  Select,
  SelectRoot,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
  type SelectTriggerProps,
  type SelectContentProps,
  type SelectItemProps,
  type SelectOption,
  type SelectProps,
};
