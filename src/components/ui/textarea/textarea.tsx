import * as React from "react";
import { cn } from "@/utils";
import {
  textareaSizeClasses,
  textareaWidthClasses,
  textareaVariantClasses,
} from "../input/variants";

type TextareaProps = Omit<React.ComponentProps<"textarea">, "size"> & {
  size?: keyof typeof textareaSizeClasses;
  width?: keyof typeof textareaWidthClasses;
  variant?: keyof typeof textareaVariantClasses;
};

function Textarea({
  className,
  size = "md",
  width = "full",
  variant = "default",
  ...props
}: TextareaProps) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        textareaVariantClasses[variant],
        textareaSizeClasses[size],
        textareaWidthClasses[width],
        className
      )}
      autoCorrect="off"
      autoCapitalize="off"
      spellCheck="false"
      data-form-type="other"
      {...props}
    />
  );
}

export { Textarea };
