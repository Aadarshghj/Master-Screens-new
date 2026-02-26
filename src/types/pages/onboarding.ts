export interface CustomerOnboardingFooterProps {
  canGoPrevious: boolean;
  canGoNext: boolean;
  currentStepIndex: number;
  totalSteps: number;
  onPrevious: () => void;
  onNext: () => void;
  className?: string;
}
