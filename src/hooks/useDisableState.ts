import { useCallback } from "react";
import { useLocation } from "react-router-dom";
import { useAppDispatch } from "./store";
import {
  resetDisableNextState,
  setDisableNextState,
} from "@/global/reducers/form-disable-next.reducer";
import {
  resetViewDisableNextState,
  setViewDisableNextState,
} from "@/global/reducers/form-disable-next.-view-reducer";

interface UseCustomerOnboardStateProps {
  isView: boolean;
}

export const useDisableState = ({ isView }: UseCustomerOnboardStateProps) => {
  const dispatch = useAppDispatch();
  const location = useLocation();

  const handleUpdateState = useCallback(
    (title: string, disableReason: string) => {
      if (isView) {
        dispatch(
          setViewDisableNextState({
            disableNext: true,
            title,
            disableReason,
          })
        );
      } else {
        dispatch(
          setDisableNextState({
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
      dispatch(resetViewDisableNextState());
    } else {
      dispatch(resetDisableNextState());
    }
  }, [dispatch, isView]);

  return {
    handleUpdateState,
    handleResetState,
  };
};
