import { useCallback } from "react";
import { useLocation } from "react-router-dom";
import { useAppDispatch } from "./store";
import {
  resetFormDirtyViewState,
  setFormDirtyViewState,
} from "@/global/reducers/form-dirty-view.reducer";
import {
  resetFormDirtyState,
  setFormDirtyState,
} from "@/global/reducers/form-dirty.reducer";

interface UseFormDirtyProps {
  isView: boolean;
}

export const useFormDirtyState = ({ isView }: UseFormDirtyProps) => {
  const dispatch = useAppDispatch();
  const location = useLocation();

  const handleUpdateFormDirtyState = useCallback(() => {
    if (isView) {
      dispatch(
        setFormDirtyViewState({
          disableNext: true,
          title: "Unsaved Changes",
          disableReason:
            "Some changes were detected. Save your updates or proceed to the next page.",
        })
      );
    } else {
      dispatch(
        setFormDirtyState({
          disableNext: true,
          title: "Unsaved Changes",
          disableReason:
            "Some changes were detected. Save your updates or proceed to the next page.",
        })
      );
    }
  }, [dispatch, isView, location.pathname]);

  const handleResetFormDirtyState = useCallback(() => {
    if (isView) {
      dispatch(resetFormDirtyViewState());
    } else {
      dispatch(resetFormDirtyState());
    }
  }, [dispatch, isView]);

  return {
    handleUpdateFormDirtyState,
    handleResetFormDirtyState,
  };
};
