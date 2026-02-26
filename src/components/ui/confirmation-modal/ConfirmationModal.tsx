import React from "react";
import { X, Info, CheckCircle } from "lucide-react";
import { Flex } from "../flex";

export type ConfirmationModalType =
  | "warning"
  | "info"
  | "success"
  | "error"
  | "completion";
export type ConfirmationModalSize =
  | "compact"
  | "standard"
  | "large"
  | "completion";

interface ConfirmationModalProps {
  isOpen: boolean;
  onConfirm?: () => void;
  onCancel?: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: ConfirmationModalType;
  size?: ConfirmationModalSize;
  icon?: React.ReactNode;
  confirmButtonColor?: string;
  confirmButtonHoverColor?: string;
  customContent?: React.ReactNode;
}

const getTypeStyles = (type: ConfirmationModalType) => {
  switch (type) {
    case "warning":
      return {
        headerColor: "bg-orange-400",
        iconBg: "bg-yellow-100",
        iconColor: "text-orange-500",
        confirmButton:
          "bg-orange-400 inner-shadow-md group-active:shadow-[0_.1em_.2em_0_inset_rgba(0,0,0,0.4)] disabled:cursor-not-allowed disabled:bg-orange-400/60",
      };
    case "info":
      return {
        headerColor: "bg-blue-400",
        iconBg: "bg-blue-100",
        iconColor: "text-blue-500",
        confirmButton:
          "bg-blue-400 inner-shadow-md group-active:shadow-[0_.1em_.2em_0_inset_rgba(0,0,0,0.4)] disabled:cursor-not-allowed disabled:bg-blue-400/60",
      };
    case "success":
      return {
        headerColor: "bg-green-400",
        iconBg: "bg-green-100",
        iconColor: "text-green-500",
        confirmButton:
          "bg-green-400 inner-shadow-md group-active:shadow-[0_.1em_.2em_0_inset_rgba(0,0,0,0.4)] disabled:cursor-not-allowed disabled:bg-green-400/60",
      };
    case "error":
      return {
        headerColor: "bg-red-900",
        iconBg: "bg-red-100",
        iconColor: "text-red-500",
        confirmButton:
          "bg-red-900 inner-shadow-md group-active:shadow-[0_.1em_.2em_0_inset_rgba(0,0,0,0.4)] disabled:cursor-not-allowed disabled:bg-red-900/60",
      };
    case "completion":
      return {
        headerColor: "bg-teal-400",
        iconBg: "bg-teal-100",
        iconColor: "text-teal-500",
        confirmButton:
          "bg-teal-400 inner-shadow-md group-active:shadow-[0_.1em_.2em_0_inset_rgba(0,0,0,0.4)] disabled:cursor-not-allowed disabled:bg-teal-400/60",
      };
    default:
      return {
        headerColor: "bg-orange-400",
        iconBg: "bg-yellow-100",
        iconColor: "text-orange-500",
        confirmButton:
          "bg-orange-400 inner-shadow-md group-active:shadow-[0_.1em_.2em_0_inset_rgba(0,0,0,0.4)] disabled:cursor-not-allowed disabled:bg-orange-400/60",
      };
  }
};

