import { useCallback } from "react";
import { useLocation } from "react-router-dom";
import {
  setCustomerOnboardViewState,
  resetCustomerOnboardViewState,
} from "@/global/reducers/customer/customer-onboard-view.reducer";
import {
  resetCustomerOnboardState,
  setCustomerOnboardState,
} from "@/global/reducers/customer/customer-onboard.reducer";
import { useAppDispatch } from "./store";

interface UseCustomerOnboardStateProps {
  isView: boolean;
}

export const useCustomerOnboardState = ({
  isView,
}: UseCustomerOnboardStateProps) => {
  const dispatch = useAppDispatch();
  const location = useLocation();

  const handleUpdateState = useCallback(
    (title: string, disableReason: string) => {
      if (isView) {
        dispatch(
          setCustomerOnboardViewState({
            disableNext: true,
            title,
            disableReason,
          })
        );
      } else {
        dispatch(
          setCustomerOnboardState({
            disableNext: true,
            title,
            disableReason,
            currentPath: location.pathname,
          })
        );
      }
    },
    [dispatch, isView, location.pathname]
  );

  const handleResetState = useCallback(() => {
    if (isView) {
      dispatch(resetCustomerOnboardViewState());
    } else {
      dispatch(resetCustomerOnboardState());
    }
  }, [dispatch, isView]);

  return {
    handleUpdateState,
    handleResetState,
  };
};
