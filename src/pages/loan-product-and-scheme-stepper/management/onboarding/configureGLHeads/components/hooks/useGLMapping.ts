import { useState, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useAppSelector } from "@/hooks/store";
import { logger } from "@/global/service";
import {
  useGetGLTypesQuery,
  useGetGLAccountsByTypeQuery,
  useGetGLMappingsQuery,
  useCreateGLMappingMutation,
  useUpdateGLMappingMutation,
  useDeleteGLMappingMutation,
} from "@/global/service/end-points/loan-product-and-scheme/gl-mappings";
import type {
  GLMappingFormData,
  GLMappingTableData,
  GLMappingPayload,
  GLTypeOption,
  GLAccountOption,
} from "@/types/loan-product-and schema Stepper/gl-mappings.types";
import { glMappingDefaultFormValues } from "../../constants/form.constants";
import { glHeadValidationSchema as glMappingValidationSchema } from "@/global/validation/loan-product-and-scheme/glHeads";

export const useGLMapping = () => {
  const { currentSchemeId, currentSchemeName } = useAppSelector(
    state => state.loanProduct
  );
  const [tableData, setTableData] = useState<GLMappingTableData[]>([]);
  const [editingItem, setEditingItem] = useState<GLMappingTableData | null>(
    null
  );
  const [isEditing, setIsEditing] = useState(false);
  const [selectedGLType, setSelectedGLType] = useState<string>("");

  const { data: glTypes } = useGetGLTypesQuery();
  const { data: glAccounts } = useGetGLAccountsByTypeQuery(selectedGLType, {
    skip: !selectedGLType,
  });
  const { data: glMappings, refetch: refetchGLMappings } =
    useGetGLMappingsQuery(
      { schemeId: currentSchemeId || "" },
      { skip: !currentSchemeId }
    );
  const [createGLMapping] = useCreateGLMappingMutation();
  const [updateGLMapping] = useUpdateGLMappingMutation();
  const [deleteGLMapping] = useDeleteGLMappingMutation();

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState,
    formState: { errors },
  } = useForm<GLMappingFormData>({
    defaultValues: glMappingDefaultFormValues,
    resolver: yupResolver(glMappingValidationSchema),
    mode: "onChange",
  });

  const watchedGLType = watch("glAccountType");

  useEffect(() => {
    if (watchedGLType) {
      setSelectedGLType(watchedGLType);
      setValue("glAccount", ""); // Reset GL account when type changes
    }
  }, [watchedGLType, setValue]);

  useEffect(() => {
    if (glMappings && glMappings.length > 0) {
      const schemeName = glMappings[0].schemeName;
      if (schemeName) {
        setValue("loanScheme", schemeName, { shouldDirty: false });
      }

      const mappedData: GLMappingTableData[] = glMappings.map(mapping => ({
        id: mapping.id,
        glAccountType: mapping.glAccountType,
        glAccount: mapping.glAccount,
        glAccountTypeName:
          mapping.glAccountTypeName || mapping.glAccountType || "",
        glAccountName: mapping.glAccountName || "",
        createdOn: mapping.createdAt,
        updatedOn: mapping.updatedAt,
      }));
      setTableData(mappedData);
    } else if (currentSchemeName) {
      setValue("loanScheme", currentSchemeName, { shouldDirty: false });
    }
  }, [glMappings, currentSchemeName, setValue]);

  const handleEdit = useCallback(
    (item: GLMappingTableData) => {
      setEditingItem(item);
      setIsEditing(true);
      setValue("glAccountType", item.glAccountType, { shouldDirty: false });
      setValue("glAccount", item.glAccount, { shouldDirty: false });
    },
    [setValue]
  );

  // Handle setting GL account when editing and accounts are loaded
  useEffect(() => {
    if (isEditing && editingItem && glAccounts && glAccounts.length > 0) {
      const currentGLAccount = watch("glAccount");
      if (!currentGLAccount || currentGLAccount !== editingItem.glAccount) {
        setValue("glAccount", editingItem.glAccount, { shouldDirty: false });
      }
    }
  }, [isEditing, editingItem, glAccounts, setValue, watch]);

  const handleCancelEdit = useCallback(() => {
    setEditingItem(null);
    setIsEditing(false);
    setSelectedGLType("");
    reset(glMappingDefaultFormValues);
  }, [reset]);

  const handleDelete = useCallback(
    async (item: GLMappingTableData) => {
      try {
        if (!currentSchemeId) {
          logger.error("No scheme ID available", { toast: true });
          return;
        }

        await deleteGLMapping({
          schemeId: currentSchemeId,
          mappingId: item.id,
        }).unwrap();

        logger.info("GL mapping deleted successfully", { toast: true });
        await refetchGLMappings();
      } catch (error) {
        const apiError = error as { data?: { message?: string } };
        const errorMessage =
          apiError.data?.message || "Failed to delete GL mapping";
        logger.error(errorMessage, { toast: true });
      }
    },
    [currentSchemeId, deleteGLMapping, refetchGLMappings]
  );

  const onSubmit = async (
    data: GLMappingFormData,
    onSave?: () => void,
    onComplete?: () => void
  ) => {
    try {
      if (!currentSchemeId) {
        logger.error("No scheme ID available", { toast: true });
        return;
      }

      const payload: GLMappingPayload = {
        glAccountType: data.glAccountType,
        glAccount: data.glAccount,
      };

      if (isEditing && editingItem) {
        await updateGLMapping({
          schemeId: currentSchemeId,
          mappingId: editingItem.id,
          payload,
        }).unwrap();
        logger.info("GL mapping updated successfully", { toast: true });
      } else {
        await createGLMapping({
          schemeId: currentSchemeId,
          payload,
        }).unwrap();
        logger.info("GL mapping created successfully", { toast: true });
      }

      handleCancelEdit();
      await refetchGLMappings();

      if (onSave) onSave();
      if (onComplete) onComplete();
    } catch (error) {
      const apiError = error as { data?: { message?: string } };
      const errorMessage =
        apiError.data?.message || "Failed to save GL mapping";
      logger.error(errorMessage, { toast: true });
    }
  };

  const glTypeOptions: GLTypeOption[] = glTypes || [];
  const glAccountOptions: GLAccountOption[] = glAccounts || [];

  return {
    control,
    handleSubmit,
    errors,
    tableData,
    editingItem,
    isEditing,
    glTypeOptions,
    glAccountOptions,
    handleEdit,
    handleCancelEdit,
    handleDelete,
    onSubmit,
    formState,
    hasUnsavedChanges: formState.isDirty && isEditing,
    hasBeenSaved: tableData.length > 0,
  };
};