const getSizeStyles = (size: ConfirmationModalSize) => {
  switch (size) {
    case "compact":
      return {
        container: "max-w-md rounded-md",
        padding: "p-4",
        gap: "gap-3",
        iconSize: "h-8 w-8",
        iconInnerSize: "h-4 w-4",
        titleSize: "text-md font-semibold",
        messageSize: "text-sm leading-relaxed",
        buttonSize: "px-4 py-2 text-sm",
        buttonGap: "gap-2",
      };
    case "standard":
      return {
        container: "max-w-xl w-62 h-50 rounded-xl",
        padding: "p-6",
        gap: "gap-4",
        iconSize: "h-10 w-10",
        iconInnerSize: "h-5 w-5",
        titleSize: "text-lg font-bold",
        messageSize: "text-base leading-relaxed font-semibold",
        buttonSize: "px-5 py-2.5 text-sm",
        buttonGap: "gap-3",
      };
    case "large":
      return {
        container: "max-w-lg rounded-lg",
        padding: "p-8",
        gap: "gap-6",
        iconSize: "h-12 w-12",
        iconInnerSize: "h-6 w-6",
        titleSize: "text-2xl font-semibold",
        messageSize: "text-lg leading-relaxed",
        buttonSize: "px-6 py-3 text-base",
        buttonGap: "gap-4",
      };
    case "completion":
      return {
        container:
          "w-[600px] h-[535px] sm:w-[600px] sm:h-[535px] md:w-[600px] md:h-[535px] lg:w-[600px] lg:h-[535px] xl:w-[600px] xl:h-[535px] max-w-[95vw] max-h-[95vh] mx-4 my-4 rounded-xl",
        padding: "p-4 sm:p-6 md:p-8",
        gap: "gap-4 sm:gap-5 md:gap-6",
        iconSize: "h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8",
        iconInnerSize: "h-3 w-3 sm:h-3.5 sm:w-3.5 md:h-4 md:w-4",
        titleSize: "text-lg font-semibold sm:text-xl",
        messageSize: "text-xs leading-relaxed sm:text-sm",
        buttonSize:
          "px-4 py-2 text-xs sm:px-5 sm:py-2.5 sm:text-sm md:px-6 md:py-3",
        buttonGap: "gap-2 sm:gap-3 md:gap-4",
      };
    default:
      return {
        container: "max-w-md",
        padding: "p-6",
        gap: "gap-4",
        iconSize: "h-10 w-10",
        iconInnerSize: "h-5 w-5",
        titleSize: "text-xl font-semibold",
        messageSize: "text-base leading-relaxed",
        buttonSize: "px-5 py-2.5 text-sm",
        buttonGap: "gap-3",
      };
  }
};

