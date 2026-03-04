import { useState, useEffect, useCallback, useMemo } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useAppSelector } from "@/hooks/store";
import { logger } from "@/global/service";
import {
  useCreateInterestSlabMutation,
  useGetInterestSlabsQuery,
  useDeleteInterestSlabMutation,
  useUpdateInterestSlabMutation,
} from "@/global/service/end-points/loan-product-and-scheme/interest-slab";
import { useGetLoanSchemeByIdQuery } from "@/global/service/end-points/loan-product-and-scheme/loan-product-scheme";
import { interestSlabValidationSchema } from "@/global/validation/loan-product-and-scheme/interestSlab";
import { interestSlabDefaultFormValues } from "../../constants/form.constants";
import type {
  InterestSlabFormData,
  InterestSlabTableData,
} from "@/types/loan-product-and schema Stepper/interest-slabs.types";

// Type definitions for API responses
interface ApiResponse {
  interestSlabs?: InterestSlabApiItem[];
}

interface InterestSlabApiItem {
  identity?: string;
  id?: string;
  startPeriod?: number;
  endPeriod?: number;
  fromAmount?: number;
  toAmount?: number;
  slabInterestRate?: number;
  annualRoi?: number;
  rebateInterestRate?: number;
  recalculationRequired?: boolean;
  pastDue?: boolean;
  status?: boolean;
}

interface SchemeData {
  schemeName?: string;
  fromAmount?: number;
  toAmount?: number;
}

