import React from "react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { OTPInput } from "@/components/ui/otp-field";

interface OTPModalProps {
  isOpen: boolean;
  onClose: () => void;
  mobileNumber?: string;
  otpValue: string;
  onOtpChange: (value: string) => void;
  onVerify: () => void;
  onResend: () => void;
  isVerifying: boolean;
  isSending: boolean;
  canResend: boolean;
  timer: number;
}

const formatTimer = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
};

export const OTPModal: React.FC<OTPModalProps> = ({
  isOpen,
  onClose,
  mobileNumber,
  otpValue,
  onOtpChange,
  onVerify,
  onResend,
  isVerifying,
  isSending,
  canResend,
  timer,
}) => {
  return (
    <Modal isOpen={isOpen} close={onClose} title="OTP Verification" width="sm">
      <div className="p-6">
        <p className="mb-4 text-sm text-gray-600">
          Enter the 6-digit OTP sent to +91{mobileNumber}
        </p>

        <div className="mb-2 flex justify-center">
          <OTPInput
            length={6}
            value={otpValue}
            onChange={onOtpChange}
            onComplete={onOtpChange}
            autoFocus
            size="lg"
          />
        </div>

        {/* Timer under input */}
        <div className="mb-6 flex justify-center">
          {!canResend && (
            <p className="text-sm text-gray-500">
              Resend OTP in {formatTimer(timer)}
            </p>
          )}
        </div>

        <div className="flex justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            className="bg-action-title"
            onClick={onClose}
            disabled={isVerifying}
          >
            Close
          </Button>
          {canResend ? (
            <Button type="button" onClick={onResend} disabled={isSending}>
              {isSending ? "Sending..." : "Resend OTP"}
            </Button>
          ) : (
            <Button
              type="button"
              onClick={onVerify}
              disabled={isVerifying || otpValue.length !== 6}
            >
              {isVerifying ? "Verifying..." : "Verify"}
            </Button>
          )}
        </div>
      </div>
    </Modal>
  );
};
