import React, { useCallback, useState, useEffect } from "react";
import {
  Stepper,
  Breadcrumb,
  Button,
  type BreadcrumbItem,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  ConfirmationModal,
} from "@/components";
import { useNavigate, useLocation } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/hooks/store";
import {
  setCurrentStepSaved,
  resetOnboarding,
} from "@/global/reducers/firm/firmOnboarding.reducer";
import type { RootState } from "@/global/store";
import { CircleCheck, SkipBack, SkipForward } from "lucide-react";

import { FirmDetailsPage } from "./firm-details";
import { CompletionModal } from "./components/Modal/CompletionModal";
import { RefreshConfirmationModal } from "@/components/ui/refresh-confirmation-modal";
import { useRefreshConfirmation } from "@/hooks/useRefreshConfirmation";

import { FirmBusinessInformationPage } from "./business-information";
import { BankDetailsPage } from "./bank-details";
import { AddressDetailsPage } from "./address-details";
import { DocumentUploadPage } from "./document-upload";
import NeumorphicButton from "@/components/ui/neumorphic-button/neumorphic-button";
import { setShowFormDirtyModal } from "@/global/reducers/form-dirty-modal.reducer";
import { setShowFormWarningModal } from "@/global/reducers/form-warning-modal.reducer";

interface FirmOnboardingFooterProps {
  canGoPrevious: boolean;
  canGoNext: boolean;
  currentStepIndex: number;
  totalSteps: number;
  onPrevious: () => void;
  onNext: () => void;
}

const FirmOnboardingFooter: React.FC<
  FirmOnboardingFooterProps & {
    onCompleteOnboarding?: () => void;
    hasFirmId?: boolean;
  }
> = ({
  canGoPrevious,
  canGoNext,
  currentStepIndex,
  totalSteps,
  onPrevious,
  onNext,
  onCompleteOnboarding,
  hasFirmId = true,
}) => {
  const { disableNext, title, disableReason } = useAppSelector(
    (state: RootState) => state.firmOnboarding
  );
  const [showWarningModal, setShowWarningModal] = useState(false);
  const firmStatus = useAppSelector(state => state.firmOnboarding.firmStatus);

  const handleNext = () => {
    if (disableNext) {
      setShowWarningModal(true);
      return;
    }
    onNext();
  };

  const isPendingApproval = firmStatus === "PENDING_APPROVAL";

  return (
    <footer className="bg-background mt-4">
      <ConfirmationModal
        isOpen={showWarningModal}
        onConfirm={() => setShowWarningModal(false)}
        title={title ?? "Incomplete Step"}
        message={disableReason ?? ""}
        confirmText="OK"
        type="warning"
        size="compact"
      />
      <div className="flex items-center justify-between pt-2">
        <div className="flex">
          <Button
            variant="default"
            size="default"
            onClick={onPrevious}
            disabled={!canGoPrevious}
          >
            <SkipBack className="h-4 w-4" />
            Previous
          </Button>
        </div>

        <div className="flex space-x-4">
          {currentStepIndex === totalSteps - 1 ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="inline-block">
                  <NeumorphicButton
                    type="submit"
                    variant="default"
                    size="default"
                    onClick={onCompleteOnboarding}
                    disabled={!hasFirmId || isPendingApproval}
                    className="h-9 px-5"
                  >
                    <CircleCheck width={14} />
                    Send For Approval
                  </NeumorphicButton>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>
                  {!hasFirmId
                    ? "Firm profile must be generated in the banking system before completing onboarding"
                    : "Complete the onboarding process"}
                </p>
              </TooltipContent>
            </Tooltip>
          ) : (
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="inline-block">
                  <Button
                    variant="default"
                    size="default"
                    onClick={handleNext}
                    disabled={!hasFirmId}
                  >
                    Next
                    <SkipForward className="h-4 w-4" />
                  </Button>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>
                  {disableNext || !canGoNext
                    ? disableReason ||
                      "Please complete the current step before proceeding."
                    : currentStepIndex === totalSteps - 1
                      ? "You are on the last step"
                      : "Proceed to the next step"}
                </p>
              </TooltipContent>
            </Tooltip>
          )}
        </div>
      </div>
    </footer>
  );
};

