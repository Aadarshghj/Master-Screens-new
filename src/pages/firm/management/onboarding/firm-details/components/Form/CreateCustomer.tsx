import React, { useCallback, useState, useEffect } from "react";
import { ConfirmationModal } from "@/components";
import { useAppDispatch, useAppSelector } from "@/hooks/store";
import { RefreshConfirmationModal } from "@/components/ui/refresh-confirmation-modal";
import { useRefreshConfirmation } from "@/hooks/useRefreshConfirmation";
import { logger, useModifyCustomerStatusMutation } from "@/global/service";
import type { RootState } from "@/global/store";
import { setShowFormDirtyModal } from "@/global/reducers/form-dirty-modal.reducer";
import { setShowFormWarningModal } from "@/global/reducers/form-warning-modal.reducer";
import FormBaseLayout from "@/layout/BasePageLayout";
import { onboardingSteps } from "@/pages/customer/management/onboading/constants/page-constants";
import { KYCPage } from "@/pages/customer/management/onboading/kyc-document";
import { BasicInformationForm } from "@/pages/customer/management/onboading/basic-information";
import { PhotoLivelinessPage } from "@/pages/customer/management/onboading/photo-liveliness";
import { AddressDetails } from "@/pages/customer/management/onboading/address-details";
import { AdditionalOptionalPage } from "@/pages/customer/management/onboading/additional-optional-details";
import { NomineePage } from "@/pages/customer/management/onboading/nominee-details";
import { BankAccountDetailsPage } from "@/pages/customer/management/onboading/bank-account-details";
import { ContactNotificationPage } from "@/pages/customer/management/onboading/contact-notification";
import { Form60Page } from "@/pages/customer/management/onboading/form-60";
import { CompletionModal } from "@/pages/customer/management/onboading/components/Modal/CompletionModal";
const getCurrentStep = (pathname: string): string => {
  const segments = pathname.split("/").filter(Boolean);
  const lastSegment = segments[segments.length - 1];

  if (lastSegment === "onboarding") {
    return "kyc-document";
  }

  return lastSegment;
};
interface CreateCustomerProps {
  handleClose: () => void;
}
export const CreateCustomer: React.FC<CreateCustomerProps> = ({
  handleClose,
}) => {
  const dispatch = useAppDispatch();
  const [step, setStep] = useState("kyc-document");
  const { isPanDetailsSubmit } = useAppSelector(
    (state: RootState) => state.panDetails
  );
  const [modifyCustomerStatus] = useModifyCustomerStatusMutation();
  const customerIdentity = useAppSelector(
    state => state.customerIdentity?.identity
  );

  const { showConfirmation, handleConfirmRefresh, handleCancelRefresh } =
    useRefreshConfirmation();

  const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set());
  const [isCompletionModalOpen, setIsCompletionModalOpen] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [hasNomineeUnsavedChanges, setHasNomineeUnsavedChanges] =
    useState(false);
  const [showUnsavedChangesModal, setShowUnsavedChangesModal] = useState(false);
  const [pendingNavigation, setPendingNavigation] = useState<
    (() => void) | null
  >(null);

  useEffect(() => {
    const loadCompletedSteps = () => {
      try {
        const completedStepsStr = sessionStorage.getItem("completedSteps");
        if (completedStepsStr) {
          const steps = JSON.parse(completedStepsStr);
          setCompletedSteps(new Set(steps));
        }
      } catch (error) {
        logger.error(error, { pushLog: false });
      }
    };

    loadCompletedSteps();
  }, []);

  const filteredSteps = isPanDetailsSubmit
    ? onboardingSteps.filter(step => step.key !== "form60")
    : onboardingSteps;

  const currentStep = getCurrentStep(step);
  const currentStepIndex = filteredSteps.findIndex(
    step => step.key === currentStep
  );
  const isValidStepIndex = currentStepIndex !== -1;

  const canGoPrevious = currentStepIndex > 0;

  const markStepCompleted = useCallback((stepKey: string) => {
    setCompletedSteps(prev => {
      const newSteps = new Set(prev).add(stepKey);
      try {
        sessionStorage.setItem("completedSteps", JSON.stringify([...newSteps]));
      } catch (error) {
        logger.error(error, { pushLog: false });
      }
      return newSteps;
    });
  }, []);

  const canGoNext =
    isValidStepIndex &&
    currentStepIndex < filteredSteps.length - 1 &&
    Boolean(customerIdentity);
  const handlePrevious = useCallback(() => {
    if (canGoPrevious && isValidStepIndex) {
      const previousStep = filteredSteps[currentStepIndex - 1].key;
      setStep(previousStep);

      window.scrollBy({
        top: -window.innerHeight * 0.8,
        behavior: "smooth",
      });
    }
  }, [canGoPrevious, isValidStepIndex, currentStepIndex, filteredSteps]);

  const handleNext = useCallback(() => {
    if (isValidStepIndex && currentStepIndex < filteredSteps.length - 1) {
      markStepCompleted(currentStep);
      const nextStep = filteredSteps[currentStepIndex + 1].key;
      setStep(nextStep);
      window.scrollTo(0, 0);
    }
  }, [
    isValidStepIndex,
    currentStepIndex,
    currentStep,
    markStepCompleted,
    filteredSteps,
    hasUnsavedChanges,
    hasNomineeUnsavedChanges,
  ]);

  const handleCompleteOnboarding = useCallback(async () => {
    try {
      markStepCompleted(currentStep);
      await modifyCustomerStatus(customerIdentity ?? "").unwrap();
      setIsCompletionModalOpen(true);
    } catch (err) {
      console.error("Failed to update customer status:", err);
    }
  }, [markStepCompleted, currentStep, modifyCustomerStatus, customerIdentity]);

  const handleCloseCompletionModal = useCallback(() => {
    setIsCompletionModalOpen(false);
  }, []);

  const handleFormSubmit = useCallback(
    async (stepKey: string) => {
      markStepCompleted(stepKey);
      logger.info(`Step ${stepKey} completed successfully`, { pushLog: false });
    },
    [markStepCompleted]
  );

  // Handle unsaved changes modal actions
  const handleDiscardChanges = useCallback(() => {
    // Discard changes and proceed to next page
    if (pendingNavigation) {
      pendingNavigation();
      setPendingNavigation(null);
    }
    setShowUnsavedChangesModal(false);
    setHasUnsavedChanges(false);
    setHasNomineeUnsavedChanges(false);
  }, [pendingNavigation]);
  const handleSaveAndContinue = useCallback(() => {
    setShowUnsavedChangesModal(false);
    setPendingNavigation(null);
  }, []);
  const renderStepContent = () => {
    switch (currentStep) {
      case "kyc-document":
        return (
          <KYCPage
            customerCreationMode
            customerIdentity={customerIdentity}
            onFormSubmit={() => handleFormSubmit("kyc-document")}
          />
        );
      case "basic-information":
        return (
          <BasicInformationForm
            customerIdentity={customerIdentity}
            onFormSubmit={async () => handleFormSubmit("basic-information")}
          />
        );
      case "photo-liveness":
        return (
          <PhotoLivelinessPage
            customerIdentity={customerIdentity}
            onFormSubmit={async () => handleFormSubmit("photo-liveness")}
          />
        );
      case "address-details":
        return (
          <AddressDetails
            customerIdentity={customerIdentity}
            onFormSubmit={() => handleFormSubmit("address-details")}
            onUnsavedChanges={setHasUnsavedChanges}
          />
        );
      case "additional-opt-details":
        return (
          <AdditionalOptionalPage
            customerIdentity={customerIdentity ?? ""}
            onFormSubmit={() => handleFormSubmit("additional-opt-details")}
          />
        );
      case "nominee-details":
        return (
          <NomineePage
            customerIdentity={customerIdentity}
            onFormSubmit={() => handleFormSubmit("nominee-details")}
            onUnsavedChanges={setHasNomineeUnsavedChanges}
            isView={false}
          />
        );
      case "bank-account-details":
        return (
          <BankAccountDetailsPage
            customerIdentity={customerIdentity}
            onFormSubmit={() => handleFormSubmit("bank-account-details")}
          />
        );
      case "contact-notification-preferences":
        return (
          <ContactNotificationPage
            customerIdentity={customerIdentity}
            onFormSubmit={() =>
              handleFormSubmit("contact-notification-preferences")
            }
          />
        );
      case "form60":
        return (
          <Form60Page
            customerIdentity={customerIdentity ?? ""}
            onFormSubmit={() => handleFormSubmit("form60")}
          />
        );
      default:
        return <KYCPage customerIdentity={customerIdentity} />;
    }
  };

  const getStepsWithCompletion = () => {
    return filteredSteps.map(step => ({
      ...step,
      isCompleted: completedSteps.has(step.key),
      isActive: step.key === currentStep,
    }));
  };
  // const { disableNext } = useAppSelector(
  //   (state: RootState) => state.unsavedformWarning
  // );
  const { disableNext } = useAppSelector(
    (state: RootState) => state.formDisableNext
  );

  const { forward } = useAppSelector((state: RootState) => state.formForward);
  const { disableNext: disableNextFormDirty } = useAppSelector(
    (state: RootState) => state.formDirty
  );
  const onStepChange = (stepKey: string) => {
    const targetStepIndex = filteredSteps.findIndex(
      step => step.key === stepKey
    );
    const currentStepIndex = filteredSteps.findIndex(
      step => step.key === currentStep
    );
    const isPreviousStep = targetStepIndex < currentStepIndex;

    if (disableNextFormDirty && !forward) {
      dispatch(setShowFormDirtyModal(true));
      return;
    } else if (disableNext && !isPreviousStep) {
      dispatch(setShowFormWarningModal(true));
      return;
    }
    if (customerIdentity) {
      const isNextStep = targetStepIndex === currentStepIndex + 1;
      const isCurrentStep = targetStepIndex === currentStepIndex;
      const isCurrentStepCompleted = completedSteps.has(currentStep);

      if (
        isPreviousStep ||
        isCurrentStep ||
        (isNextStep && isCurrentStepCompleted)
      ) {
        setStep(stepKey);
        window.scrollTo(0, 0);
      }
    }
  };
  const handleCloseViewModal = () => {
    handleClose();
  };
  return (
    <FormBaseLayout
      onNext={handleNext}
      canGoPrevious={canGoPrevious}
      currentStepIndex={currentStepIndex}
      canGoNext={canGoNext}
      totalSteps={filteredSteps.length}
      handlePrevious={handlePrevious}
      handleCompleteOnboarding={handleCompleteOnboarding}
      steps={getStepsWithCompletion()}
      currentStep={currentStep}
      onStepChange={onStepChange}
      completedSteps={completedSteps}
      showConfirmationRefresh={showConfirmation}
      handleConfirmRefresh={handleConfirmRefresh}
      handleCancelRefresh={handleCancelRefresh}
      customerCreationMode
      wrapperClassName="px-2 md:px-4 lg:px-8 py-6"
      isView
    >
      <section className="max-h-[65vh] overflow-scroll pb-8 transition-all duration-300">
        {renderStepContent()}
      </section>
      <CompletionModal
        isOpen={isCompletionModalOpen}
        onClose={handleCloseCompletionModal}
        customerIdentity={customerIdentity ?? ""}
        handleCloseViewModal={handleCloseViewModal}
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
        size="compact"
      />
    </FormBaseLayout>
  );
};
