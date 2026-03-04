import {
  Breadcrumb,
  ConfirmationModal,
  Flex,
  Label,
  RefreshConfirmationModal,
  Stepper,
  Textarea,
  type BreadcrumbItem,
} from "@/components";
import { FormDialog } from "@/components/ui/form-dialog";
import NeumorphicButton from "@/components/ui/neumorphic-button/neumorphic-button";
import {
  resetApprovalConfirmationModal,
  setShowApprovalConfirmationModal,
} from "@/global/reducers/approval-confirmation.reducer";
import { resetApprovalView } from "@/global/reducers/approval-workflow/approval-view-modal.reducer";
import {
  resetFormDirtyViewModal,
  setShowFormDirtyViewModal,
} from "@/global/reducers/form-dirty-modal-view.reducer";
import {
  resetFormDirtyModal,
  setShowFormDirtyModal,
} from "@/global/reducers/form-dirty-modal.reducer";
import { resetFormDirtyViewState } from "@/global/reducers/form-dirty-view.reducer";
import { setForward } from "@/global/reducers/form-forward-page.reducer";
import {
  resetViewFormWarningModal,
  setShowViewFormWarningModal,
} from "@/global/reducers/form-warning-modal-view.reducer";
import {
  resetFormWarningModal,
  setShowFormWarningModal,
} from "@/global/reducers/form-warning-modal.reducer";
import { logger } from "@/global/service";
import { useApproveWorkflowMutation } from "@/global/service/end-points/approval-workflow/approval-queue";
import type { RootState } from "@/global/store";
import { useAppDispatch, useAppSelector } from "@/hooks/store";
import { useFormDirtyState } from "@/hooks/useFormDirtyState";
import type { Step } from "@/types";
import {
  CircleCheck,
  CircleChevronLeft,
  CircleChevronRight,
  CircleX,
  Undo2,
} from "lucide-react";
import { useState, type FC, type ReactNode } from "react";
export interface ConfirmationModalData {
  show: boolean | null;
  title: string | null;
  description: string | null;
  confirmText: string | null;
  cancelText: string | null;
  feature: null | "RESET" | "APPROVE" | "EDIT";
  doAction: boolean | null;
}
export interface CustomerOnboardingFooterProps {
  canGoPrevious: boolean;
  canGoNext: boolean;
  currentStepIndex: number;
  totalSteps: number;
  onPrevious: () => void;
  onNext: () => void;
  className?: string;
  onCompleteSteps?: () => void;
  isView?: boolean;
  footerClassName?: string;
  readOnly?: boolean;
  approvalScreen?: boolean;
  hideSendForApproval?: boolean;
}

