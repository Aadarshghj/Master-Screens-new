import React, {
  useCallback,
  useState,
  useEffect,
  useRef,
  useMemo,
} from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { type BreadcrumbItem, ConfirmationModal } from "@/components";
import type { Step } from "@/types";
import { useAppSelector, useAppDispatch } from "@/hooks/store";
import {
  setEditMode,
  resetLoanProductState,
  setApprovalStatus,
} from "@/global/reducers/loan-stepper/loan-product.reducer";
import { useGetInterestTypesQuery } from "@/global/service/end-points/master/loan-master";
import {
  useGetLoanSchemeStatusQuery,
  useSendLoanSchemeForApprovalMutation,
} from "@/global/service/end-points/loan-product-and-scheme/loan-approval";
import { RefreshConfirmationModal } from "@/components/ui/refresh-confirmation-modal";
import { useRefreshConfirmation } from "@/hooks/useRefreshConfirmation";
import { logger } from "@/global/service";
import FormBaseLayout from "@/layout/BasePageLayout";
import { CreateLoanScheme } from "./createLoanScheme/components/Form/CreateLoanScheme";
import { AssignAttributeValues } from "./assignAttributeValue/components/Form/AssignAtttributeValue";
import { AssignPropertyValues } from "./assignPropertyValue/components/Form/AssignPropertyValue";
import { InterestSlabForm } from "./interestSlabs/components/Form/InterestSlabs";
import { LTVSlabForm } from "./createLTVSlabs/components/Form/LTVSlabs";
import { DocumentRequirement } from "./documentRequirement/components/Form/documentRequirement";
import { GLHeads } from "./configureGLHeads/components/Form/GLHeads";
import { RecoveryPriority } from "./recoveryPriority/components/Form/RecoveryPriority";
import { BusinessRule } from "./businessRule/components/Form/businessRule";
import { LoanSchemeChargeSlab } from "./chargeSlab/components/Form/ChargeSlab";
import { LoanCompletionModal } from "./components/Modal/CompletionModal";

const LOAN_SCHEME_STEPS: Step[] = [
  { key: "create-loan-scheme", label: "Create new Loan Scheme" },
  {
    key: "assign-attributes",
    label: "Assign attribute values for loan scheme",
  },
  { key: "assign-properties", label: "Assign property values for loan scheme" },
  { key: "interest-slabs", label: "Interest Slabs" },
  { key: "ltv-slabs", label: "LTV Slabs" },
  {
    key: "document-requirement",
    label: "Document Requirement for Loan Scheme",
  },
  {
    key: "configure-gl-heads",
    label: "Configure GL Heads for Loan Scheme Transactions",
  },
  { key: "recovery-priority", label: "Recovery Priority" },
  { key: "business-rules", label: "Business Rules" },
  { key: "loan-scheme-charge-slab", label: "Loan Scheme Charge Slab" },
];

const getStepFromUrl = (pathname: string): string => {
  const segments = pathname.split("/").filter(Boolean);
  const lastSegment = segments[segments.length - 1];
  if (lastSegment === "onboarding") {
    return "create-loan-scheme";
  }
  return lastSegment;
};

const getStepLabel = (stepKey: string): string => {
  const step = LOAN_SCHEME_STEPS.find(s => s.key === stepKey);
  return step?.label || stepKey;
};

export const LoanProductSchemeOnboardingPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set());
  const [, setIsSaved] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const hasUnsavedChangesRef = useRef(false);
  const [showUnsavedChangesModal, setShowUnsavedChangesModal] = useState(false);
  const [pendingNavigation, setPendingNavigation] = useState<
    (() => void) | null
  >(null);
  const [isCompletionModalOpen, setIsCompletionModalOpen] = useState(false);

  // Keep ref in sync with state
  useEffect(() => {
    hasUnsavedChangesRef.current = hasUnsavedChanges;
  }, [hasUnsavedChanges]);

  const [sendForApproval] = useSendLoanSchemeForApprovalMutation();

  const { currentSchemeId, interestTypeFlag } = useAppSelector(
    state => state.loanProduct
  );

  const { data: interestTypeOptions = [] } = useGetInterestTypesQuery();

  // Fetch and set approval status when scheme is loaded
  const { data: approvalStatusData } = useGetLoanSchemeStatusQuery(
    currentSchemeId || "",
    {
      skip: !currentSchemeId,
      refetchOnMountOrArgChange: true,
    }
  );

  // Update approval status in Redux when it changes
  useEffect(() => {
    if (approvalStatusData?.status) {
      dispatch(setApprovalStatus(approvalStatusData.status));
    } else if (!currentSchemeId) {
      dispatch(setApprovalStatus(null));
    }
  }, [approvalStatusData, currentSchemeId, dispatch]);

  const selectedInterestType = interestTypeOptions.find(
    opt => opt.value === interestTypeFlag
  );
  const isSlabwise =
    selectedInterestType?.label?.toLowerCase().includes("slab") || false;

  const visibleSteps = LOAN_SCHEME_STEPS.filter(step => {
    if (step.key === "interest-slabs") {
      return isSlabwise;
    }
    return true;
  });

  const { showConfirmation, handleConfirmRefresh, handleCancelRefresh } =
    useRefreshConfirmation();

  const currentStep = getStepFromUrl(location.pathname) || "create-loan-scheme";
  const currentStepIndex = visibleSteps.findIndex(
    step => step.key === currentStep
  );
  const isValidStepIndex = currentStepIndex !== -1;
  const canGoPrevious = currentStepIndex > 0;
  const canGoNext =
    isValidStepIndex &&
    currentStepIndex < visibleSteps.length - 1 &&
    Boolean(currentSchemeId) &&
    completedSteps.has(currentStep);

  const canCompleteOnboarding =
    currentStepIndex === visibleSteps.length - 1 &&
    Boolean(currentSchemeId) &&
    completedSteps.has(currentStep);

  // Reset unsaved changes when step changes
  useEffect(() => {
    setHasUnsavedChanges(false);
  }, [currentStep]);

  useEffect(() => {
    const loadCompletedSteps = () => {
      // Only load completed steps if there's a currentSchemeId
      if (!currentSchemeId) {
        setCompletedSteps(new Set());
        try {
          sessionStorage.removeItem("loanCompletedSteps");
        } catch (error) {
          logger.error(error, { pushLog: false });
        }
        return;
      }

      try {
        const completedStepsStr = sessionStorage.getItem("loanCompletedSteps");
        if (completedStepsStr) {
          const steps = JSON.parse(completedStepsStr);
          setCompletedSteps(new Set(steps));
        }
      } catch (error) {
        logger.error(error, { pushLog: false });
      }
    };

    loadCompletedSteps();

    // Listen for step status changes
    const handleStepStatusChange = () => {
      loadCompletedSteps();
    };

    window.addEventListener("loanStepStatusChanged", handleStepStatusChange);
    return () => {
      window.removeEventListener(
        "loanStepStatusChanged",
        handleStepStatusChange
      );
    };
  }, [currentSchemeId]);

  useEffect(() => {
    if (currentStep === "create-loan-scheme" && !currentSchemeId) {
      setCompletedSteps(new Set());
      try {
        sessionStorage.removeItem("loanCompletedSteps");
      } catch (error) {
        logger.error(error, { pushLog: false });
      }
    }
  }, [currentStep, currentSchemeId]);

  useEffect(() => {
    return () => {
      const currentPath = window.location.pathname;
      if (!currentPath.includes("/loan-product-schema/management/onboarding")) {
        dispatch(resetLoanProductState());
        sessionStorage.removeItem("loanCompletedSteps");
      }
    };
  }, [dispatch]);

  const breadcrumbItems: BreadcrumbItem[] = [
    { label: "Home", href: "/", onClick: () => navigate("/") },
    {
      label: "Loan Management System",
      href: "/loan-product-schema/management/onboarding",
      onClick: () => navigate("/loan"),
    },
    {
      label: "Loan Products & Scheme",
      href: "/loan/products-scheme",
      onClick: () => navigate("/loan/products-scheme"),
    },
    { label: getStepLabel(currentStep), active: true },
  ];

  const markStepCompleted = useCallback((stepKey: string) => {
    setCompletedSteps(prev => {
      const newSteps = new Set(prev).add(stepKey);
      try {
        sessionStorage.setItem(
          "loanCompletedSteps",
          JSON.stringify([...newSteps])
        );
      } catch (error) {
        logger.error(error, { pushLog: false });
      }
      return newSteps;
    });
  }, []);

  // Auto-complete create-loan-scheme step if we have a schemeId (means it was saved)
  useEffect(() => {
    if (currentSchemeId && !completedSteps.has("create-loan-scheme")) {
      markStepCompleted("create-loan-scheme");
    }
  }, [currentSchemeId, markStepCompleted]);

  // Auto-complete interest-slabs step if interest type is not slab-based
  useEffect(() => {
    if (
      currentSchemeId &&
      !isSlabwise &&
      !completedSteps.has("interest-slabs")
    ) {
      markStepCompleted("interest-slabs");
    }
  }, [currentSchemeId, isSlabwise, markStepCompleted]);

  const handleStepComplete = useCallback(
    (stepKey: string, schemeId?: string) => {
      markStepCompleted(stepKey);
      setIsSaved(true);
      if (schemeId) {
        dispatch(setEditMode({ isEdit: true, schemeId }));
      }
    },
    [markStepCompleted, dispatch]
  );

  const getStepsWithCompletion = useMemo(() => {
    return visibleSteps.map(step => ({
      ...step,
      isCompleted: completedSteps.has(step.key),
      isActive: step.key === currentStep,
    }));
  }, [visibleSteps, completedSteps, currentStep]);

  const handlePrevious = useCallback(() => {
    if (canGoPrevious && isValidStepIndex) {
      const previousStep = visibleSteps[currentStepIndex - 1].key;
      if (previousStep === "create-loan-scheme" && currentSchemeId) {
        dispatch(setEditMode({ isEdit: true, schemeId: currentSchemeId }));
      }
      navigate(`/loan-product-schema/management/onboarding/${previousStep}`, {
        replace: true,
      });
      window.scrollBy({ top: -window.innerHeight * 0.8, behavior: "smooth" });
    }
  }, [
    canGoPrevious,
    isValidStepIndex,
    currentStepIndex,
    navigate,
    currentSchemeId,
    dispatch,
    visibleSteps,
  ]);

  const handleNext = useCallback(() => {
    const unsavedChanges = hasUnsavedChangesRef.current;
    const isCurrentStepCompleted = completedSteps.has(currentStep);

    if (isValidStepIndex && currentStepIndex < visibleSteps.length - 1) {
      // If step was already saved but has unsaved changes, show modal
      if (isCurrentStepCompleted && unsavedChanges) {
        setPendingNavigation(() => () => {
          const nextStep = visibleSteps[currentStepIndex + 1].key;
          navigate(`/loan-product-schema/management/onboarding/${nextStep}`, {
            replace: true,
          });
          window.scrollTo(0, 0);
        });
        setShowUnsavedChangesModal(true);
        return;
      }

      // If step is not completed yet, don't allow navigation
      if (!isCurrentStepCompleted) {
        return;
      }

      // Navigate to next step
      const nextStep = visibleSteps[currentStepIndex + 1].key;
      setIsSaved(false);
      navigate(`/loan-product-schema/management/onboarding/${nextStep}`, {
        replace: true,
      });
      window.scrollTo(0, 0);
    }
  }, [
    isValidStepIndex,
    currentStepIndex,
    navigate,
    currentStep,
    visibleSteps,
    completedSteps,
  ]);

  const handleCompleteSetup = useCallback(async () => {
    markStepCompleted(currentStep);

    if (currentSchemeId) {
      try {
        await sendForApproval(currentSchemeId).unwrap();
        logger.info("Loan scheme sent for approval successfully", {
          toast: true,
        });
      } catch {
        logger.error("Failed to send loan scheme for approval", {
          toast: true,
        });
      }
    }

    setIsCompletionModalOpen(true);
  }, [markStepCompleted, currentStep, currentSchemeId, sendForApproval]);

  const handleCloseCompletionModal = useCallback(() => {
    setIsCompletionModalOpen(false);
  }, []);

  const handleDiscardChanges = useCallback(() => {
    if (pendingNavigation) {
      pendingNavigation();
      setPendingNavigation(null);
    }
    setShowUnsavedChangesModal(false);
    setHasUnsavedChanges(false);
  }, [pendingNavigation]);

  const handleSaveAndContinue = useCallback(() => {
    setShowUnsavedChangesModal(false);
    setPendingNavigation(null);
  }, []);

  const onStepChange = useCallback(
    (stepKey: string) => {
      const targetStepIndex = visibleSteps.findIndex(
        step => step.key === stepKey
      );
      const currentStepIdx = visibleSteps.findIndex(
        step => step.key === currentStep
      );
      const isPreviousStep = targetStepIndex < currentStepIdx;

      if (currentSchemeId) {
        const isNextStep = targetStepIndex === currentStepIdx + 1;
        const isCurrentStep = targetStepIndex === currentStepIdx;
        const isCurrentStepCompleted = completedSteps.has(currentStep);

        if (
          isPreviousStep ||
          isCurrentStep ||
          (isNextStep && isCurrentStepCompleted)
        ) {
          navigate(`/loan-product-schema/management/onboarding/${stepKey}`, {
            replace: true,
          });
          window.scrollTo(0, 0);
        }
      }
    },
    [visibleSteps, currentStep, currentSchemeId, completedSteps, navigate]
  );

  const renderStepContent = () => {
    switch (currentStep) {
      case "create-loan-scheme":
        return (
          <CreateLoanScheme
            onComplete={schemeId =>
              handleStepComplete("create-loan-scheme", schemeId)
            }
            onSave={() => {
              setIsSaved(true);
              setHasUnsavedChanges(false);
            }}
            onUnsavedChanges={setHasUnsavedChanges}
          />
        );
      case "assign-attributes":
        return (
          <AssignAttributeValues
            onComplete={() => handleStepComplete("assign-attributes")}
            onSave={() => {
              setIsSaved(true);
              setHasUnsavedChanges(false);
            }}
            onUnsavedChanges={setHasUnsavedChanges}
          />
        );
      case "assign-properties":
        return (
          <AssignPropertyValues
            onComplete={() => handleStepComplete("assign-properties")}
            onSave={() => {
              setIsSaved(true);
              setHasUnsavedChanges(false);
            }}
            onUnsavedChanges={setHasUnsavedChanges}
          />
        );
      case "interest-slabs":
        return (
          <InterestSlabForm
            onComplete={() => handleStepComplete("interest-slabs")}
            onSave={() => {
              setIsSaved(true);
              setHasUnsavedChanges(false);
            }}
            loanSchemeFromStepper={currentSchemeId || ""}
            onUnsavedChanges={setHasUnsavedChanges}
          />
        );
      case "ltv-slabs":
        return (
          <LTVSlabForm
            onComplete={() => handleStepComplete("ltv-slabs")}
            onSave={() => {
              setIsSaved(true);
              setHasUnsavedChanges(false);
            }}
            loanSchemeFromStepper={currentSchemeId || ""}
            onUnsavedChanges={setHasUnsavedChanges}
          />
        );
      case "document-requirement":
        return (
          <DocumentRequirement
            onComplete={() => handleStepComplete("document-requirement")}
            onSave={() => {
              setIsSaved(true);
              setHasUnsavedChanges(false);
            }}
            onUnsavedChanges={setHasUnsavedChanges}
          />
        );
      case "configure-gl-heads":
        return (
          <GLHeads
            onComplete={() => handleStepComplete("configure-gl-heads")}
            onSave={() => {
              setIsSaved(true);
              setHasUnsavedChanges(false);
            }}
            onUnsavedChanges={setHasUnsavedChanges}
          />
        );
      case "recovery-priority":
        return (
          <RecoveryPriority
            onComplete={() => handleStepComplete("recovery-priority")}
            onSave={() => {
              setIsSaved(true);
              setHasUnsavedChanges(false);
            }}
            onUnsavedChanges={setHasUnsavedChanges}
          />
        );
      case "business-rules":
        return (
          <BusinessRule
            onComplete={() => handleStepComplete("business-rules")}
            onSave={() => {
              setIsSaved(true);
              setHasUnsavedChanges(false);
            }}
            onUnsavedChanges={setHasUnsavedChanges}
          />
        );
      case "loan-scheme-charge-slab":
        return (
          <LoanSchemeChargeSlab
            onComplete={() => handleStepComplete("loan-scheme-charge-slab")}
            onSave={() => {
              setIsSaved(true);
              setHasUnsavedChanges(false);
            }}
          />
        );
      default:
        return null;
    }
  };

  return (
    <FormBaseLayout
      onNext={handleNext}
      canGoPrevious={canGoPrevious}
      currentStepIndex={currentStepIndex}
      canGoNext={
        currentStepIndex === visibleSteps.length - 1
          ? canCompleteOnboarding
          : canGoNext
      }
      totalSteps={visibleSteps.length}
      handlePrevious={handlePrevious}
      handleCompleteOnboarding={handleCompleteSetup}
      breadcrumbItems={breadcrumbItems}
      steps={getStepsWithCompletion}
      currentStep={currentStep}
      onStepChange={onStepChange}
      completedSteps={completedSteps}
      showConfirmationRefresh={showConfirmation}
      handleConfirmRefresh={handleConfirmRefresh}
      handleCancelRefresh={handleCancelRefresh}
      wrapperClassName="p-6"
    >
      <section className="transition-all duration-300">
        {renderStepContent()}
      </section>
      <LoanCompletionModal
        isOpen={isCompletionModalOpen}
        onClose={handleCloseCompletionModal}
        schemeId={currentSchemeId || ""}
      />
      <RefreshConfirmationModal
        isOpen={showConfirmation}
        onConfirm={handleConfirmRefresh}
        onCancel={handleCancelRefresh}
      />
      <ConfirmationModal
        isOpen={showUnsavedChangesModal}
        onConfirm={handleSaveAndContinue}
        onCancel={handleDiscardChanges}
        title="Unsaved Changes"
        message="You have unsaved changes in the current form. Save your changes first, or discard them to continue."
        confirmText="Stay & Save"
        cancelText="Discard & Continue"
        type="warning"
        size="standard"
      />
    </FormBaseLayout>
  );
};
