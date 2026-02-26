import { useCallback, useState, useEffect, type FC } from "react";
import {
  logger,
  useGetCustomerAllDetailsQuery,
  useModifyCustomerStatusMutation,
} from "@/global/service";
import { KYCPage } from "../kyc-document";
import { BasicInformationForm } from "../basic-information";
import { PhotoLivelinessPage } from "../photo-liveliness";
import { AddressDetails } from "../address-details";
import { AdditionalOptionalPage } from "../additional-optional-details";
import { NomineePage } from "../nominee-details";
import { BankAccountDetailsPage } from "../bank-account-details";
import { ContactNotificationPage } from "../contact-notification";
import { Form60Page } from "../form-60";
import { CompletionModal } from "../components/Modal/CompletionModal";
import type { RootState } from "@/global/store";
import { useAppDispatch, useAppSelector } from "@/hooks/store";
import { onboardingSteps } from "../constants/page-constants";
import FormBaseLayout from "@/layout/BasePageLayout";
import { getStepLabel } from "../helper/page-helper";
import { useNavigate } from "react-router-dom";
import type { BreadcrumbItem } from "@/components";
import { setShowViewFormWarningModal } from "@/global/reducers/form-warning-modal-view.reducer";
import { setShowFormDirtyViewModal } from "@/global/reducers/form-dirty-modal-view.reducer";
import { pendingApproval } from "@/const/common-codes.const";

const getCurrentStep = (pathname: string): string => {
  const segments = pathname.split("/").filter(Boolean);
  const lastSegment = segments[segments.length - 1];

  if (lastSegment === "onboarding") {
    return "kyc-document";
  }

  return lastSegment;
};

interface OnboardingViewProps {
  customerIdentity: string;
  readOnly?: boolean;
  approvalScreen?: boolean;
}
export const OnboardingView: FC<OnboardingViewProps> = ({
  customerIdentity,
  readOnly = false,
  approvalScreen = false,
}) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [step, setStep] = useState("kyc-document");
  const { isPanDetailsSubmit } = useAppSelector(
    (state: RootState) => state.panDetailsView
  );
  const { data: customerAllDetails } = useGetCustomerAllDetailsQuery(
    { customerId: customerIdentity },
    {
      skip: !customerIdentity,
      refetchOnMountOrArgChange: true,
    }
  );
  const customerStatus =
    customerAllDetails?.onboardingStatus === pendingApproval;

  const {
    customerFirstName,
    customerLastName,
    customerMiddleName,
    mobileNumber,
  } = useAppSelector((state: RootState) => state.customerData);
  const [modifyCustomerStatus] = useModifyCustomerStatusMutation();
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set());
  const [isCompletionModalOpen, setIsCompletionModalOpen] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [hasNomineeUnsavedChanges, setHasNomineeUnsavedChanges] =
    useState(false);
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
  const { disableNext } = useAppSelector(
    (state: RootState) => state.viewUnsavedformWarning
  );
  const { disableNext: disableNextFormDirty } = useAppSelector(
    (state: RootState) => state.viewformDirty
  );
  const { forward } = useAppSelector((state: RootState) => state.formForward);
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

  const renderStepContent = () => {
    switch (currentStep) {
      case "kyc-document":
        return (
          <KYCPage
            isView
            customerIdentity={customerIdentity}
            onFormSubmit={() => handleFormSubmit("kyc-document")}
            readOnly={readOnly || customerStatus}
          />
        );
      case "basic-information":
        return (
          <BasicInformationForm
            isView
            customerIdentity={customerIdentity}
            onFormSubmit={async () => handleFormSubmit("basic-information")}
            customerFirstName={customerFirstName}
            customerLastName={customerLastName}
            customerMiddleName={customerMiddleName}
            mobileNumber={mobileNumber}
            readOnly={readOnly || customerStatus}
          />
        );
      case "photo-liveness":
        return (
          <PhotoLivelinessPage
            isView
            customerIdentity={customerIdentity}
            onFormSubmit={async () => handleFormSubmit("photo-liveness")}
            readOnly={readOnly || customerStatus}
          />
        );
      case "address-details":
        return (
          <AddressDetails
            isView
            customerIdentity={customerIdentity}
            onFormSubmit={() => handleFormSubmit("address-details")}
            onUnsavedChanges={setHasUnsavedChanges}
            readOnly={readOnly || customerStatus}
          />
        );
      case "additional-opt-details":
        return (
          <AdditionalOptionalPage
            isView
            customerIdentity={customerIdentity || undefined}
            onFormSubmit={() => handleFormSubmit("additional-opt-details")}
            readOnly={readOnly || customerStatus}
          />
        );
      case "nominee-details":
        return (
          <NomineePage
            customerIdentity={customerIdentity}
            onFormSubmit={() => handleFormSubmit("nominee-details")}
            onUnsavedChanges={setHasNomineeUnsavedChanges}
            isView
            readOnly={readOnly || customerStatus}
            pendingForApproval={customerStatus}
          />
        );
      case "bank-account-details":
        return (
          <BankAccountDetailsPage
            customerIdentity={customerIdentity}
            onFormSubmit={() => handleFormSubmit("bank-account-details")}
            isView
            readOnly={readOnly || customerStatus}
            pendingForApproval={customerStatus}
          />
        );
      case "contact-notification-preferences":
        return (
          <ContactNotificationPage
            customerIdentity={customerIdentity}
            onFormSubmit={() =>
              handleFormSubmit("contact-notification-preferences")
            }
            isView
            readOnly={readOnly || customerStatus}
          />
        );
      case "form60":
        return (
          <Form60Page
            customerIdentity={customerIdentity}
            onFormSubmit={() => handleFormSubmit("form60")}
            readOnly={readOnly || customerStatus}
          />
        );
      default:
        return (
          <KYCPage
            isView
            customerIdentity={customerIdentity}
            onFormSubmit={() => handleFormSubmit("kyc-document")}
            readOnly={readOnly || customerStatus}
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
  const onStepChange = (stepKey: string) => {
    if (readOnly) {
      setStep(stepKey);
      window.scrollTo(0, 0);
      return;
    }
    const targetStepIndex = filteredSteps.findIndex(
      step => step.key === stepKey
    );
    const currentStepIndex = filteredSteps.findIndex(
      step => step.key === currentStep
    );
    const isPreviousStep = targetStepIndex < currentStepIndex;

    if (disableNextFormDirty && !forward) {
      dispatch(setShowFormDirtyViewModal(true));
      return;
    } else if (disableNext && !isPreviousStep) {
      dispatch(setShowViewFormWarningModal(true));
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
  return (
    <FormBaseLayout
      onNext={handleNext}
      canGoPrevious={canGoPrevious}
      currentStepIndex={currentStepIndex}
      canGoNext={canGoNext}
      totalSteps={filteredSteps.length}
      handlePrevious={handlePrevious}
      handleCompleteOnboarding={handleCompleteOnboarding}
      breadcrumbItems={breadcrumbItems}
      steps={getStepsWithCompletion()}
      currentStep={currentStep}
      onStepChange={onStepChange}
      completedSteps={completedSteps}
      isView={true}
      wrapperClassName="px-2 md:px-4 lg:px-8 py-6"
      readOnly={readOnly}
      approvalScreen={approvalScreen}
      hideSendForApproval={customerStatus}
    >
      <section className="max-h-[65vh] overflow-scroll pb-8 transition-all duration-300">
        {renderStepContent()}
      </section>
      <CompletionModal
        isOpen={isCompletionModalOpen}
        onClose={handleCloseCompletionModal}
        customerIdentity={customerIdentity}
      />
    </FormBaseLayout>
  );
};
