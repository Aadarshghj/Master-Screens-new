import * as React from "react";
import { CircleArrowLeft, CircleX } from "lucide-react";
import { cn } from "@/utils";
import {
  modalOverlayVariants,
  modalCloseButtonVariants,
  modalFooterVariants,
} from "./variants";

export interface ModalProps {
  children: React.ReactNode;
  isOpen: boolean;
  close?: () => void;
  title?: string;
  modalFooter?: React.ReactNode;
  isOutSideClosable?: boolean;
  isClosable?: boolean;
  width?: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "5xl";
  zIndex?: "base" | "modal" | "top";
  className?: string;
  titleVariant?: "default" | "large" | "small" | "compact";
  titleAs?: "div" | "p" | "span" | "h3" | "h4" | "h5" | "h6";
  maxHeight?: string;
  compact?: boolean;
  padding?: string;
  background?: "default" | "light" | "dark";
  closeButtonVariant?: "default" | "custom";
  closeButtonClassName?: string;
  closeIconClassName?: string;
  header?: boolean;
  emptyScreen?: boolean;
  backButton?: boolean;
  onBack?: () => void;
  headerAlignEnd?: boolean;
  overflow?: string;
}

export function Modal({
  children,
  isOpen,
  close,
  title,
  modalFooter,
  isOutSideClosable = true,
  isClosable = true,
  width = "lg",
  zIndex = "modal",
  className,
  titleVariant = "default",
  titleAs = "h3",
  maxHeight = "85vh",
  compact = false,
  closeButtonVariant = "default",
  closeButtonClassName,
  closeIconClassName,
  padding,
  header = false,
  emptyScreen = false,
  backButton = false,
  onBack,
  headerAlignEnd = false,
  overflow,
}: ModalProps) {
  if (!isOpen) return null;

  const titleVariantClasses = {
    default: compact
      ? "text-base font-semibold"
      : "text-lg font-semibold flex w-full justify-center",
    large: compact ? "text-lg font-bold" : "text-xl font-bold",
    small: compact ? "text-sm font-medium" : "text-base font-medium",
    compact: "text-sm font-medium",
  };

  const TitleComponent = titleAs;

  const widthClasses = {
    sm: "max-w-md",
    md: "max-w-lg",
    lg: "max-w-2xl",
    xl: "max-w-4xl",
    "2xl": "max-w-6xl",
    "3xl": "max-w-7xl",
    "4xl": "max-w-[90rem]",
    "5xl": "max-w-[100rem]",
  };

  const defaultCloseButtonClass = cn(
    modalCloseButtonVariants(),

    "flex-shrink-0"
  );

  const getCloseButtonClass = () => {
    if (closeButtonVariant === "custom" && closeButtonClassName) {
      return closeButtonClassName;
    }

    return defaultCloseButtonClass;
  };

  const getCloseIconClass = () => {
    if (closeButtonVariant === "custom" && closeIconClassName) {
      return closeIconClassName;
    }

    return compact ? "h-6 w-6 text-destructive" : "h-5 w-5 text-destructive";
  };

  return (
    <div
      className={cn(
        modalOverlayVariants({ zIndex }),
        "fixed inset-0 flex items-center justify-center p-4"
      )}
      onClick={isOutSideClosable ? close : undefined}
    >
      <div
        className={cn(
          "bg-card relative rounded-lg shadow-xl",
          widthClasses[width],
          !header ? (padding ? padding : compact ? "p-10" : "p-5") : "",
          className
        )}
        style={{ maxHeight }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header section with title and close button */}
        {(title || isClosable) && (
          <div
            className={cn(
              `flex items-start ${!headerAlignEnd ? "justify-between" : "justify-end"} `,
              !emptyScreen ? (compact ? "mb-3" : "mb-4") : "",
              header ? `${padding ?? "px-5 py-3"}  border-b shadow-md ` : ""
            )}
          >
            {title && (
              <TitleComponent
                className={cn(
                  "kyc-form-title",
                  titleVariantClasses[titleVariant],
                  isClosable ? "pr-8" : ""
                )}
              >
                {title}
              </TitleComponent>
            )}
            {backButton && (
              <button
                onClick={onBack}
                className={
                  "inline-flex items-center justify-center text-black/80 hover:text-black/70"
                }
              >
                <CircleArrowLeft className="cursor-pointer" />
              </button>
            )}
            {isClosable && (
              <button
                onClick={close}
                className={cn(
                  getCloseButtonClass(),
                  closeButtonVariant === "custom" &&
                    "inline-flex items-center justify-center"
                )}
              >
                <CircleX className={`${getCloseIconClass()} cursor-pointer`} />
              </button>
            )}
          </div>
        )}

        <div
          className={cn(
            overflow ?? "overflow-auto",
            !emptyScreen
              ? compact
                ? "max-h-[calc(85vh-120px)]"
                : "max-h-[calc(85vh-140px)]"
              : ""
          )}
        >
          {children}
        </div>

        {/* Footer section */}
        {modalFooter && (
          <div
            className={cn(
              modalFooterVariants(),
              compact ? "mt-3 pt-3" : "mt-4 pt-4"
            )}
          >
            {modalFooter}
          </div>
        )}
      </div>
    </div>
  );
}
