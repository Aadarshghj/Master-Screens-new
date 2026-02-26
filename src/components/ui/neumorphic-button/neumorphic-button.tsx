import type { FC, ReactNode } from "react";
import { neumorphicButtonVariants } from "./varients";
import { cn } from "@/utils";

interface ButtonProps {
  children: ReactNode;
  variant?:
    | "default"
    | "primary"
    | "secondary"
    | "lite"
    | "success"
    | "error"
    | "outline"
    | "grey"
    | "none";
  className?: string;
  size?:
    | "default"
    | "primary"
    | "secondary"
    | "lite"
    | "success"
    | "error"
    | "outline"
    | "none";
  disabled?: boolean;
  onClick?: React.MouseEventHandler<HTMLButtonElement> | undefined;
  type?: "submit" | "reset" | "button" | undefined;
  fullWidth?: boolean;
}
const NeumorphicButton: FC<ButtonProps> = ({
  children,
  variant = "default",
  size = "default",
  className,
  onClick,
  disabled = false,
  type = "button",
  fullWidth = false,
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`group relative cursor-pointer transition-all duration-300 ${fullWidth && "w-full"}`}
      disabled={disabled}
    >
      <div
        className={cn(
          neumorphicButtonVariants({ variant, size, className }),
          disabled &&
            "!group-active:shadow-none cursor-not-allowed opacity-50 !shadow-none",
          fullWidth && "w-full"
        )}
      >
        {children}
      </div>
    </button>
  );
};

export default NeumorphicButton;
