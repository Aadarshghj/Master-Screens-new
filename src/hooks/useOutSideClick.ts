import { useEffect } from "react";

const useOutSideClick = ({
  targetClassName,
  actionState,
  outSideClickCallback,
}: {
  targetClassName: string; // give the className as string with prefix "."
  actionState: boolean;
  outSideClickCallback: () => void;
}) => {
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;

      if (!target.closest(targetClassName)) {
        outSideClickCallback();
      }
    };

    if (actionState) {
      document.addEventListener("click", handleOutsideClick);
    }

    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, [actionState, targetClassName, outSideClickCallback]);

  return null;
};

export default useOutSideClick;