const getStepFromUrl = (pathname: string): string => {
  const segments = pathname.split("/").filter(Boolean);
  const lastSegment = segments[segments.length - 1];
  if (lastSegment === "onboarding") {
    return "firm-details";
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

export const FirmOnboardingPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();

  // Fetch customer ID, firm ID and save status from Redux store
  const {
    customerId,
    firmId,
    isCurrentStepSaved,
    disableNext,
    title,
    disableReason,
  } = useAppSelector(state => state.firmOnboarding);

  const firmIdentity = firmId || undefined;

  // Handle refresh confirmation
  const { showConfirmation, handleConfirmRefresh, handleCancelRefresh } =
    useRefreshConfirmation();

  const { disableNext: disableNextFormDirty } = useAppSelector(
    (state: RootState) => state.formDirty
  );

  const { forward } = useAppSelector((state: RootState) => state.formForward);

  const handleNavigateAndClear = useCallback(
    (path: string) => {
      if (!path.includes("/firm/management/onboarding")) {
        dispatch(resetOnboarding());
        localStorage.removeItem("firmId");
        localStorage.removeItem("firmCode");
        localStorage.removeItem("firmIdentity");
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
        localStorage.removeItem("firmIdentity");
      }
    };
  }, [dispatch]);

  const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set());
  const [isCompletionModalOpen, setIsCompletionModalOpen] = useState(false);
  const [canProceedToNext, setCanProceedToNext] = useState<
    Record<string, boolean>
  >({});
  const [showWarningModal, setShowWarningModal] = useState(false);

  const currentStep = getStepFromUrl(location.pathname) || "firm-details";
  const currentStepIndex = firmSteps.findIndex(
    step => step.key === currentStep
  );
  const isValidStepIndex = currentStepIndex !== -1;

  const [showUnsavedChangesModal, setShowUnsavedChangesModal] = useState(false);
  const [pendingNavigation, setPendingNavigation] = useState<
    (() => void) | null
  >(null);

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

  const firmStatus = useAppSelector(state => state.firmOnboarding.firmStatus);

  // Check step completion based on actual conditions
  const getStepCompletionStatus = (stepKey: string) => {
    switch (stepKey) {
      case "firm-details":
        return !!firmId || isCurrentStepSaved || canProceedToNext[stepKey]; // Firm must be saved OR step marked as saved
      case "business-information":
        return (
          isCurrentStepSaved ||
          canProceedToNext[stepKey] ||
          completedSteps.has(stepKey)
        );
      case "bank-account-details":
        return isCurrentStepSaved;
      case "address-details":
        return (
          isCurrentStepSaved ||
          canProceedToNext[stepKey] ||
          completedSteps.has(stepKey)
        );
      case "document-upload":
        return (
          isCurrentStepSaved ||
          canProceedToNext[stepKey] ||
          completedSteps.has(stepKey)
        );
      default:
        return false;
    }
  };

  // Enable next button based on step completion
  const canGoNext =
    isValidStepIndex &&
    currentStepIndex < firmSteps.length - 1 &&
    !disableNext &&
    (completedSteps.has(currentStep) || getStepCompletionStatus(currentStep));

  // Only allow access to steps after firm-details if firm profile is saved (firmId exists)
  const canAccessStep = (stepKey: string) => {
    if (stepKey === "firm-details") return true;
    return !!firmId;
  };

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

  const markStepCompleted = useCallback((stepKey: string) => {
    setCompletedSteps(prev => {
      const next = new Set(prev).add(stepKey);
      try {
        sessionStorage.setItem(
          "firmCompletedSteps",
          JSON.stringify(Array.from(next))
        );
      } catch {
        // Ignore
      }
      return next;
    });
  }, []);

  const handlePrevious = useCallback(() => {
    if (canGoPrevious && isValidStepIndex) {
      const previousStep = firmSteps[currentStepIndex - 1].key;
      navigate(`/firm/management/onboarding/${previousStep}`, {
        replace: true,
      });

      window.scrollBy({
        top: -window.innerHeight * 0.8,
        behavior: "smooth",
      });
    }
  }, [canGoPrevious, isValidStepIndex, currentStepIndex, navigate]);

  const handleNext = useCallback(() => {
    if (disableNextFormDirty && !forward) {
      setPendingNavigation(() => () => {
        markStepCompleted(currentStep);
        const nextStep = firmSteps[currentStepIndex + 1].key;
        navigate(`/firm/management/onboarding/${nextStep}`, { replace: true });
        window.scrollTo(0, 0);
      });
      setShowUnsavedChangesModal(true);
      return;
    }

    if (disableNext) {
      setShowWarningModal(true);
      return;
    }

    if (isValidStepIndex && currentStepIndex < firmSteps.length - 1) {
      markStepCompleted(currentStep);
      const nextStep = firmSteps[currentStepIndex + 1].key;
      navigate(`/firm/management/onboarding/${nextStep}`, { replace: true });
      window.scrollTo(0, 0);
    }
  }, [
    disableNextFormDirty,
    forward,
    disableNext,
    currentStep,
    currentStepIndex,
    isValidStepIndex,
    navigate,
    markStepCompleted,
  ]);

  const handleCompleteOnboarding = useCallback(() => {
    markStepCompleted(currentStep);
    setIsCompletionModalOpen(true);
  }, [markStepCompleted, currentStep]);

  const handleCloseCompletionModal = useCallback(() => {
    setIsCompletionModalOpen(false);
    // Reset local state as well
    setCompletedSteps(new Set());
    sessionStorage.removeItem("firmCompletedSteps");
    setCanProceedToNext({});
    // Clear all data
    dispatch(resetOnboarding());
    localStorage.removeItem("firmId");
    localStorage.removeItem("firmCode");
  }, [dispatch]);

  const handleFormSubmit = useCallback(
    (stepKey: string) => {
      markStepCompleted(stepKey);
      // Enable next button for this step after successful save/update
      setCanProceedToNext(prev => ({ ...prev, [stepKey]: true }));
    },
    [markStepCompleted]
  );

  const enableNextStep = useCallback((stepKey: string) => {
    setCanProceedToNext(prev => ({ ...prev, [stepKey]: true }));
  }, []);

  const isPendingApproval = firmStatus === "PENDING_APPROVAL";

  const renderStepContent = () => {
    switch (currentStep) {
      case "firm-details":
        return (
          <FirmDetailsPage
            readonly={isPendingApproval}
            firmIdentity={firmIdentity}
            onFormSubmit={() => handleFormSubmit("firm-details")}
            onSaveSuccess={() => enableNextStep("firm-details")}
          />
        );
      case "business-information":
        if (!firmId) {
          return (
            <div className="rounded-md border border-yellow-200 bg-yellow-50 p-4">
              <p className="text-yellow-800">
                Please save the firm profile first to proceed to this step.
              </p>
            </div>
          );
        }
        return (
          <FirmBusinessInformationPage
            readonly={isPendingApproval}
            customerId={customerId}
            onFormSubmit={() => handleFormSubmit("business-information")}
            onSaveSuccess={() => enableNextStep("business-information")}
          />
        );
      case "bank-account-details":
        if (!firmId) {
          return (
            <div className="rounded-md border border-yellow-200 bg-yellow-50 p-4">
              <p className="text-yellow-800">
                Please save the firm profile first to proceed to this step.
              </p>
            </div>
          );
        }
        return (
          <BankDetailsPage
            firmIdentity={firmId || firmIdentity}
            readonly={isPendingApproval}
            customerId={customerId}
            onFormSubmit={() => handleFormSubmit("bank-account-details")}
            onSaveSuccess={() => enableNextStep("bank-account-details")}
          />
        );
      case "address-details":
        if (!firmId) {
          return (
            <div className="rounded-md border border-yellow-200 bg-yellow-50 p-4">
              <p className="text-yellow-800">
                Please save the firm profile first to proceed to this step.
              </p>
            </div>
          );
        }
        return (
          <AddressDetailsPage
            firmIdentity={firmId || firmIdentity}
            readonly={isPendingApproval}
            customerId={customerId}
            onFormSubmit={() => handleFormSubmit("address-details")}
            onSaveSuccess={() => enableNextStep("address-details")}
          />
        );
      case "document-upload":
        if (!firmId) {
          return (
            <div className="rounded-md border border-yellow-200 bg-yellow-50 p-4">
              <p className="text-yellow-800">
                Please save the firm profile first to proceed to this step.
              </p>
            </div>
          );
        }
        return (
          <DocumentUploadPage
            readonly={isPendingApproval}
            firmIdentity={firmId || firmIdentity}
            customerId={customerId || firmId}
            onFormSubmit={() => handleFormSubmit("document-upload")}
            onSaveSuccess={() => enableNextStep("document-upload")}
          />
        );
      default:
        return (
          <FirmDetailsPage
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

  return (
    <main className="px-8 py-6">
      <ConfirmationModal
        isOpen={showWarningModal}
        onConfirm={() => setShowWarningModal(false)}
        title={title ?? "Incomplete Step"}
        message={
          disableReason ??
          "Please complete the current step before navigating forward."
        }
        confirmText="OK"
        type="warning"
        size="compact"
      />
      <div className="space-y-6">
        <section>
          <Breadcrumb
            items={breadcrumbItems}
            variant="default"
            size="sm"
            className="mb-1"
          />
        </section>

        <section>
          <Stepper
            steps={getStepsWithCompletion()}
            currentStep={currentStep}
            onStepChange={(stepKey: string) => {
              const targetStepIndex = firmSteps.findIndex(
                step => step.key === stepKey
              );
              const currentIndex = firmSteps.findIndex(
                step => step.key === currentStep
              );
              const isPreviousStep = targetStepIndex < currentIndex;
              const isCurrentStep = targetStepIndex === currentIndex;
              const isNextStep = targetStepIndex === currentIndex + 1;
              const isCurrentStepCompleted =
                completedSteps.has(currentStep) ||
                getStepCompletionStatus(currentStep);

              if (!canAccessStep(stepKey)) {
                setShowWarningModal(true);
                return;
              }

              if (disableNextFormDirty && !isPreviousStep && !forward) {
                dispatch(setShowFormDirtyModal(true));
                return;
              }

              if (disableNext && !isPreviousStep) {
                dispatch(setShowFormWarningModal(true));
                return;
              }

              if (
                isPreviousStep ||
                isCurrentStep ||
                (isNextStep && isCurrentStepCompleted)
              ) {
                navigate(`/firm/management/onboarding/${stepKey}`, {
                  replace: true,
                });
                window.scrollTo(0, 0);
              }
            }}
            completedSteps={completedSteps}
            variant="default"
          />
        </section>

        <section className="transition-all duration-300">
          {renderStepContent()}
        </section>

        <FirmOnboardingFooter
          canGoPrevious={canGoPrevious}
          canGoNext={canGoNext}
          currentStepIndex={currentStepIndex}
          totalSteps={firmSteps.length}
          onPrevious={handlePrevious}
          onNext={handleNext}
          onCompleteOnboarding={handleCompleteOnboarding}
          hasFirmId={true}
        />
      </div>

      {/* Completion Modal */}
      <CompletionModal
        isOpen={isCompletionModalOpen}
        onClose={handleCloseCompletionModal}
      />

      {/* Refresh Confirmation Modal */}
      <RefreshConfirmationModal
        isOpen={showConfirmation}
        onConfirm={handleConfirmRefresh}
        onCancel={handleCancelRefresh}
      />
      <ConfirmationModal
        isOpen={showUnsavedChangesModal}
        onConfirm={() => {
          setShowUnsavedChangesModal(false);
          setPendingNavigation(null);
        }}
        onCancel={() => {
          if (pendingNavigation) {
            pendingNavigation();
            setPendingNavigation(null);
          }
          setShowUnsavedChangesModal(false);
        }}
        title="Unsaved Changes"
        message="You have unsaved changes in the current form. Save your changes first, or discard them to continue."
        confirmText="Stay & Save"
        cancelText="Discard & Continue"
        type="warning"
        size="compact"
      />
    </main>
  );
};
