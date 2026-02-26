import { useState, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useAppSelector } from "@/hooks/store";
import { logger } from "@/global/service";
import {
  useGetDocumentOptionsQuery,
  useGetAcceptanceLevelsQuery,
  useGetDocumentRequirementsQuery,
  useCreateDocumentRequirementMutation,
  useUpdateDocumentRequirementMutation,
  useDeleteDocumentRequirementMutation,
} from "@/global/service/end-points/loan-product-and-scheme/document-requirements";
import type {
  DocumentRequirementFormData,
  DocumentRequirementResponse,
  DocumentOption,
  AcceptanceLevelOption,
} from "@/types/loan-product-and schema Stepper/document-requirements.types";
import { documentRequirementDefaultFormValues } from "../../constants/form.constants";
import { documentRequirementValidationSchema } from "@/global/validation/loan-product-and-scheme/documentRequired";

export const useDocumentRequirement = () => {
  const { currentSchemeId, currentSchemeName } = useAppSelector(
    state => state.loanProduct
  );

  const [tableData, setTableData] = useState<DocumentRequirementResponse[]>([]);
  const [editingItem, setEditingItem] =
    useState<DocumentRequirementResponse | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const { data: documentOptions } = useGetDocumentOptionsQuery({});
  const { data: acceptanceLevels } = useGetAcceptanceLevelsQuery({
    schemeId: currentSchemeId || "",
    tenantId: "",
  });
  const { data: documentRequirements, refetch: refetchDocumentRequirements } =
    useGetDocumentRequirementsQuery(
      { schemeId: currentSchemeId || "" },
      { skip: !currentSchemeId }
    );
  const [createDocumentRequirement] = useCreateDocumentRequirementMutation();
  const [updateDocumentRequirement] = useUpdateDocumentRequirementMutation();
  const [deleteDocumentRequirement] = useDeleteDocumentRequirementMutation();

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState,
    formState: { errors },
  } = useForm<DocumentRequirementFormData>({
    defaultValues: documentRequirementDefaultFormValues,
    resolver: yupResolver(documentRequirementValidationSchema),
    mode: "onChange",
  });

  const document = watch("document");
  const acceptanceLevel = watch("acceptanceLevel");
  const mandatoryStatus = watch("mandatoryStatus");

  useEffect(() => {
    if (isEditing && editingItem) {
      const hasChanged =
        document !== editingItem.documentIdentity ||
        acceptanceLevel !== editingItem.acceptanceLevelIdentity ||
        mandatoryStatus !== editingItem.mandatory;
      setHasUnsavedChanges(hasChanged);
    }
  }, [document, acceptanceLevel, mandatoryStatus, isEditing, editingItem]);

  useEffect(() => {
    if (documentRequirements?.schemeName) {
      setValue("loanScheme", documentRequirements.schemeName, {
        shouldDirty: false,
      });
    } else if (currentSchemeName) {
      setValue("loanScheme", currentSchemeName, { shouldDirty: false });
    }
  }, [documentRequirements, currentSchemeName, setValue]);

  useEffect(() => {
    if (documentRequirements?.documentRequirements) {
      setTableData(documentRequirements.documentRequirements);
    }
  }, [documentRequirements]);

  const handleEdit = useCallback(
    (item: DocumentRequirementResponse) => {
      setEditingItem(item);
      setIsEditing(true);
      setHasUnsavedChanges(false);
      setValue("document", item.documentIdentity, { shouldDirty: false });
      setValue("acceptanceLevel", item.acceptanceLevelIdentity, {
        shouldDirty: false,
      });
      setValue("mandatoryStatus", item.mandatory, { shouldDirty: false });
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
    [setValue]
  );

  const handleCancelEdit = useCallback(() => {
    setEditingItem(null);
    setIsEditing(false);
    setHasUnsavedChanges(false);
    reset(documentRequirementDefaultFormValues);
  }, [reset]);

  const handleDelete = useCallback(
    async (item: DocumentRequirementResponse) => {
      try {
        if (!currentSchemeId) {
          logger.error("No scheme ID available", { toast: true });
          return;
        }

        await deleteDocumentRequirement({
          schemeId: currentSchemeId,
          requirementId: item.id,
        }).unwrap();

        logger.info("Document requirement deleted successfully", {
          toast: true,
        });
        await refetchDocumentRequirements();
      } catch (error) {
        const apiError = error as { data?: { message?: string } };
        const errorMessage =
          apiError.data?.message || "Failed to delete document requirement";
        logger.error(errorMessage, { toast: true });
      }
    },
    [currentSchemeId, deleteDocumentRequirement, refetchDocumentRequirements]
  );

  const onSubmit = async (
    data: DocumentRequirementFormData,
    onSave?: () => void,
    onComplete?: () => void
  ) => {
    try {
      if (!currentSchemeId) {
        logger.error("No scheme ID available", { toast: true });
        return;
      }

      const payload = {
        documentIdentity: data.document,
        acceptanceLevelIdentity: data.acceptanceLevel,
        mandatory: data.mandatoryStatus,
        isActive: true,
      };

      if (isEditing && editingItem?.id) {
        await updateDocumentRequirement({
          schemeId: currentSchemeId,
          requirementId: editingItem.id,
          payload,
        }).unwrap();
        logger.info("Document requirement updated successfully", {
          toast: true,
        });
        handleCancelEdit();
      } else {
        await createDocumentRequirement({
          schemeId: currentSchemeId,
          payload,
        }).unwrap();
        logger.info("Document requirement created successfully", {
          toast: true,
        });
        reset(documentRequirementDefaultFormValues);
      }

      setHasUnsavedChanges(false);
      await refetchDocumentRequirements();

      if (onSave) onSave();
      if (onComplete) onComplete();
    } catch (error) {
      const apiError = error as { data?: { message?: string } };
      const errorMessage =
        apiError.data?.message || "Failed to save document requirement";
      logger.error(errorMessage, { toast: true });
    }
  };

  const documentOptionsData: DocumentOption[] = documentOptions || [];
  const acceptanceLevelOptions: AcceptanceLevelOption[] =
    acceptanceLevels || [];

  return {
    control,
    handleSubmit,
    errors,
    tableData,
    documentOptionsData,
    acceptanceLevelOptions,
    isEditing,
    handleEdit,
    handleCancelEdit,
    handleDelete,
    onSubmit,
    formState,
    hasUnsavedChanges,
    hasBeenSaved: tableData.length > 0,
  };
};