const Footer: React.FC<CustomerOnboardingFooterProps> = ({
  canGoPrevious,
  canGoNext,
  currentStepIndex,
  totalSteps,
  onPrevious,
  onNext,
  onCompleteSteps,
  isView = false,
  readOnly = false,
  approvalScreen = false,
  hideSendForApproval,
}) => {
  const dispatch = useAppDispatch();
  const [approveWorkflow, { isLoading }] = useApproveWorkflowMutation();
  const { disableNext } = useAppSelector((state: RootState) =>
    isView ? state.viewFormDisableNext : state.formDisableNext
  );
  const { showFormDirtyModal } = useAppSelector((state: RootState) =>
    isView ? state.formDirtyViewModal : state.formDirtyModal
  );
  const { showConfirmationModal, instanceIdentity, action } = useAppSelector(
    (state: RootState) => state.approvalConfirmationModal
  );
  const [remark, setRemark] = useState("");
  const {
    disableNext: disableNextFormDirty,
    title: titleFormDirty,
    disableReason: disableReasonFormDirty,
  } = useAppSelector((state: RootState) =>
    isView ? state.viewformDirty : state.formDirty
  );
  const { handleResetFormDirtyState } = useFormDirtyState({
    isView,
  });

  const handleNext = () => {
    if (disableNextFormDirty && !readOnly) {
      dispatch(
        isView ? setShowFormDirtyViewModal(true) : setShowFormDirtyModal(true)
      );
      return;
    } else if (disableNext && !readOnly) {
      if (isView) {
        dispatch(setShowViewFormWarningModal(true));
      } else {
        dispatch(setShowFormWarningModal(true));
      }
      return;
    }
    onNext();
  };

  const handleCloseFormDirtyModal = () => {
    dispatch(isView ? resetFormDirtyViewModal() : resetFormDirtyModal());
  };
  const handleFormDirtyNext = () => {
    handleResetFormDirtyState();
    dispatch(isView ? resetFormDirtyViewModal() : resetFormDirtyModal());
    if (disableNext) {
      if (isView) {
        dispatch(setShowViewFormWarningModal(true));
      } else {
        dispatch(setShowFormWarningModal(true));
      }
      return;
    }
    onNext();
  };
  const handleCloseApprovalModal = () => {
    dispatch(resetApprovalConfirmationModal());
  };
  const handleApproveAction = (action: string) => {
    dispatch(
      setShowApprovalConfirmationModal({
        action,
        showConfirmationModal: true,
        instanceIdentity,
      })
    );
  };
  const approvalModalType = [
    { type: "success", action: "APPROVED" },
    { type: "error", action: "REJECTED" },
    { type: "info", action: "SENDBACK" },
  ] as const;

  const viewModalType = approvalModalType.find(item => item.action === action);
  const handleConfirmApproval = async () => {
    if (!instanceIdentity || !action) return;

    try {
      const payload = {
        instanceIdentity,
        action,
        remarks: remark,
      };
      await approveWorkflow(payload).unwrap();
      setRemark("");
      logger.info(`${viewModalType?.action.toLocaleLowerCase()} successfully`, {
        toast: true,
        pushLog: false,
      });
      dispatch(resetApprovalConfirmationModal());
      dispatch(resetApprovalView());
    } catch (error) {
      logger.error(error);
      logger.info("Approval status change failed", {
        toast: true,
        pushLog: false,
      });
    }
  };

  return (
    <footer
      className={`bg-background  ${isView ? "absolute right-0 bottom-0 w-full overflow-hidden rounded-lg px-5 pb-4" : "mt-4"}`}
    >
      <ConfirmationModal
        isOpen={showFormDirtyModal}
        onConfirm={handleFormDirtyNext}
        title={titleFormDirty ?? "Unsaved Changes"}
        message={disableReasonFormDirty ?? ""}
        confirmText="Continue to next page"
        cancelText="OK"
        onCancel={handleCloseFormDirtyModal}
        type="warning"
        size="compact"
      />
      <FormDialog
        isOpen={showConfirmationModal}
        title="Confirm"
        message="Are you sure you want to continue?"
        type={viewModalType?.type}
        onCancel={handleCloseApprovalModal}
        onConfirm={handleConfirmApproval}
        confirmText={isLoading ? "Processing..." : "Confirm"}
        size="compact"
      >
        <Label>Remarks</Label>
        <Textarea
          onChange={e => setRemark(e.target.value)}
          placeholder=""
          rows={3}
          size="form"
          variant="form"
        />
      </FormDialog>
      <div className="flex items-center justify-between pt-2">
        <div className="flex">
          <NeumorphicButton
            variant="primary"
            size="primary"
            onClick={onPrevious}
            disabled={!canGoPrevious}
            className="h-[35px] pr-4 pl-1"
          >
            <CircleChevronLeft fill="#64B7CC" strokeWidth={1} />
            Previous
          </NeumorphicButton>
        </div>
        <div className="flex space-x-4">
          {currentStepIndex === totalSteps - 1 ? (
            approvalScreen ? (
              <Flex align="center">
                <NeumorphicButton
                  type="submit"
                  variant="default"
                  size="default"
                  onClick={() => handleApproveAction("REJECTED")}
                  className="h-9 bg-red-900 px-5"
                >
                  <CircleX width={14} />
                  Reject
                </NeumorphicButton>
                <NeumorphicButton
                  type="submit"
                  variant="default"
                  size="default"
                  onClick={() => handleApproveAction("APPROVED")}
                  className="h-9 bg-green-950 px-5"
                >
                  <CircleCheck width={14} />
                  Approve
                </NeumorphicButton>
                <NeumorphicButton
                  type="submit"
                  variant="default"
                  size="default"
                  onClick={() => handleApproveAction("SENDBACK")}
                  className="h-9 bg-cyan-400 px-5"
                >
                  <Undo2 width={14} />
                  Send Back
                </NeumorphicButton>
              </Flex>
            ) : (
              <div className="inline-block">
                {!hideSendForApproval && (
                  <NeumorphicButton
                    type="submit"
                    variant="default"
                    size="default"
                    onClick={onCompleteSteps}
                    className="h-9 px-5"
                    disabled={!canGoNext}
                  >
                    <CircleCheck width={14} />
                    Send For Approval
                  </NeumorphicButton>
                )}
              </div>
            )
          ) : (
            <NeumorphicButton
              variant="primary"
              size="primary"
              onClick={handleNext}
              disabled={!canGoNext}
              className="h-[35px] pr-1 pl-4 "
            >
              Next
              <CircleChevronRight fill="#64B7CC" strokeWidth={1} />
            </NeumorphicButton>
          )}
        </div>
      </div>
    </footer>
  );
};

