import * as React from "react";
import * as SwitchPrimitive from "@radix-ui/react-switch";
import { type VariantProps } from "class-variance-authority";
import { cn } from "@/utils/index";
import { switchVariants, switchThumbVariants } from "./variants";

export interface SwitchProps
  extends React.ComponentProps<typeof SwitchPrimitive.Root>,
    VariantProps<typeof switchVariants> {}

function Switch({ className, size = "default", ...props }: SwitchProps) {
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      className={cn(switchVariants({ size }), className)}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className={cn(switchThumbVariants({ size }))}
      />
    </SwitchPrimitive.Root>
  );
}

export { Switch };
