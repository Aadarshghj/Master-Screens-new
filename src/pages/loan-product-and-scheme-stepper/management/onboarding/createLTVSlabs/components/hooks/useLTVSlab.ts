import { useState, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useAppSelector, useAppDispatch } from "@/hooks/store";
import { setEditMode } from "@/global/reducers/loan-stepper/loan-product.reducer";
import { logger } from "@/global/service";
import {
  useGetLTVOnOptionsQuery,
  useGetLTVSlabsQuery,
  useCreateLTVSlabsMutation,
  useUpdateLTVSlabMutation,
  useDeleteLTVSlabMutation,
} from "@/global/service/end-points/loan-product-and-scheme/ltv-slabs";
import type {
  LTVSlabFormData,
  LTVSlabTableData,
  LTVSlabPayload,
  LTVOnOption,
} from "@/types/loan-product-and schema Stepper/ltv-slabs.types";
import { ltvSlabDefaultFormValues } from "../../constants/form.constants";
import { ltvSlabValidationSchema } from "@/global/validation/loan-product-and-scheme/ltvSlabs";

export const useLTVSlab = () => {
  const dispatch = useAppDispatch();
  const { currentSchemeId, currentSchemeName } = useAppSelector(
    state => state.loanProduct
  );

  const [tableData, setTableData] = useState<LTVSlabTableData[]>([]);
  const [editingItem, setEditingItem] = useState<LTVSlabTableData | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<LTVSlabTableData | null>(
    null
  );
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const { data: ltvOnOptions } = useGetLTVOnOptionsQuery();
  const { data: ltvSlabs, refetch: refetchLTVSlabs } = useGetLTVSlabsQuery(
    { schemeId: currentSchemeId || "" },
    { skip: !currentSchemeId }
  );

  const [createLTVSlabs] = useCreateLTVSlabsMutation();
  const [updateLTVSlab] = useUpdateLTVSlabMutation();
  const [deleteLTVSlab] = useDeleteLTVSlabMutation();

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState,
    formState: { errors },
  } = useForm<LTVSlabFormData>({
    defaultValues: ltvSlabDefaultFormValues,
    resolver: yupResolver(ltvSlabValidationSchema),
    mode: "onChange",
  });

  // Watch form changes to detect unsaved changes
  const fromAmount = watch("fromAmount");
  const toAmount = watch("toAmount");
  const ltvPercentage = watch("ltvPercentage");
  const ltvOn = watch("ltvOn");

  useEffect(() => {
    if (isEditing && editingItem) {
      const hasChanged =
        String(fromAmount) !== String(editingItem.fromAmount) ||
        String(toAmount) !== String(editingItem.toAmount) ||
        String(ltvPercentage) !== String(editingItem.ltvPercentage) ||
        ltvOn !== editingItem.ltvOnIdentity;
      setHasUnsavedChanges(hasChanged);
    }
  }, [fromAmount, toAmount, ltvPercentage, ltvOn, isEditing, editingItem]);

  // Remove the separate useEffect for setting loan scheme
  // It's now handled in the main useEffect above

  useEffect(() => {
    if (ltvSlabs) {
      // Update scheme name in Redux if available
      if (ltvSlabs.schemeName && ltvSlabs.schemeName !== currentSchemeName) {
        dispatch(
          setEditMode({
            isEdit: true,
            schemeId: currentSchemeId,
            schemeName: ltvSlabs.schemeName,
          })
        );
      }

      // Set loan scheme in form
      setValue("loanScheme", ltvSlabs.schemeName || "", { shouldDirty: false });

      // Process LTV slabs data
      if (Array.isArray(ltvSlabs.ltvSlabs)) {
        const mappedData: LTVSlabTableData[] = ltvSlabs.ltvSlabs.map(slab => ({
          id: slab.ltvSlabIdentity || slab.id, // Use ltvSlabIdentity from your JSON response
          fromAmount: Number(slab.fromAmount),
          toAmount: Number(slab.toAmount),
          ltvPercentage: Number(slab.ltvPercentage),
          ltvOn:
            ltvOnOptions?.find(option => option.value === slab.ltvOnIdentity)
              ?.label || slab.ltvOnIdentity,
          ltvOnIdentity: slab.ltvOnIdentity,
        }));
        setTableData(mappedData);
      } else {
        setTableData([]);
      }
    } else {
      setTableData([]);
      setValue("loanScheme", currentSchemeName || "", { shouldDirty: false });
    }
  }, [
    ltvSlabs,
    ltvOnOptions,
    setValue,
    dispatch,
    currentSchemeId,
    currentSchemeName,
  ]);

  const handleEdit = useCallback(
    (item: LTVSlabTableData) => {
      setEditingItem(item);
      setIsEditing(true);
      setHasUnsavedChanges(false);

      setValue("fromAmount", String(item.fromAmount), { shouldDirty: false });
      setValue("toAmount", String(item.toAmount), { shouldDirty: false });
      setValue("ltvPercentage", String(item.ltvPercentage), {
        shouldDirty: false,
      });
      setValue("ltvOn", item.ltvOnIdentity, { shouldDirty: false });
    },
    [setValue]
  );

  const handleCancelEdit = useCallback(() => {
    setEditingItem(null);
    setIsEditing(false);
    setHasUnsavedChanges(false);

    reset(ltvSlabDefaultFormValues);
  }, [reset]);

  const handleDelete = useCallback((item: LTVSlabTableData) => {
    setItemToDelete(item);
    setShowDeleteModal(true);
  }, []);

  const confirmDelete = useCallback(async () => {
    if (!itemToDelete) return;

    try {
      if (!currentSchemeId) {
        logger.error("No scheme ID available", { toast: true });
        return;
      }

      if (!itemToDelete.id) {
        logger.error("No slab ID available for deletion", { toast: true });
        return;
      }

      await deleteLTVSlab({
        schemeId: currentSchemeId,
        slabId: itemToDelete.id,
      }).unwrap();

      logger.info("LTV slab deleted successfully", { toast: true });
      await refetchLTVSlabs();
    } catch (error) {
      const apiError = error as { data?: { message?: string } };
      const errorMessage =
        apiError.data?.message || "Failed to delete LTV slab";
      logger.error(errorMessage, { toast: true });
    } finally {
      setShowDeleteModal(false);
      setItemToDelete(null);
    }
  }, [itemToDelete, currentSchemeId, deleteLTVSlab, refetchLTVSlabs]);

  const cancelDelete = useCallback(() => {
    setShowDeleteModal(false);
    setItemToDelete(null);
  }, []);

  const onSubmit = async (
    data: LTVSlabFormData,
    onSave?: () => void,
    onComplete?: () => void
  ) => {
    try {
      if (!currentSchemeId) {
        logger.error("No scheme ID available", { toast: true });
        return;
      }

      const payload: LTVSlabPayload = {
        ltvOnIdentity: data.ltvOn,
        fromAmount: Number(data.fromAmount),
        toAmount: Number(data.toAmount),
        ltvPercentage: Number(data.ltvPercentage),
        active: true,
      };

      if (isEditing && editingItem?.id) {
        await updateLTVSlab({
          schemeId: currentSchemeId,
          slabId: editingItem.id,
          payload,
        }).unwrap();
        logger.info("LTV slab updated successfully", { toast: true });
      } else {
        await createLTVSlabs({
          schemeId: currentSchemeId,
          payload,
        }).unwrap();
        logger.info("LTV slab created successfully", { toast: true });
      }

      handleCancelEdit();
      setHasUnsavedChanges(false);
      await refetchLTVSlabs();

      if (onSave) onSave();
      if (onComplete) onComplete();
    } catch (error) {
      const apiError = error as { data?: { message?: string } };
      const errorMessage = apiError.data?.message || "Failed to save LTV slab";
      logger.error(errorMessage, { toast: true });
    }
  };

  const ltvOnOptionsData: LTVOnOption[] = ltvOnOptions || [];

  return {
    control,
    handleSubmit,
    errors,
    tableData,
    editingItem,
    isEditing,
    ltvOnOptionsData,
    handleEdit,
    handleCancelEdit,
    handleDelete,
    confirmDelete,
    cancelDelete,
    showDeleteModal,
    onSubmit,
    formState,
    hasUnsavedChanges,
    hasBeenSaved: tableData.length > 0,
  };
};
