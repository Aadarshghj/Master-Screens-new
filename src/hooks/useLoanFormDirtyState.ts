import { useCallback } from "react";
import { useLocation } from "react-router-dom";
import { useAppDispatch } from "./store";
import {
  resetLoanFormDirtyState,
  setLoanFormDirtyState,
} from "@/global/reducers/loan-stepper/loan-form-dirty.reducer";

export const useLoanFormDirtyState = () => {
  const dispatch = useAppDispatch();
  const location = useLocation();

  const handleUpdateFormDirtyState = useCallback(() => {
    dispatch(
      setLoanFormDirtyState({
        disableNext: true,
        title: "Unsaved Changes",
        disableReason:
          "Some changes were detected. Save your updates or proceed to the next page.",
      })
    );
  }, [dispatch, location.pathname]);

  const handleResetFormDirtyState = useCallback(() => {
    dispatch(resetLoanFormDirtyState());
  }, [dispatch]);

  return {
    handleUpdateFormDirtyState,
    handleResetFormDirtyState,
  };
};
