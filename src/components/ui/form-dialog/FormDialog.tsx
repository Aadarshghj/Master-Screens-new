import React from "react";
import { Flex } from "../flex";
import { SIZE_STYLES, TYPE_STYLES } from "./formDialog.variants";
import { getDefaultIcon } from "./formDialog.icons";
import type { ConfirmationModalProps } from "./formDialog.types";
import NeumorphicButton from "../neumorphic-button/neumorphic-button";

export const FormDialog: React.FC<ConfirmationModalProps> = ({
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
  children,
}) => {
  if (!isOpen) return null;

  const typeStyles = TYPE_STYLES[type];
  const sizeStyles = SIZE_STYLES[size];
  const displayIcon = icon ?? getDefaultIcon(type);

  if (type === "completion" && customContent) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20">
        <div className={`${sizeStyles.container} border bg-white shadow-xl`}>
          <div className={`h-2 ${typeStyles.headerColor}`} />
          <div className={sizeStyles.padding}>{customContent}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className={`w-full ${sizeStyles.container} bg-white shadow-xl`}>
        <div className={`h-2 rounded-t-md ${typeStyles.headerColor}`} />

        <div
          className={`flex flex-col ${sizeStyles.gap} ${sizeStyles.padding}`}
        >
          <Flex align="center" className="gap-4">
            <div
              className={`flex ${sizeStyles.iconSize} items-center justify-center rounded-lg ${typeStyles.iconBg}`}
            >
              <div className={`${typeStyles.iconColor}`}>{displayIcon}</div>
            </div>

            <div>
              <h3 className={sizeStyles.titleSize}>{title}</h3>
            </div>
          </Flex>
          <p className={sizeStyles.messageSize}>{message}</p>

          {children}

          <div className={`flex justify-end ${sizeStyles.buttonGap}`}>
            {onCancel && (
              <NeumorphicButton
                className="px-3 py-1.5"
                variant="outline"
                onClick={onCancel}
              >
                {cancelText}
              </NeumorphicButton>
            )}
            {onConfirm && (
              <NeumorphicButton
                onClick={onConfirm}
                className={`px-3 py-1.5  ${
                  confirmButtonColor
                    ? `bg-[${confirmButtonColor}] hover:bg-[${confirmButtonHoverColor ?? confirmButtonColor}]`
                    : typeStyles.confirmButton
                }`}
              >
                {confirmText}
              </NeumorphicButton>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
