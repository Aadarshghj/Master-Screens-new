import { X, Info, CircleCheck } from "lucide-react";
import type { ConfirmationModalType } from "./formDialog.types";

export const getDefaultIcon = (type: ConfirmationModalType) => {
  switch (type) {
    case "info":
      return <Info size={12} />;
    case "success":
      return <CircleCheck size={12} />;
    case "error":
    case "warning":
    case "completion":
      return <X size={12} />;
    default:
      return <X size={12} />;
  }
};
