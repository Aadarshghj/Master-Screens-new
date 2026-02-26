import React from "react";
import { ErrorBoundary } from "react-error-boundary";
import type { BasicInfoFormProps } from "@/types";
import { BasicInformationForm } from "./Form/BasicInformation";

export const BasicInformationPage: React.FC<BasicInfoFormProps> = () => {
  return (
    <div className="space-y-6">
      <ErrorBoundary
        fallback={
          <div className="text-status-error p-4">
            Error loading basic information form
          </div>
        }
      >
        <BasicInformationForm />
      </ErrorBoundary>
    </div>
  );
};
