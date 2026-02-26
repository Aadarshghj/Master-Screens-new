import React, { useCallback, useState, useEffect } from "react";
import { type BreadcrumbItem } from "@/components";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "@/hooks/store";
import {
  setCurrentStepSaved,
  resetOnboarding,
} from "@/global/reducers/firm/firmOnboarding.reducer";

import FormBaseLayout from "@/layout/BasePageLayout";
import { FirmDetailsPage } from "../firm-details";
import { FirmBusinessInformationPage } from "../business-information";
import { BankDetailsPage } from "../bank-details";
import { AddressDetailsPage } from "../address-details";
import { DocumentUploadPage } from "../document-upload";

const getCurrentStep = (pathname: string): string => {
  const segments = pathname.split("/").filter(Boolean);
  const lastSegment = segments[segments.length - 1];

  if (lastSegment === "onboarding") {
    return "kyc-document";
  }

  return lastSegment;
};

const getStepLabel = (stepKey: string): string => {
  const stepLabels: Record<string, string> = {
    "firm-details": "Firm Details",
    "business-information": "Business Information",
    "bank-account-details": "Bank Account Details",
    "address-details": "Address Details",
    "document-upload": "Document Upload",
  };
  return stepLabels[stepKey] || stepKey;
};

const firmSteps = [
  { key: "firm-details", label: "Firm Details" },
  { key: "business-information", label: "Business Information" },
  { key: "bank-account-details", label: "Bank Account Details" },
  { key: "address-details", label: "Address Details" },
  { key: "document-upload", label: "Document Upload" },
];

