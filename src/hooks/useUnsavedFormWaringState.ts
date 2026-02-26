import { useCallback } from "react";
import { useLocation } from "react-router-dom";
import { useAppDispatch } from "./store";
import {
  resetViewFormWarningState,
  setViewFormWarningState,
} from "@/global/reducers/view-form-unsaved-warning.reducer";
import {
  resetFormWarningState,
  setFormWarningState,
} from "@/global/reducers/form-unsaved-warning.reducer";

interface UseCustomerOnboardStateProps {
  isView: boolean;
}

export const useUnsavedFormWaringState = ({
  isView,
}: UseCustomerOnboardStateProps) => {
  const dispatch = useAppDispatch();
  const location = useLocation();

  const handleUpdateState = useCallback(
    (title: string, disableReason: string) => {
      if (isView) {
        dispatch(
          setViewFormWarningState({
            disableNext: true,
            title,
            disableReason,
          })
        );
      } else {
        dispatch(
          setFormWarningState({
            disableNext: true,
            title,
            disableReason,
          })
        );
      }
    },
    [dispatch, isView, location.pathname]
  );

  const handleResetState = useCallback(() => {
    if (isView) {
      dispatch(resetViewFormWarningState());
    } else {
      dispatch(resetFormWarningState());
    }
  }, [dispatch, isView]);

  return {
    handleUpdateState,
    handleResetState,
  };
};
