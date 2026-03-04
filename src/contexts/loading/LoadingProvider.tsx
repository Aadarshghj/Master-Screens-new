import React, { useCallback, useRef, useState } from "react";
import { GlobalLoadingContext } from "./LoadingContext";
import { Loading } from "@/components/ui/loading/loading";

type LoadingStackItem = {
  id: number;
  message?: string;
};

export const LoadingProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [stack, setStack] = useState<LoadingStackItem[]>([]);
  const counterRef = useRef(0);

  const show = useCallback((message?: string) => {
    const id = ++counterRef.current;
    setStack(prev => [...prev, { id, message }]);
    return id;
  }, []);

  const hide = useCallback((id: number) => {
    setStack(prev => prev.filter(item => item.id !== id));
  }, []);

  const withLoading = useCallback(
    async <T,>(fn: () => Promise<T>, message?: string) => {
      const id = show(message);
      try {
        return await fn();
      } finally {
        hide(id);
      }
    },
    [show, hide]
  );

  const currentMessage =
    stack.length > 0 ? stack[stack.length - 1].message || "" : "";

  return (
    <GlobalLoadingContext.Provider value={{ show, hide, withLoading }}>
      {children}
      <Loading
        isOpen={stack.length > 0}
        loader={currentMessage || "Loading..."}
      />
    </GlobalLoadingContext.Provider>
  );
};