interface FirmViewPage {
  readOnly?: boolean;
  identity?: string;
  approvalScreen?: boolean;
}
export const FirmView: React.FC<FirmViewPage> = ({
  readOnly = false,
  identity,
  approvalScreen,
}) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [step, setStep] = useState("firm-details");
  const firmIdentity = identity;
  const handleNavigateAndClear = useCallback(
    (path: string) => {
      if (!path.includes("/firm/management/onboarding")) {
        dispatch(resetOnboarding());
        localStorage.removeItem("firmId");
        localStorage.removeItem("firmCode");
      }
      navigate(path);
    },
    [dispatch, navigate]
  );

  // Clear data only when navigating completely out of firm onboarding
  useEffect(() => {
    return () => {
      // Only clear if navigating to a non-firm route
      const currentPath = window.location.pathname;
      if (!currentPath.includes("/firm/management/onboarding")) {
        dispatch(resetOnboarding());
        localStorage.removeItem("firmId");
        localStorage.removeItem("firmCode");
      }
    };
  }, [dispatch]);

  const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set());
  const [canProceedToNext, setCanProceedToNext] = useState<
    Record<string, boolean>
  >({});

  const currentStep = getCurrentStep(step);
  const currentStepIndex = firmSteps.findIndex(
    step => step.key === currentStep
  );
  const isValidStepIndex = currentStepIndex !== -1;

  useEffect(() => {
    try {
      const stored = sessionStorage.getItem("firmCompletedSteps");
      if (stored) {
        setCompletedSteps(new Set(JSON.parse(stored)));
      }
    } catch {
      // Ignore
    }
  }, []);

  // Only reset saved state when navigating to a new step that hasn't been completed
  useEffect(() => {
    // Don't reset if step is already completed or if we have the required conditions
    if (!completedSteps.has(currentStep) && !canProceedToNext[currentStep]) {
      dispatch(setCurrentStepSaved(false));
    }
  }, [currentStep, dispatch, completedSteps, canProceedToNext]);

  const canGoPrevious = currentStepIndex > 0;

  const canGoNext = isValidStepIndex && currentStepIndex < firmSteps.length - 1;
  const breadcrumbItems: BreadcrumbItem[] = [
    {
      label: "Home",
      href: "/",
      onClick: () => handleNavigateAndClear("/"),
    },
    {
      label: "Customer Management System",
      href: "/customer",
      onClick: () => handleNavigateAndClear("/customer"),
    },
    {
      label: "Firm Management",
      href: "/firm/management",
      onClick: () => handleNavigateAndClear("/firm/management"),
    },
    {
      label: getStepLabel(currentStep),
      active: true,
    },
  ];

  const handlePrevious = useCallback(() => {
    if (canGoPrevious && isValidStepIndex) {
      const previousStep = firmSteps[currentStepIndex - 1].key;
      setStep(previousStep);

      window.scrollBy({
        top: -window.innerHeight * 0.8,
        behavior: "smooth",
      });
    }
  }, [canGoPrevious, isValidStepIndex, currentStepIndex, navigate]);

  const handleNext = useCallback(() => {
    if (currentStepIndex < firmSteps.length - 1) {
      const nextStep = firmSteps[currentStepIndex + 1].key;
      setStep(nextStep);
      window.scrollTo(0, 0);
    }
  }, [
    completedSteps,
    currentStep,
    isValidStepIndex,
    currentStepIndex,
    firmSteps,
  ]);

  const handleFormSubmit = (stepKey: string) => {
    setCanProceedToNext(prev => ({ ...prev, [stepKey]: true }));
  };

  const enableNextStep = useCallback((stepKey: string) => {
    setCanProceedToNext(prev => ({ ...prev, [stepKey]: true }));
  }, []);

  const renderStepContent = () => {
    switch (currentStep) {
      case "firm-details":
        return (
          <FirmDetailsPage
            readonly={readOnly}
            firmIdentity={firmIdentity}
            firmId={firmIdentity}
            onFormSubmit={() => handleFormSubmit("firm-details")}
            onSaveSuccess={() => enableNextStep("firm-details")}
          />
        );
      case "business-information":
        return (
          <FirmBusinessInformationPage
            readonly={readOnly}
            customerId={identity}
            onFormSubmit={() => handleFormSubmit("business-information")}
            onSaveSuccess={() => enableNextStep("business-information")}
          />
        );
      case "bank-account-details":
        return (
          <BankDetailsPage
            readonly={readOnly}
            firmIdentity={firmIdentity}
            customerId={identity}
            onFormSubmit={() => handleFormSubmit("bank-account-details")}
            onSaveSuccess={() => enableNextStep("bank-account-details")}
          />
        );
      case "address-details":
        return (
          <AddressDetailsPage
            readonly={readOnly}
            firmIdentity={firmIdentity}
            customerId={identity}
            onFormSubmit={() => handleFormSubmit("address-details")}
            onSaveSuccess={() => enableNextStep("address-details")}
          />
        );
      case "document-upload":
        return (
          <DocumentUploadPage
            readonly={readOnly}
            firmIdentity={firmIdentity}
            customerId={firmIdentity}
            onFormSubmit={() => handleFormSubmit("document-upload")}
            onSaveSuccess={() => enableNextStep("document-upload")}
          />
        );
      default:
        return (
          <FirmDetailsPage
            readonly={readOnly}
            firmIdentity={firmIdentity}
            onFormSubmit={() => handleFormSubmit("firm-details")}
            onSaveSuccess={() => enableNextStep("firm-details")}
          />
        );
    }
  };

  const getStepsWithCompletion = () => {
    return firmSteps.map(step => ({
      ...step,
      isCompleted: completedSteps.has(step.key),
      isActive: step.key === currentStep,
    }));
  };
  const onStepChange = (stepKey: string) => {
    setStep(stepKey);
    window.scrollTo(0, 0);
    return;
  };
  return (
    <FormBaseLayout
      onNext={handleNext}
      canGoPrevious={canGoPrevious}
      currentStepIndex={currentStepIndex}
      canGoNext={canGoNext}
      totalSteps={firmSteps.length}
      handlePrevious={handlePrevious}
      //   handleCompleteOnboarding={handleCompleteOnboarding}
      breadcrumbItems={breadcrumbItems}
      steps={getStepsWithCompletion()}
      currentStep={currentStep}
      onStepChange={onStepChange}
      completedSteps={completedSteps}
      isView={true}
      wrapperClassName="px-2 md:px-4 lg:px-8 py-6"
      readOnly={readOnly}
      approvalScreen={approvalScreen}
    >
      <section className="max-h-[65vh] overflow-scroll pb-8 transition-all duration-300">
        {renderStepContent()}
      </section>
    </FormBaseLayout>
  );
};
