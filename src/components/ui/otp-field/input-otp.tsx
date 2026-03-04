import * as React from "react";
import { cn } from "@/utils";
import { Input } from "@/components/ui/input";
import {
  inputSizeClasses,
  inputVariantClasses,
} from "@/components/ui/input/variants";

type OTPProps = {
  length?: number;
  value?: string;
  onChange?: (value: string) => void;
  onComplete?: (value: string) => void;
  size?: keyof typeof inputSizeClasses;
  variant?: keyof typeof inputVariantClasses;
  className?: string;
  disabled?: boolean;
  autoFocus?: boolean;
  placeholder?: string;
};

export function OTPInput({
  length = 6,
  value = "",
  onChange,
  onComplete,
  size = "md",
  variant = "default",
  className,
  disabled = false,
  autoFocus = false,
  placeholder = "",
}: OTPProps) {
  const [otp, setOtp] = React.useState<string[]>(Array(length).fill(""));
  const inputRefs = React.useRef<(HTMLInputElement | null)[]>(
    Array(length).fill(null)
  );

  React.useEffect(() => {
    if (value !== undefined) {
      const otpArray = value.split("").slice(0, length);
      const paddedOtp = [
        ...otpArray,
        ...Array(length - otpArray.length).fill(""),
      ];
      setOtp(paddedOtp);
    }
  }, [value, length]);

  React.useEffect(() => {
    if (autoFocus && inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, [autoFocus]);

  const handleChange = (index: number, digit: string) => {
    if (digit.length > 1) {
      digit = digit.slice(-1);
    }

    if (digit !== "" && !/^\d$/.test(digit)) {
      return;
    }

    const newOtp = [...otp];
    newOtp[index] = digit;
    setOtp(newOtp);

    const otpValue = newOtp.join("");
    onChange?.(otpValue);

    // Auto-advance to next field when a digit is entered
    if (digit && index < length - 1) {
      // Use setTimeout to ensure the state update completes before focusing
      setTimeout(() => {
        inputRefs.current[index + 1]?.focus();
      }, 0);
    }

    if (newOtp.every(d => d !== "") && onComplete) {
      onComplete(otpValue);
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace") {
      e.preventDefault();
      const newOtp = [...otp];

      if (newOtp[index]) {
        // Clear current field
        newOtp[index] = "";
        setOtp(newOtp);
        onChange?.(newOtp.join(""));
      } else if (index > 0) {
        // Move to previous field and clear it
        newOtp[index - 1] = "";
        setOtp(newOtp);
        onChange?.(newOtp.join(""));
        setTimeout(() => {
          inputRefs.current[index - 1]?.focus();
        }, 0);
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    } else if (e.key === "Delete") {
      e.preventDefault();
      const newOtp = [...otp];
      newOtp[index] = "";
      setOtp(newOtp);
      onChange?.(newOtp.join(""));
    } else if (/^\d$/.test(e.key)) {
      // Handle direct digit input
      e.preventDefault();
      handleChange(index, e.key);
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text");
    const digits = pastedData.replace(/\D/g, "").slice(0, length);

    if (digits) {
      const newOtp = Array(length).fill("");
      digits.split("").forEach((digit, index) => {
        if (index < length) {
          newOtp[index] = digit;
        }
      });

      setOtp(newOtp);
      onChange?.(newOtp.join(""));

      const nextEmptyIndex = newOtp.findIndex(d => d === "");
      const focusIndex =
        nextEmptyIndex === -1
          ? length - 1
          : Math.min(nextEmptyIndex, digits.length);

      setTimeout(() => {
        inputRefs.current[focusIndex]?.focus();
      }, 0);

      if (newOtp.every(d => d !== "") && onComplete) {
        onComplete(newOtp.join(""));
      }
    }
  };

  const handleFocus = (index: number) => {
    inputRefs.current[index]?.select();
  };

  const getBorderRadius = (index: number) => {
    if (index === 0) {
      return "rounded-s-sm rounded-e-none";
    } else if (index === length - 1) {
      return "rounded-s-none rounded-e-sm";
    } else {
      return "rounded-none";
    }
  };

  return (
    <div className={cn("flex", className)}>
      {Array.from({ length }, (_, index) => (
        <Input
          key={index}
          ref={el => {
            inputRefs.current[index] = el;
          }}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={otp[index]}
          onChange={e => handleChange(index, e.target.value)}
          onKeyDown={e => handleKeyDown(index, e)}
          onPaste={handlePaste}
          onFocus={() => handleFocus(index)}
          size={size}
          variant={variant}
          width="lg"
          disabled={disabled}
          placeholder={placeholder}
          className={cn(
            "h-[40px] w-12 border-r-0 text-center font-mono text-sm last:border-r",
            getBorderRadius(index),
            {
              "w-8 text-xs": size === "xs" || size === "sm",
              "w-12 text-sm": size === "md" || size === "compact",
              "w-14 text-base": size === "lg",
              "w-16 text-lg": size === "xl",
            }
          )}
        />
      ))}
    </div>
  );
}
