import React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/utils";
import type { StepperProps } from "@/types";

const stepperVariants = cva("w-full", {
  variants: {
    size: {
      xs: "mb-1",
      sm: "mb-2",
      default: "mb-4",
      md: "mb-6",
      lg: "mb-8",
    },
  },
  defaultVariants: {
    size: "default",
  },
});

const progressBarVariants = cva(
  "flex w-full rounded-full transition-all duration-300 shadow-neumorphic-inset",
  {
    variants: {
      size: {
        xs: "h-1.5 mb-0.5",
        sm: "h-2 mb-0.5",
        default: "h-[10.5px] mb-0.5",
        md: "h-2.5 mb-0.5",
        lg: "h-3 mb-0.5",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
);

const stepLabelVariants = cva("text-center transition-all duration-300 mt-1", {
  variants: {
    size: {
      xs: "text-[9px]",
      sm: "text-[10px]",
      default: "text-[10px]",
      md: "text-xs",
      lg: "text-sm",
    },
    state: {
      active: "text-theme-primary font-semibold",
      completed: "text-reset/80 font-medium",
      inactive: "text-reset/80",
    },
  },
  defaultVariants: {
    size: "default",
    state: "inactive",
  },
});

interface CompactStepperProps
  extends StepperProps,
    VariantProps<typeof stepperVariants> {}

export const Stepper: React.FC<CompactStepperProps> = ({
  steps,
  currentStep,
  onStepChange,
  size = "default",
}) => {
  const currentIndex = steps.findIndex(step => step.key === currentStep);

  const handleStepClick = (stepKey: string) => {
    if (onStepChange) {
      onStepChange(stepKey);
    }
  };

  const getTruncateLength = (size: string | null): number => {
    switch (size) {
      case "xs":
        return 6;
      case "sm":
        return 8;
      case "default":
        return 10;
      case "md":
        return 12;
      case "lg":
        return 14;
      default:
        return 8;
    }
  };

  const truncateLabel = (label: string, maxLength: number) => {
    if (label.length <= maxLength) return label;
    return label.substring(0, maxLength) + "...";
  };

  return (
    <div className={cn(stepperVariants({ size }))}>
      <div className="flex w-full flex-wrap justify-start gap-4 md:gap-7 lg:flex-nowrap  lg:justify-between">
        {steps.map((step, index) => {
          const isActive = index === currentIndex;
          const isCompleted = index < currentIndex;
          const stepState = isActive
            ? "active"
            : isCompleted
              ? "completed"
              : "inactive";

          return (
            <div
              key={step.key}
              className={`flex w-auto flex-col items-center lg:w-full  ${isActive ? "cursor-none" : "cursor-pointer"}`}
              onClick={() => handleStepClick(step.key)}
            >
              <div
                className={cn(
                  progressBarVariants({ size }),
                  isCompleted || isActive ? "bg-blue-300" : "bg-cyan-200"
                )}
              />
              <span
                className={cn(stepLabelVariants({ size, state: stepState }))}
                title={step.label}
              >
                {isActive
                  ? step.label
                  : truncateLabel(step.label, getTruncateLength(size))}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
