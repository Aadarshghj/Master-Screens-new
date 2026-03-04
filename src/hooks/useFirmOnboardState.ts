import { useCallback } from "react";
import { useLocation } from "react-router-dom";
import { useAppDispatch } from "./store";

import { setFirmOnboardState } from "@/global/reducers/firm/firmOnboarding.reducer";

export const useFirmOnboardState = () => {
  const dispatch = useAppDispatch();
  const location = useLocation();

  const handleUpdateState = useCallback(
    (title: string, disableReason: string) => {
      dispatch(
        setFirmOnboardState({
          disableNext: true,
          title,
          disableReason,
          currentPath: location.pathname,
        })
      );
    },
    [dispatch, location.pathname]
  );

  // const handleResetState = useCallback(() => {
  //   dispatch(resetOnboarding());
  // }, [dispatch]);

  const handleResetState = useCallback(() => {
    dispatch(
      setFirmOnboardState({
        disableNext: false,
        title: null,
        disableReason: null,
        currentPath: location.pathname,
      })
    );
  }, [dispatch, location.pathname]);

  return {
    handleUpdateState,
    handleResetState,
  };
};
