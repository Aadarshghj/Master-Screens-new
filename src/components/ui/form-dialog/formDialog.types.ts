import type { ReactNode } from "react";

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

export interface ConfirmationModalProps {
  isOpen: boolean;
  onConfirm?: () => void;
  onCancel?: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: ConfirmationModalType;
  size?: ConfirmationModalSize;
  icon?: ReactNode;
  confirmButtonColor?: string;
  confirmButtonHoverColor?: string;
  customContent?: ReactNode;
  children: ReactNode;
}

export interface ConfirmationModalTypeStyles {
  headerColor: string;
  iconBg: string;
  iconColor: string;
  confirmButton: string;
}
export interface ConfirmationModalSizeStyles {
  container: string;
  padding: string;
  gap: string;
  iconSize: string;
  iconInnerSize: string;
  titleSize: string;
  messageSize: string;
  buttonSize: string;
  buttonGap: string;
}
