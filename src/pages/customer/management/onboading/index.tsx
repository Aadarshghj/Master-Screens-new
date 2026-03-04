import React, { useCallback, useState, useEffect } from "react";
import { type BreadcrumbItem, ConfirmationModal } from "@/components";
import { useNavigate, useLocation } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/hooks/store";
import { BasicInformationForm } from "./basic-information/components/Form/BasicInformation";
import { PhotoLivelinessPage } from "./photo-liveliness";
import { NomineePage } from "./nominee-details";
import { Form60Page } from "./form-60";
import { AdditionalOptionalPage } from "./additional-optional-details";
import { AddressDetails } from "./address-details";
import { BankAccountDetailsPage } from "./bank-account-details";
import { CompletionModal } from "./components/Modal/CompletionModal";
import { ContactNotificationPage } from "./contact-notification";
import { KYCPage } from "./kyc-document";
import { RefreshConfirmationModal } from "@/components/ui/refresh-confirmation-modal";
import { useRefreshConfirmation } from "@/hooks/useRefreshConfirmation";
import { logger, useModifyCustomerStatusMutation } from "@/global/service";
import type { RootState } from "@/global/store";
import { setShowFormDirtyModal } from "@/global/reducers/form-dirty-modal.reducer";
import { setShowFormWarningModal } from "@/global/reducers/form-warning-modal.reducer";
import FormBaseLayout, {
  type ConfirmationModalData,
} from "@/layout/BasePageLayout";
import { onboardingSteps } from "./constants/page-constants";
import { getStepFromUrl, getStepLabel } from "./helper/page-helper";