const getDefaultIcon = (type: ConfirmationModalType) => {
  switch (type) {
    case "warning":
      return (
        <svg
          width="32"
          height="32"
          viewBox="0 0 28 27"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="flex-shrink-0"
        >
          <rect width="28" height="27" rx="10" className="fill-warning-bg" />
          <path
            d="M15.7962 11.7031L12.2041 15.2952M12.2041 11.7031L15.7962 15.2952"
            className="stroke-warning"
            strokeWidth="1.07762"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M12.6311 8.49417C12.9791 8.1976 13.1532 8.04932 13.3351 7.96236C13.7559 7.76124 14.245 7.76124 14.6658 7.96236C14.8478 8.04932 15.0218 8.1976 15.3698 8.49417C15.728 8.79949 16.0921 8.95357 16.5711 8.9918C17.0269 9.02817 17.2548 9.04636 17.4449 9.11351C17.8847 9.26884 18.2306 9.61474 18.3859 10.0545C18.4531 10.2446 18.4713 10.4725 18.5076 10.9283C18.5459 11.4073 18.7 11.7714 19.0053 12.1297C19.3018 12.4777 19.4501 12.6517 19.5371 12.8336C19.7382 13.2544 19.7382 13.7436 19.5371 14.1644C19.4501 14.3463 19.3018 14.5203 19.0053 14.8683C18.6936 15.234 18.5451 15.6005 18.5076 16.0697C18.4713 16.5255 18.4531 16.7534 18.3859 16.9435C18.2306 17.3832 17.8847 17.7291 17.4449 17.8845C17.2548 17.9516 17.0269 17.9698 16.5711 18.0062C16.0921 18.0444 15.728 18.1985 15.3698 18.5038C15.0218 18.8004 14.8478 18.9487 14.6658 19.0356C14.245 19.2367 13.7559 19.2367 13.3351 19.0356C13.1532 18.9487 12.9791 18.8004 12.6311 18.5038C12.2654 18.1921 11.899 18.0436 11.4298 18.0062C10.974 17.9698 10.7461 17.9516 10.556 17.8845C10.1162 17.7291 9.7703 17.3832 9.61498 16.9435C9.54782 16.7534 9.52964 16.5255 9.49326 16.0697C9.45504 15.5906 9.30046 15.2266 8.99564 14.8683C8.69907 14.5203 8.55078 14.3463 8.46383 14.1644C8.26271 13.7436 8.26271 13.2544 8.46383 12.8336C8.55078 12.6517 8.69907 12.4777 8.99564 12.1297C9.30733 11.7639 9.45582 11.3975 9.49326 10.9283C9.52964 10.4725 9.54782 10.2446 9.61498 10.0545C9.7703 9.61474 10.1162 9.26884 10.556 9.11351C10.7461 9.04636 10.974 9.02817 11.4298 8.9918C11.9088 8.95357 12.2729 8.79949 12.6311 8.49417Z"
            className="stroke-warning"
            strokeWidth="1.07762"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    case "info":
      return <Info className="h-6 w-6" />;
    case "success":
      return <CheckCircle className="h-6 w-6" />;
    case "error":
      return (
        <svg
          width="24"
          height="24"
          viewBox="0 0 28 27"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="flex-shrink-0"
        >
          <rect width="28" height="27" rx="10" className="fill-error-bg" />
          <path
            d="M15.7962 11.7031L12.2041 15.2952M12.2041 11.7031L15.7962 15.2952"
            className="stroke-error"
            strokeWidth="1.07762"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M12.6307 8.49417C12.9787 8.1976 13.1527 8.04932 13.3346 7.96236C13.7554 7.76124 14.2446 7.76124 14.6653 7.96236C14.8473 8.04932 15.0213 8.1976 15.3693 8.49417C15.7275 8.79949 16.0916 8.95357 16.5707 8.9918C17.0264 9.02817 17.2543 9.04636 17.4445 9.11351C17.8842 9.26884 18.2301 9.61474 18.3854 10.0545C18.4526 10.2446 18.4708 10.4725 18.5071 10.9283C18.5454 11.4073 18.6995 11.7714 19.0048 12.1297C19.3013 12.4777 19.4496 12.6517 19.5366 12.8336C19.7377 13.2544 19.7377 13.7436 19.5366 14.1644C19.4496 14.3463 19.3013 14.5203 19.0048 14.8683C18.6931 15.234 18.5446 15.6005 18.5071 16.0697C18.4708 16.5255 18.4526 16.7534 18.3854 16.9435C18.2301 17.3832 17.8842 17.7291 17.4445 17.8845C17.2543 17.9516 17.0264 17.9698 16.5707 18.0062C16.0916 18.0444 15.7275 18.1985 15.3693 18.5038C15.0213 18.8004 14.8473 18.9487 14.6653 19.0356C14.2446 19.2367 13.7554 19.2367 13.3346 19.0356C13.1527 18.9487 12.9787 18.8004 12.6307 18.5038C12.2649 18.1921 11.8985 18.0436 11.4293 18.0062C10.9735 17.9698 10.7456 17.9516 10.5555 17.8845C10.1157 17.7291 9.76982 17.3832 9.61449 16.9435C9.54733 16.7534 9.52915 16.5255 9.49278 16.0697C9.45455 15.5906 9.30046 15.2266 8.99515 14.8683C8.69858 14.5203 8.5503 14.3463 8.46334 14.1644C8.26222 13.7436 8.26222 13.2544 8.46334 12.8336C8.5503 12.6517 8.69858 12.4777 8.99515 12.1297C9.30684 11.7639 9.45533 11.3975 9.49278 10.9283C9.52915 10.4725 9.54733 10.2446 9.61449 10.0545C9.76982 9.61474 10.1157 9.26884 10.5555 9.11351C10.7456 9.04636 10.9735 9.02817 11.4293 8.9918C11.9083 8.95357 12.2724 8.79949 12.6307 8.49417Z"
            className="stroke-error"
            strokeWidth="1.07762"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    case "completion":
      return (
        <svg
          width="24"
          height="24"
          viewBox="0 0 28 27"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="flex-shrink-0"
        >
          <rect width="28" height="27" rx="10" className="fill-success-bg" />
          <path
            d="M8.5 14L12 17.5L19.5 10"
            className="stroke-success"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    default:
      return <X className="h-6 w-6" />;
  }
};

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onConfirm,
  onCancel,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  type = "warning",
  size = "standard",
  icon,
  confirmButtonColor,
  confirmButtonHoverColor,
  customContent,
}) => {
  if (!isOpen) return null;

  const typeStyles = getTypeStyles(type);
  const sizeStyles = getSizeStyles(size);
  const defaultIcon = getDefaultIcon(type);
  const displayIcon = icon || defaultIcon;

  // Handle completion variant with custom content
  if (type === "completion" && customContent) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20">
        <div
          className={`${sizeStyles.container} rounded-lg border border-gray-200 bg-white shadow-xl`}
        >
          {/* Header bar */}
          <div className={`h-2 rounded-t-lg ${typeStyles.headerColor}`}></div>

          {/* Custom content */}
          <div className={sizeStyles.padding}>{customContent}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 ">
      <div
        className={`w-full ${sizeStyles.container} overflow-hidden bg-white shadow-xl`}
      >
        <div className={`h-2  ${typeStyles.headerColor}`}></div>

        {/* Content */}
        <div
          className={`flex flex-col ${sizeStyles.gap} ${sizeStyles.padding}`}
        >
          {/* Header with icon and title */}
          <div className="flex items-start gap-4">
            <div className="flex-1">
              <Flex align="center" className="mb-2">
                {type === "warning" || type === "error" ? (
                  <div className="flex flex-shrink-0 items-center justify-center">
                    {displayIcon}
                  </div>
                ) : (
                  <div
                    className={`flex ${sizeStyles.iconSize} flex-shrink-0 items-center justify-center rounded-full ${typeStyles.iconBg}`}
                  >
                    <div
                      className={`${typeStyles.iconColor} ${sizeStyles.iconInnerSize} flex items-center justify-center`}
                    >
                      {displayIcon}
                    </div>
                  </div>
                )}
                <h3 className={` ${sizeStyles.titleSize} text-slate-900`}>
                  {title}
                </h3>
              </Flex>
              <p
                className={`${sizeStyles.messageSize} font-medium text-cyan-400`}
              >
                {message}
              </p>
            </div>
          </div>

          {/* Action buttons */}
          <div className={`flex justify-end ${sizeStyles.buttonGap}`}>
            {onCancel && (
              <button
                onClick={onCancel}
                className="group relative cursor-pointer transition-all duration-300"
              >
                <div
                  className={`cursor-pointer rounded-full border border-gray-300 bg-white ${sizeStyles.buttonSize} inner-shadow-md font-medium text-slate-900 transition-colors group-active:shadow-[0_.1em_.2em_0_inset_rgba(0,0,0,0.4)] disabled:cursor-not-allowed disabled:bg-slate-900/60`}
                >
                  {cancelText}
                </div>
              </button>
            )}
            {onConfirm && (
              <button
                onClick={onConfirm}
                className="group relative cursor-pointer transition-all duration-300"
              >
                <div
                  className={`cursor-pointer rounded-full ${sizeStyles.buttonSize} font-medium text-white transition-colors ${
                    confirmButtonColor
                      ? `bg-[${confirmButtonColor}] hover:bg-[${confirmButtonHoverColor || confirmButtonColor}]`
                      : typeStyles.confirmButton
                  }`}
                >
                  {confirmText}
                </div>
                {/* {confirmText} */}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
