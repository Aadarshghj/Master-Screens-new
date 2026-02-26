import { useEffect } from "react";
import type { FormState, FieldValues } from "react-hook-form";

export const useFormUnsavedChanges = <T extends FieldValues = FieldValues>(
  formState: FormState<T> | undefined,
  onUnsavedChanges?: (hasChanges: boolean) => void
) => {
  useEffect(() => {
    if (onUnsavedChanges && formState) {
      onUnsavedChanges(formState.isDirty);
    }
  }, [formState?.isDirty, onUnsavedChanges, formState]);
};
