import { createContext } from "react";

export type GlobalLoadingContextType = {
  show: (message?: string) => number;
  hide: (id: number) => void;
  withLoading: <T>(fn: () => Promise<T>, message?: string) => Promise<T>;
};

export const GlobalLoadingContext = createContext<
  GlobalLoadingContextType | undefined
>(undefined);
