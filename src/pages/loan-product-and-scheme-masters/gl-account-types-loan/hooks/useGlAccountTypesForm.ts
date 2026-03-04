import { useState, useEffect, useMemo, useCallback } from "react";
import { logger } from "@/global/service";
import type {
  GLAccountTypeData,
  GLAccountTypeMutationPayload,
} from "@/types/loan-product-and-scheme-masters/gl-account-types.types";
import {
  useGetGLAccountTypesQuery,
  useSaveGLAccountTypesMutation,
  useUpdateGLAccountTypesMutation,
} from "@/global/service/end-points/loan-product-and-service-masters/gl-account-types";

interface UseGLAccountTypesFormProps {
  readonly?: boolean;
}

interface UseGLAccountTypesFormReturn {
  isTableOpen: boolean;
  glAccountTypesData: GLAccountTypeData[];
  isInitialState: boolean;

  allEntriesHaveGLAccount: boolean;
  hasAnyEdits: boolean;
  isSaveEnabled: boolean;
  isProcessing: boolean;
  isLoadingTable: boolean;

  setIsTableOpen: (open: boolean) => void;
  handleUpdateGLAccount: (
    glAccountTypeId: string,
    glAccountId: string | null,
    glAccountName: string | null
  ) => void;
  handleToggleActive: (glAccountTypeId: string) => void;
  handleReset: () => void;
  handleSave: () => Promise<void>;
}

export const useGLAccountTypesForm = ({
  readonly = false,
}: UseGLAccountTypesFormProps = {}): UseGLAccountTypesFormReturn => {
  const [isTableOpen, setIsTableOpen] = useState(false);
  const [glAccountTypesData, setGLAccountTypesData] = useState<
    GLAccountTypeData[]
  >([]);
  const [isInitialState, setIsInitialState] = useState(true);

  const {
    data: apiData,
    isLoading: isLoadingTable,
    refetch,
  } = useGetGLAccountTypesQuery(undefined, {
    skip: !isTableOpen,
  });

  const [saveGLAccountTypes, { isLoading: isSaving }] =
    useSaveGLAccountTypesMutation();

  const [updateGLAccountTypes, { isLoading: isUpdating }] =
    useUpdateGLAccountTypesMutation();

  useEffect(() => {
    if (apiData) {
      const hasAnyGLAccount = apiData.some(item => item.glAccountId !== null);
      setIsInitialState(!hasAnyGLAccount);
      setGLAccountTypesData(apiData);
    }
  }, [apiData]);

  const allEntriesHaveGLAccount = useMemo(() => {
    return glAccountTypesData.every(
      item => item.glAccountId !== null && item.glAccountId !== ""
    );
  }, [glAccountTypesData]);

  const hasAnyEdits = useMemo(() => {
    return glAccountTypesData.some(item => item.isEdited);
  }, [glAccountTypesData]);

  const isSaveEnabled = useMemo(() => {
    if (isInitialState) {
      return allEntriesHaveGLAccount;
    } else {
      return hasAnyEdits;
    }
  }, [isInitialState, allEntriesHaveGLAccount, hasAnyEdits]);

  const isProcessing = isSaving || isUpdating;

  const handleUpdateGLAccount = useCallback(
    (
      glAccountTypeId: string,
      glAccountId: string | null,
      glAccountName: string | null
    ) => {
      if (readonly) return;

      setGLAccountTypesData(prev =>
        prev.map(item =>
          item.glAccountTypeId === glAccountTypeId
            ? {
                ...item,
                glAccountId,
                glAccountName,
                isEdited: true,
              }
            : item
        )
      );
    },
    [readonly]
  );

  const handleToggleActive = useCallback(
    (glAccountTypeId: string) => {
      if (readonly) return;

      setGLAccountTypesData(prev =>
        prev.map(item =>
          item.glAccountTypeId === glAccountTypeId
            ? {
                ...item,
                isActive: !item.isActive,
                isEdited: true,
              }
            : item
        )
      );
    },
    [readonly]
  );

  const handleReset = useCallback(() => {
    if (apiData) {
      setGLAccountTypesData(apiData);
    }
  }, [apiData]);

  const handleSave = useCallback(async () => {
    if (readonly) return;

    if (isInitialState && !allEntriesHaveGLAccount) {
      logger.info("Please select GL account for all entries", { toast: true });
      return;
    }

    if (!isInitialState && !hasAnyEdits) {
      logger.info("No changes to save", { toast: true });
      return;
    }

    const payload: GLAccountTypeMutationPayload = {
      loanSchemeGlTypeGlMappingDtos: glAccountTypesData.map(item => ({
        glAccountTypeIdentity: item.glAccountTypeId,
        glAccountIdentity: item.glAccountId,
        isActive: item.isActive,
      })),
    };

    try {
      if (isInitialState) {
        await saveGLAccountTypes(payload).unwrap();
        logger.info("GL account types saved successfully", { toast: true });
      } else {
        await updateGLAccountTypes(payload).unwrap();
        logger.info("GL account types updated successfully", { toast: true });
      }

      const result = await refetch();

      if (result.data) {
        const hasAnyGLAccount = result.data.some(
          item => item.glAccountId !== null
        );
        setIsInitialState(!hasAnyGLAccount);
      }
    } catch (error) {
      logger.error(error, { toast: true });
    }
  }, [
    readonly,
    glAccountTypesData,
    saveGLAccountTypes,
    updateGLAccountTypes,
    refetch,
    isInitialState,
    allEntriesHaveGLAccount,
    hasAnyEdits,
  ]);

  return {
    isTableOpen,
    glAccountTypesData,
    isInitialState,

    allEntriesHaveGLAccount,
    hasAnyEdits,
    isSaveEnabled,
    isProcessing,
    isLoadingTable,

    setIsTableOpen,
    handleUpdateGLAccount,
    handleToggleActive,
    handleReset,
    handleSave,
  };
};
