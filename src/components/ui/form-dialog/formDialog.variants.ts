import type {
  ConfirmationModalSize,
  ConfirmationModalSizeStyles,
  ConfirmationModalType,
  ConfirmationModalTypeStyles,
} from "./formDialog.types";
export const TYPE_STYLES: Record<
  ConfirmationModalType,
  ConfirmationModalTypeStyles
> = {
  warning: {
    headerColor: "bg-orange-400",
    iconBg: "bg-yellow-100",
    iconColor: "text-orange-500",
    confirmButton:
      "bg-orange-400 inner-shadow-md group-active:shadow-[0_.1em_.2em_0_inset_rgba(0,0,0,0.4)] disabled:cursor-not-allowed disabled:bg-orange-400/60",
  },
  info: {
    headerColor: "bg-blue-400",
    iconBg: "bg-blue-100",
    iconColor: "text-blue-500",
    confirmButton:
      "bg-blue-400 inner-shadow-md group-active:shadow-[0_.1em_.2em_0_inset_rgba(0,0,0,0.4)] disabled:cursor-not-allowed disabled:bg-blue-400/60",
  },
  success: {
    headerColor: "bg-green-400",
    iconBg: "bg-green-100",
    iconColor: "text-green-500",
    confirmButton:
      "bg-green-400 inner-shadow-md group-active:shadow-[0_.1em_.2em_0_inset_rgba(0,0,0,0.4)] disabled:cursor-not-allowed disabled:bg-green-400/60",
  },
  error: {
    headerColor: "bg-red-900",
    iconBg: "bg-red-100",
    iconColor: "text-red-500",
    confirmButton:
      "bg-red-900 inner-shadow-md group-active:shadow-[0_.1em_.2em_0_inset_rgba(0,0,0,0.4)] disabled:cursor-not-allowed disabled:bg-red-900/60",
  },
  completion: {
    headerColor: "bg-teal-400",
    iconBg: "bg-teal-100",
    iconColor: "text-teal-500",
    confirmButton:
      "bg-teal-400 inner-shadow-md group-active:shadow-[0_.1em_.2em_0_inset_rgba(0,0,0,0.4)] disabled:cursor-not-allowed disabled:bg-teal-400/60",
  },
};
export const SIZE_STYLES: Record<
  ConfirmationModalSize,
  ConfirmationModalSizeStyles
> = {
  compact: {
    container: "max-w-md rounded-lg",
    padding: "p-6",
    gap: "gap-3",
    iconSize: "h-7 w-7",
    iconInnerSize: "h-4 w-4",
    titleSize: "text-md font-semibold",
    messageSize: "text-sm leading-relaxed",
    buttonSize: "px-4 py-2 text-sm",
    buttonGap: "gap-2",
  },
  standard: {
    container: "max-w-xl rounded-xl",
    padding: "p-6",
    gap: "gap-4",
    iconSize: "h-10 w-10",
    iconInnerSize: "h-5 w-5",
    titleSize: "text-lg font-bold",
    messageSize: "text-base font-semibold",
    buttonSize: "px-5 py-2.5 text-sm",
    buttonGap: "gap-3",
  },
  large: {
    container: "max-w-lg rounded-lg",
    padding: "p-8",
    gap: "gap-6",
    iconSize: "h-12 w-12",
    iconInnerSize: "h-6 w-6",
    titleSize: "text-2xl font-semibold",
    messageSize: "text-lg",
    buttonSize: "px-6 py-3 text-base",
    buttonGap: "gap-4",
  },
  completion: {
    container: "w-[600px] h-[535px] max-w-[95vw] max-h-[95vh] rounded-xl",
    padding: "p-4 sm:p-6 md:p-8",
    gap: "gap-4",
    iconSize: "h-8 w-8",
    iconInnerSize: "h-4 w-4",
    titleSize: "text-xl font-semibold",
    messageSize: "text-sm",
    buttonSize: "px-5 py-2.5",
    buttonGap: "gap-3",
  },
};