export const CustomerOnboardingPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const { isPanDetailsSubmit } = useAppSelector(
    (state: RootState) => state.panDetails
  );
  const [modifyCustomerStatus] = useModifyCustomerStatusMutation();
  const customerIdentity = useAppSelector(
    state => state.customerIdentity?.identity
  );

  const { showConfirmation, handleConfirmRefresh, handleCancelRefresh } =
    useRefreshConfirmation();
  const defaultConfirmationModalValue = {
    show: null,
    title: null,
    description: null,
    cancelText: null,
    confirmText: null,
    feature: null,
    doAction: null,
  };
  const [confirmationModalData, setConfirmationModalData] =
    useState<ConfirmationModalData>(defaultConfirmationModalValue);
  const handleResetConfirmationModal = () => {
    setConfirmationModalData(defaultConfirmationModalValue);
  };
  const handleAcceptConfirmationModal = (data: ConfirmationModalData) => {
    setConfirmationModalData({
      ...data,
      show: false,
      doAction: true,
    });
  };

  const handleSetConfirmationModalData = (data: ConfirmationModalData) => {
    setConfirmationModalData(data);
  };
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

  const currentStep = getStepFromUrl(location.pathname) || "kyc-document";
  const currentStepIndex = filteredSteps.findIndex(
    step => step.key === currentStep
  );
  const isValidStepIndex = currentStepIndex !== -1;

  const canGoPrevious = currentStepIndex > 0;

  const breadcrumbItems: BreadcrumbItem[] = [
    {
      label: "Home",
      href: "/",
      onClick: () => navigate("/"),
    },
    {
      label: "Customer Management System",
      href: "/customer",
      onClick: () => navigate("/customer"),
    },
    {
      label: "Customer Management",
      href: "/customer/management",
      onClick: () => navigate("/customer/management"),
    },
    {
      label: "Customer Onboarding",
      href: "/customer/management/onboarding",
      onClick: () => navigate("/customer/management/onboarding"),
    },
    {
      label: getStepLabel(currentStep),
      active: true,
    },
  ];

  const markStepCompleted = useCallback((stepKey: string) => {
    setCompletedSteps(prev => {
      const newSteps = new Set(prev).add(stepKey);
      // Save to session storage
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
      navigate(`/customer/management/onboarding/${previousStep}`, {
        replace: true,
      });

      window.scrollBy({
        top: -window.innerHeight * 0.8,
        behavior: "smooth",
      });
    }
  }, [
    canGoPrevious,
    isValidStepIndex,
    currentStepIndex,
    navigate,
    filteredSteps,
  ]);

  const handleNext = useCallback(() => {
    if (isValidStepIndex && currentStepIndex < filteredSteps.length - 1) {
      // Check for unsaved changes before navigation
      const hasAnyUnsavedChanges =
        hasUnsavedChanges || hasNomineeUnsavedChanges;
      if (hasAnyUnsavedChanges) {
        setPendingNavigation(() => () => {
          markStepCompleted(currentStep);
          const nextStep = filteredSteps[currentStepIndex + 1].key;
          navigate(`/customer/management/onboarding/${nextStep}`, {
            replace: true,
          });
          window.scrollTo(0, 0);
        });
        setShowUnsavedChangesModal(true);
        return;
      }

      // Proceed with navigation if no unsaved changes
      markStepCompleted(currentStep);
      const nextStep = filteredSteps[currentStepIndex + 1].key;
      navigate(`/customer/management/onboarding/${nextStep}`, {
        replace: true,
      });
      window.scrollTo(0, 0);
    }
  }, [
    isValidStepIndex,
    currentStepIndex,
    navigate,
    currentStep,
    markStepCompleted,
    filteredSteps,
    hasUnsavedChanges,
    hasNomineeUnsavedChanges,
  ]);
  const handleApprove = () => {
    handleSetConfirmationModalData({
      cancelText: "CANCEL",
      confirmText: "SEND_FOR_APPROVAL",
      feature: "APPROVE",
      description:
        "Are you sure you want to send this request for approval? You won’t be able to make further changes once it’s submitted.",
      title: "Send for Approval",
      show: true,
      doAction: null,
    });
  };
  const handleCompleteOnboarding = useCallback(async () => {
    try {
      markStepCompleted(currentStep);
      await modifyCustomerStatus(customerIdentity ?? "").unwrap();
      setIsCompletionModalOpen(true);
    } catch (err) {
      console.error("Failed to update customer status:", err);
    }
  }, [markStepCompleted, currentStep, modifyCustomerStatus, customerIdentity]);
  useEffect(() => {
    if (
      !confirmationModalData?.doAction ||
      confirmationModalData?.feature !== "APPROVE"
    ) {
      return;
    }

    handleCompleteOnboarding();
  }, [confirmationModalData]);
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
            customerIdentity={customerIdentity}
            onFormSubmit={() => handleFormSubmit("kyc-document")}
            handleSetConfirmationModalData={handleSetConfirmationModalData}
            confirmationModalData={confirmationModalData}
          />
        );
      case "basic-information":
        return (
          <BasicInformationForm
            customerIdentity={customerIdentity}
            onFormSubmit={async () => handleFormSubmit("basic-information")}
            handleSetConfirmationModalData={handleSetConfirmationModalData}
            confirmationModalData={confirmationModalData}
          />
        );
      case "photo-liveness":
        return (
          <PhotoLivelinessPage
            customerIdentity={customerIdentity}
            onFormSubmit={async () => handleFormSubmit("photo-liveness")}
            handleSetConfirmationModalData={handleSetConfirmationModalData}
            confirmationModalData={confirmationModalData}
          />
        );
      case "address-details":
        return (
          <AddressDetails
            customerIdentity={customerIdentity}
            onFormSubmit={() => handleFormSubmit("address-details")}
            onUnsavedChanges={setHasUnsavedChanges}
            handleSetConfirmationModalData={handleSetConfirmationModalData}
            confirmationModalData={confirmationModalData}
          />
        );
      case "additional-opt-details":
        return (
          <AdditionalOptionalPage
            customerIdentity={customerIdentity ?? ""}
            onFormSubmit={() => handleFormSubmit("additional-opt-details")}
            handleSetConfirmationModalData={handleSetConfirmationModalData}
            confirmationModalData={confirmationModalData}
          />
        );
      case "nominee-details":
        return (
          <NomineePage
            customerIdentity={customerIdentity}
            onFormSubmit={() => handleFormSubmit("nominee-details")}
            onUnsavedChanges={setHasNomineeUnsavedChanges}
            isView={false}
            handleSetConfirmationModalData={handleSetConfirmationModalData}
            confirmationModalData={confirmationModalData}
          />
        );
      case "bank-account-details":
        return (
          <BankAccountDetailsPage
            customerIdentity={customerIdentity}
            onFormSubmit={() => handleFormSubmit("bank-account-details")}
            handleSetConfirmationModalData={handleSetConfirmationModalData}
            confirmationModalData={confirmationModalData}
          />
        );
      case "contact-notification-preferences":
        return (
          <ContactNotificationPage
            customerIdentity={customerIdentity}
            onFormSubmit={() =>
              handleFormSubmit("contact-notification-preferences")
            }
            handleSetConfirmationModalData={handleSetConfirmationModalData}
            confirmationModalData={confirmationModalData}
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
        return (
          <KYCPage
            customerIdentity={customerIdentity}
            handleSetConfirmationModalData={handleSetConfirmationModalData}
            confirmationModalData={confirmationModalData}
          />
        );
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
        navigate(`/customer/management/onboarding/${stepKey}`, {
          replace: true,
        });
        window.scrollTo(0, 0);
      }
    }
  };
  return (
    <FormBaseLayout
      onNext={handleNext}
      canGoPrevious={canGoPrevious}
      currentStepIndex={currentStepIndex}
      canGoNext={canGoNext}
      totalSteps={filteredSteps.length}
      handlePrevious={handlePrevious}
      handleCompleteOnboarding={handleApprove}
      breadcrumbItems={breadcrumbItems}
      steps={getStepsWithCompletion()}
      currentStep={currentStep}
      onStepChange={onStepChange}
      completedSteps={completedSteps}
      showConfirmationRefresh={showConfirmation}
      handleConfirmRefresh={handleConfirmRefresh}
      handleCancelRefresh={handleCancelRefresh}
      confirmationModalData={confirmationModalData}
      handleResetConfirmationModal={handleResetConfirmationModal}
      handleAcceptConfirmationModal={() =>
        handleAcceptConfirmationModal(confirmationModalData)
      }
    >
      <section className="transition-all duration-300">
        {renderStepContent()}
      </section>
      <CompletionModal
        isOpen={isCompletionModalOpen}
        onClose={handleCloseCompletionModal}
        customerIdentity={customerIdentity ?? ""}
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
