import { useState, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useAppSelector } from "@/hooks/store";
import { logger } from "@/global/service";
import {
  useGetLoanSchemePropertyValuesQuery,
  useCreateLoanSchemePropertyValuesMutation,
  useUpdateLoanSchemePropertyValuesMutation,
  useGetGLAccountsQuery,
} from "@/global/service/end-points/loan-product-and-scheme/loan-scheme-property-values";
import type {
  AssignPropertyFormData,
  PropertyValue,
  PropertyValueItem,
  LoanSchemePropertyValueRequest,
  GLAccountItem,
} from "@/types/loan-product-and schema Stepper/assign-property.types";
import { assignPropertyDefaultFormValues } from "../../constants/form.constants";
import { assignPropertyValidationSchema } from "@/global/validation/loan-product-and-scheme/loanPropertyValue";

export const useAssignProperty = () => {
  const { currentSchemeId, currentSchemeName } = useAppSelector(
    state => state.loanProduct
  );

  const [tableData, setTableData] = useState<PropertyValue[]>([]);
  const [hasBeenSaved, setHasBeenSaved] = useState(false);
  const [touchedFields, setTouchedFields] = useState<Set<number>>(new Set());

  const { data: propertyValuesData, refetch: refetchPropertyValues } =
    useGetLoanSchemePropertyValuesQuery(currentSchemeId || "", {
      skip: !currentSchemeId,
    });

  const { data: glAccounts } = useGetGLAccountsQuery("");
  const [createPropertyValues] = useCreateLoanSchemePropertyValuesMutation();
  const [updatePropertyValues] = useUpdateLoanSchemePropertyValuesMutation();

  const {
    control,
    handleSubmit,
    reset,
    formState,
    formState: { errors },
  } = useForm<AssignPropertyFormData>({
    defaultValues: assignPropertyDefaultFormValues,
    resolver: yupResolver(assignPropertyValidationSchema),
    mode: "onChange",
  });

  useEffect(() => {
    if (propertyValuesData) {
      reset({
        loanSchemeName:
          propertyValuesData.schemeName || currentSchemeName || "",
      });
    } else if (currentSchemeName) {
      // If no property data but we have scheme name from Redux, use it
      reset({
        loanSchemeName: currentSchemeName,
      });
    }
  }, [propertyValuesData, currentSchemeName, reset]);

  useEffect(() => {
    if (propertyValuesData?.propertyValues) {
      const mappedData: PropertyValue[] = propertyValuesData.propertyValues.map(
        (item: PropertyValueItem) => ({
          loanScheme: propertyValuesData.schemeName || "",
          propertyKey: item.propertyKey || "",
          defaultValue: item.defaultValue || "",
          propertyValue: item.propertyValue || String(item.defaultValue || ""),
          glAccountId: item.glAccountIdentity || "", // Use glAccountIdentity for the UUID
          glAccountName: item.glAccountName || "",
          status: item.isActive ?? false,
        })
      );

      setTableData(mappedData);
      setHasBeenSaved(
        propertyValuesData.propertyValues.some(
          (item: PropertyValueItem) => item.identity
        )
      );
      setTouchedFields(new Set());
    }
  }, [propertyValuesData]);

  const handlePropertyValueChange = useCallback(
    (index: number, value: string) => {
      setTouchedFields(prev => new Set(prev).add(index));
      setTableData(prev => {
        const updatedData = [...prev];
        updatedData[index].propertyValue = value;
        return updatedData;
      });
    },
    []
  );

  const handleGLAccountChange = useCallback(
    (index: number, glAccountId: string) => {
      setTouchedFields(prev => new Set(prev).add(index));
      const selectedAccount = glAccounts?.find(
        account => account.identity === glAccountId
      );

      setTableData(prev => {
        const updatedData = [...prev];
        updatedData[index].glAccountId = glAccountId;
        updatedData[index].glAccountName = selectedAccount?.glName || "";
        return updatedData;
      });
    },
    [glAccounts]
  );

  const handleGLAccountNameChange = useCallback(
    (index: number, glAccountName: string) => {
      setTouchedFields(prev => new Set(prev).add(index));
      setTableData(prev => {
        const updatedData = [...prev];
        updatedData[index].glAccountName = glAccountName;
        // Clear the ID when typing manually
        if (glAccountName !== updatedData[index].glAccountName) {
          updatedData[index].glAccountId = "";
        }
        return updatedData;
      });
    },
    []
  );

  const handleStatusChange = useCallback((index: number, checked: boolean) => {
    setTouchedFields(prev => new Set(prev).add(index));
    setTableData(prev => {
      const updatedData = [...prev];
      updatedData[index].status = checked;
      return updatedData;
    });
  }, []);

  const onSubmit = async (onSave?: () => void, onComplete?: () => void) => {
    try {
      if (!currentSchemeId) {
        logger.error("No scheme ID available", { toast: true });
        return;
      }

      // Filter and validate payload - only include properties that have values or are active
      const payload: LoanSchemePropertyValueRequest[] = tableData
        .map((item, index) => {
          const originalItem = propertyValuesData?.propertyValues?.[index];
          return {
            propertyIdentity: originalItem?.propertyIdentity || "",
            propertyValue: item.propertyValue || "0", // Default to "0" if empty
            glAccountIdentity: item.glAccountId || "", // glAccountId now contains the UUID
            isActive: item.status,
          };
        })
        .filter(item => item.propertyIdentity);

      if (payload.length === 0) {
        logger.error("No valid property values to save", { toast: true });
        return;
      }

      if (hasBeenSaved) {
        await updatePropertyValues({
          schemeIdentity: currentSchemeId,
          payload,
        }).unwrap();
        logger.info("Property values updated successfully", { toast: true });
      } else {
        await createPropertyValues({
          schemeIdentity: currentSchemeId,
          payload,
        }).unwrap();
        logger.info("Property values created successfully", { toast: true });
      }

      setHasBeenSaved(true);
      setTouchedFields(new Set());
      await refetchPropertyValues();

      if (onSave) onSave();
      if (onComplete) onComplete();
    } catch (error) {
      const apiError = error as {
        data?: { serviceCode?: string; message?: string };
      };
      let errorMessage = "Failed to save property values";

      if (apiError.data?.serviceCode === "MONO-001") {
        errorMessage =
          "Service is currently unavailable. Please try again later.";
      } else if (apiError.data?.message) {
        errorMessage = apiError.data.message;
      }

      logger.error(errorMessage, { toast: true });
    }
  };

  const glAccountOptions: GLAccountItem[] = glAccounts || [];

  return {
    control,
    handleSubmit,
    errors,
    tableData,
    touchedFields,
    glAccountOptions,
    handlePropertyValueChange,
    handleGLAccountChange,
    handleGLAccountNameChange,
    handleStatusChange,
    onSubmit,
    formState,
    hasUnsavedChanges: touchedFields.size > 0,
    hasBeenSaved,
  };
};