interface PageProps {
  canGoPrevious: boolean;
  canGoNext: boolean;
  currentStepIndex: number;
  totalSteps: number;
  handlePrevious: () => void;
  onNext: () => void;
  handleCompleteOnboarding?: () => void;
  breadcrumbItems?: BreadcrumbItem[];
  steps: Step[];
  currentStep: string;
  onStepChange?: (stepKey: string) => void;
  stepperClassName?: string;
  stepperVariant?: "default" | "compact";
  completedSteps?: Set<string>;
  children: ReactNode;
  showConfirmationRefresh?: boolean;
  handleConfirmRefresh?: () => void;
  handleCancelRefresh?: () => void;
  isView?: boolean;
  wrapperClassName?: string;
  readOnly?: boolean;
  approvalScreen?: boolean;
  hideSendForApproval?: boolean;
  customerCreationMode?: boolean;
  confirmationModalData?: ConfirmationModalData;
  handleResetConfirmationModal?: () => void;
  handleAcceptConfirmationModal?: () => void;
}
const FormBaseLayout: FC<PageProps> = ({
  onNext,
  canGoPrevious,
  currentStepIndex,
  canGoNext,
  totalSteps,
  handlePrevious,
  handleCompleteOnboarding,
  breadcrumbItems,
  steps,
  currentStep,
  onStepChange,
  stepperClassName,
  completedSteps,
  stepperVariant,
  children,
  showConfirmationRefresh,
  handleConfirmRefresh,
  handleCancelRefresh,
  isView = false,
  wrapperClassName,
  readOnly = false,
  approvalScreen = false,
  hideSendForApproval = false,
  customerCreationMode = false,
  confirmationModalData,
  handleResetConfirmationModal,
  handleAcceptConfirmationModal,
}) => {
  const dispatch = useAppDispatch();
  const { disableNext, title, disableReason } = useAppSelector(
    (state: RootState) =>
      isView ? state.viewFormDisableNext : state.formDisableNext
  );
  const { showFormDirtyModal } = useAppSelector(
    (state: RootState) => state.formDirtyModal
  );

  const { showFormWarningModal } = useAppSelector((state: RootState) =>
    isView ? state.viewFormWarningModal : state.formWarningModal
  );
  const {
    disableNext: disableNextFormDirty,
    title: titleFormDirty,
    disableReason: disableReasonFormDirty,
  } = useAppSelector((state: RootState) => state.formDirty);
  const { handleResetFormDirtyState } = useFormDirtyState({
    isView,
  });

  const handleCloseWarningModal = () => {
    dispatch(isView ? resetViewFormWarningModal() : resetFormWarningModal());
  };
  const handleCloseFormDirtyModal = () => {
    dispatch(isView ? resetFormDirtyViewState() : resetFormDirtyModal());
  };
  const handleFormDirtyNext = () => {
    handleResetFormDirtyState();
    dispatch(isView ? resetFormDirtyViewState() : resetFormDirtyModal());
    dispatch(setForward(true));
    if (disableNext) {
      if (isView) {
        dispatch(setShowViewFormWarningModal(true));
      } else {
        dispatch(setShowFormWarningModal(true));
      }
      return;
    }
    onNext();
  };
  const handleNext = () => {
    if (disableNextFormDirty && !readOnly) {
      dispatch(
        isView ? setShowFormDirtyViewModal(true) : setShowFormDirtyModal(true)
      );
      return;
    } else if (disableNext && !readOnly) {
      if (isView) {
        dispatch(setShowFormWarningModal(true));
      } else {
        dispatch(setShowViewFormWarningModal(true));
      }
      return;
    }
    onNext();
  };

  return (
    <main className={wrapperClassName ?? ""}>
      <ConfirmationModal
        isOpen={confirmationModalData?.show ?? false}
        onConfirm={handleAcceptConfirmationModal}
        title={confirmationModalData?.title ?? ""}
        message={confirmationModalData?.description ?? ""}
        confirmText={confirmationModalData?.confirmText ?? ""}
        cancelText={confirmationModalData?.cancelText ?? ""}
        onCancel={handleResetConfirmationModal}
        type="warning"
        size="compact"
      />
      <ConfirmationModal
        isOpen={showFormWarningModal}
        onConfirm={handleCloseWarningModal}
        title={title ?? "Unsaved Changes"}
        message={disableReason ?? ""}
        confirmText="OK"
        type="warning"
        size="compact"
      />
      <ConfirmationModal
        isOpen={showFormDirtyModal}
        onConfirm={handleFormDirtyNext}
        title={titleFormDirty ?? "Unsaved Changes"}
        message={disableReasonFormDirty ?? ""}
        confirmText="Continue to next page"
        cancelText="OK"
        onCancel={handleCloseFormDirtyModal}
        type="warning"
        size="compact"
      />
      <div className="space-y-6">
        {!isView && breadcrumbItems && (
          <section>
            <Breadcrumb items={breadcrumbItems} variant="default" size="sm" />
          </section>
        )}
        <section className={customerCreationMode ? "pt-3" : ""}>
          <Stepper
            steps={steps}
            currentStep={currentStep}
            onStepChange={onStepChange}
            className={stepperClassName}
            completedSteps={completedSteps}
            variant={stepperVariant}
          />
        </section>
        <section className="transition-all duration-300">{children}</section>
        <Footer
          canGoPrevious={canGoPrevious}
          canGoNext={canGoNext}
          currentStepIndex={currentStepIndex}
          totalSteps={totalSteps}
          onPrevious={handlePrevious}
          onNext={handleNext}
          onCompleteSteps={handleCompleteOnboarding}
          isView={isView}
          readOnly={readOnly}
          approvalScreen={approvalScreen}
          hideSendForApproval={hideSendForApproval}
        />
      </div>
      {handleConfirmRefresh && handleCancelRefresh && (
        <RefreshConfirmationModal
          isOpen={showConfirmationRefresh ?? false}
          onConfirm={handleConfirmRefresh}
          onCancel={handleCancelRefresh}
        />
      )}
    </main>
  );
};

export default FormBaseLayout;
