import { type LucideIcon } from "lucide-react";
import type { FC } from "react";

interface ButtonProps {
  label: string;
  className?: string;
  icon: LucideIcon;
  iconWidth?: number;
  onClick: React.MouseEventHandler<HTMLButtonElement>;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
}
const CapsuleButton: FC<ButtonProps> = ({
  label,
  className,
  icon: Icon,
  iconWidth,
  onClick,
  disabled = false,
  type = "button",
}) => {
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`group inner-shadow-sm text-foreground disabled:text-foreground relative flex h-[27px] cursor-pointer items-center justify-between overflow-hidden rounded-full bg-white transition hover:text-white disabled:cursor-not-allowed ${className}`}
    >
      <span
        className={`z-10 flex h-full min-w-[30px] items-center justify-center ${disabled ? "bg-blue-300/60" : "bg-blue-300"} `}
      >
        <Icon width={iconWidth ?? 12} className="text-white" />
      </span>
      <span className="z-10 pr-6 pl-3 text-[12px] ">{label}</span>
      <div
        className={`absolute inset-0 h-full w-0  ${disabled ? "bg-blue-300/60" : "bg-blue-300 transition-[width] group-hover:w-full"} `}
      ></div>
    </button>
  );
};

export default CapsuleButton;