export const useInterestSlab = () => {
  const { currentSchemeId } = useAppSelector(state => state.loanProduct);
  const [editingItem, setEditingItem] = useState<InterestSlabTableData | null>(
    null
  );
  const [isEditing, setIsEditing] = useState(false);
  const [deletedIds, setDeletedIds] = useState<Set<string>>(new Set());
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const [createInterestSlabMutation] = useCreateInterestSlabMutation();
  const [updateInterestSlabMutation] = useUpdateInterestSlabMutation();
  const [deleteInterestSlab] = useDeleteInterestSlabMutation();

  const { data: directApiData, refetch: directRefetch } =
    useGetInterestSlabsQuery(
      { schemeId: currentSchemeId || "" },
      { skip: !currentSchemeId, refetchOnMountOrArgChange: true }
    );

  const { data: loanSchemeData } = useGetLoanSchemeByIdQuery(
    currentSchemeId || "",
    { skip: !currentSchemeId, refetchOnMountOrArgChange: true }
  );

  const {
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState,
    formState: { errors },
  } = useForm<InterestSlabFormData>({
    defaultValues: interestSlabDefaultFormValues,
    resolver: yupResolver(interestSlabValidationSchema),
    mode: "onChange",
  });

  // Watch for changes in slabInterestRate and annualROI
  const slabInterestRate = watch("slabInterestRate");
  const annualROI = watch("annualROI");

  // Auto-calculate rebate based on difference
  useEffect(() => {
    const slab = parseFloat(slabInterestRate || "0");
    const roi = parseFloat(annualROI || "0");

    if (!isNaN(slab) && !isNaN(roi)) {
      const rebate = roi - slab;
      setValue("rebateAnnualROI", rebate.toString());
    }
  }, [slabInterestRate, annualROI, setValue]);

  const currentScheme = loanSchemeData?.data || (loanSchemeData as SchemeData);

  // Load scheme data
  useEffect(() => {
    if (currentScheme) {
      const formData = {
        ...interestSlabDefaultFormValues,
        loanScheme: (currentScheme as SchemeData)?.schemeName || "",
        fromAmount: (currentScheme as SchemeData)?.fromAmount?.toString() || "",
        toAmount: (currentScheme as SchemeData)?.toAmount?.toString() || "",
      };
      reset(formData);
    }
  }, [currentScheme, reset]);

  // Transform table data
  const tableData: InterestSlabTableData[] = useMemo(() => {
    const apiData = directApiData as ApiResponse | InterestSlabApiItem[];
    const slabsArray = Array.isArray(apiData)
      ? apiData
      : apiData?.interestSlabs || [];

    return (
      slabsArray
        ?.filter(
          (slab: InterestSlabApiItem) =>
            !deletedIds.has(slab.identity || "") && slab.status === true
        )
        ?.map((slab: InterestSlabApiItem, index: number) => ({
          id: slab.identity || slab.id || `temp-${index}`,
          startPeriod: slab.startPeriod || 0,
          endPeriod: slab.endPeriod || 0,
          fromAmount: slab.fromAmount || 0,
          toAmount: slab.toAmount || 0,
          slabInterestRate: slab.slabInterestRate || 0,
          annualROI: slab.annualRoi || 0,
          rebateAnnualROI: slab.rebateInterestRate || 0,
          recomputationRequired: slab.recalculationRequired ? "YES" : "NO",
          pastDue: slab.pastDue ? "YES" : "NO",
        })) || []
    );
  }, [directApiData, deletedIds]);

  const handleEdit = useCallback(
    (id: number | string) => {
      const itemToEdit =
        typeof id === "number"
          ? tableData[id]
          : tableData.find(item => item.id === id);

      if (itemToEdit) {
        setEditingItem(itemToEdit);
        setIsEditing(true);
        setHasUnsavedChanges(false);
        const formData: InterestSlabFormData = {
          loanScheme: (currentScheme as SchemeData)?.schemeName || "",
          startPeriod: itemToEdit.startPeriod.toString(),
          endPeriod: itemToEdit.endPeriod.toString(),
          fromAmount: itemToEdit.fromAmount.toString(),
          toAmount: itemToEdit.toAmount.toString(),
          slabInterestRate: itemToEdit.slabInterestRate.toString(),
          annualROI: itemToEdit.annualROI.toString(),
          rebateAnnualROI: itemToEdit.rebateAnnualROI.toString(),
          recomputationRequired: itemToEdit.recomputationRequired === "YES",
          expired: itemToEdit.pastDue === "YES",
        };
        reset(formData);
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    },
    [tableData, currentScheme, reset]
  );

  const handleCancelEdit = useCallback(() => {
    setEditingItem(null);
    setIsEditing(false);
    setHasUnsavedChanges(false);
    const resetData = {
      ...interestSlabDefaultFormValues,
      loanScheme: (currentScheme as SchemeData)?.schemeName || "",
      fromAmount: (currentScheme as SchemeData)?.fromAmount?.toString() || "",
      toAmount: (currentScheme as SchemeData)?.toAmount?.toString() || "",
    };
    reset(resetData);
  }, [currentScheme, reset]);

  const handleDelete = useCallback(
    async (id: number | string) => {
      if (!currentSchemeId) {
        logger.error("No scheme ID found", { toast: true });
        return;
      }

      try {
        await deleteInterestSlab({
          schemeId: currentSchemeId,
          slabId: id.toString(),
        }).unwrap();
        logger.info("Interest slab deleted successfully!", { toast: true });
      } catch (error) {
        const apiError = error as { status?: number };
        if (apiError?.status === 404) {
          logger.info("Interest slab was already deleted", { toast: true });
        } else {
          logger.error("Failed to delete interest slab", { toast: true });
          return;
        }
      }

      setDeletedIds(prev => new Set(prev).add(id.toString()));
    },
    [currentSchemeId, deleteInterestSlab]
  );

  const onSubmit = async (
    data: InterestSlabFormData,
    onSave?: () => void,
    onComplete?: () => void
  ) => {
    try {
      if (!currentSchemeId) {
        logger.error("No scheme ID found. Please create a loan scheme first.", {
          toast: true,
        });
        return;
      }

      const payload = {
        start_period: Number(data.startPeriod),
        end_period: Number(data.endPeriod),
        from_amount: Number(data.fromAmount),
        to_amount: Number(data.toAmount),
        slab_interest_rate: Number(data.slabInterestRate),
        rebate_interest_rate: Number(data.rebateAnnualROI),
        annual_roi: Number(data.annualROI),
        recalculation_required: Boolean(data.recomputationRequired),
        post_due: Boolean(data.expired),
        active: true,
      };

      if (isEditing && editingItem) {
        await updateInterestSlabMutation({
          schemeId: currentSchemeId,
          slabId: editingItem.id.toString(),
          payload,
        }).unwrap();
        logger.info("Interest slab updated successfully!", { toast: true });
      } else {
        await createInterestSlabMutation({
          schemeId: currentSchemeId,
          payload,
        }).unwrap();
        logger.info("Interest slab created successfully!", { toast: true });
      }

      handleCancelEdit();
      setHasUnsavedChanges(false);
      if (directRefetch) await directRefetch();
      if (onSave) onSave();
      if (onComplete) onComplete();
    } catch {
      logger.error("Failed to save interest slab", { toast: true });
    }
  };

  return {
    control,
    handleSubmit,
    errors,
    tableData,
    editingItem,
    isEditing,
    handleEdit,
    handleCancelEdit,
    handleDelete,
    onSubmit,
    watch,
    formState,
    hasUnsavedChanges,
  };
};
