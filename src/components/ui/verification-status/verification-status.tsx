import { BadgeCheck, BadgeX } from "lucide-react";
import type { FC } from "react";

interface VerificationStatusProps {
  verified?: boolean | null;
  labelVerified?: string;
  labelDenied?: string;
}

const VerificationStatus: FC<VerificationStatusProps> = ({
  verified,
  labelVerified = "Verified!",
  labelDenied = "Denied!",
}) => {
  if (verified === null) return null;

  const config = verified
    ? {
        Icon: BadgeCheck,
        label: labelVerified,
        fill: "#4b7efe",
        textColor: "text-success-blue",
      }
    : {
        Icon: BadgeX,
        label: labelDenied,
        fill: "#ef4444",
        textColor: "text-error-red",
      };

  const { Icon, label, fill, textColor } = config;

  return (
    <div className="flex items-center gap-1">
      <Icon
        className="h-4 w-4"
        fill={fill}
        stroke="#ffffff"
        strokeWidth={2}
        aria-hidden
      />
      <span className={`text-[10px] font-semibold ${textColor}`}>{label}</span>
    </div>
  );
};

export default VerificationStatus;
