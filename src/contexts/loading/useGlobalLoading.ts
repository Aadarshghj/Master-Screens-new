import { useContext } from "react";
import {
  GlobalLoadingContext,
  type GlobalLoadingContextType,
} from "./LoadingContext";

export const useGlobalLoading = (): GlobalLoadingContextType => {
  const ctx = useContext(GlobalLoadingContext);

  if (!ctx) {
    throw new Error("useGlobalLoading must be used within a LoadingProvider");
  }

  return ctx;
};
