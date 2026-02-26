import { useState, useEffect, useCallback, useMemo } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useAppSelector } from "@/hooks/store";
import { logger } from "@/global/service";
import {
  useCreateChargeSlabMutation,
  useGetSchemeChargeSlabsQuery,
  useUpdateChargeSlabMutation,
  useDeleteChargeSlabMutation,
  useGetChargesQuery,
  useGetRateTypesQuery,
  useGetChargeOnOptionsQuery,
} from "@/global/service/end-points/loan-product-and-scheme/charge-slabs";
import { useGetLoanSchemeByIdQuery } from "@/global/service/end-points/loan-product-and-scheme/loan-product-scheme";
import { chargeSlabValidationSchema } from "@/global/validation/loan-product-and-scheme/chargeSlabs";
import {
  loanSchemeChargeSlabDefaultFormValues,
  CHARGES_OPTIONS,
  RATE_TYPE_OPTIONS,
  CHARGE_ON_OPTIONS,
} from "../../constants/form.constants";
import type {
  LoanSchemeChargeSlabFormData,
  ChargeSlabEditingItem,
} from "@/types/loan-product-and schema Stepper/charge-slab.types";

// Type definitions for API responses
interface ApiError {
  data?: {
    message?: string;
  };
}

interface ChargeItem {
  identity?: string;
  id?: string;
  chargeName?: string;
  name?: string;
  displayName?: string;
}

interface RateTypeItem {
  identity?: string;
  rateType?: string;
}

interface ChargeOnItem {
  identity?: string;
  id?: string;
  calculationBaseName?: string;
  name?: string;
  displayName?: string;
}

interface ChargeSlabItem {
  slabIdentity?: string;
  id?: string;
  chargeName?: string;
  fromAmount?: number;
  toAmount?: number;
  rateType?: string;
  slabRate?: number;
  chargeOn?: string;
  chargeIdentity?: string;
  rateTypeIdentity?: string;
  chargeOnIdentity?: string;
}

interface SchemeResponse {
  schemeName?: string;
  data?: { schemeName?: string };
}

interface ApiResponse<T> {
  data?: T[];
}

export const useChargeSlab = () => {
  const { currentSchemeId, currentSchemeName } = useAppSelector(
    state => state.loanProduct
  );
  const [editingItem, setEditingItem] = useState<ChargeSlabEditingItem | null>(
    null
  );
  const [isEditing, setIsEditing] = useState(false);

  // Get scheme details
  const { data: schemeData } = useGetLoanSchemeByIdQuery(
    currentSchemeId || "",
    { skip: !currentSchemeId }
  );

  // API hooks
  const { data: chargeSlabsResponse } = useGetSchemeChargeSlabsQuery(
    { schemeId: currentSchemeId!, page: 0, size: 20 },
    { skip: !currentSchemeId, refetchOnMountOrArgChange: true }
  );
  const { data: chargesData } = useGetChargesQuery(undefined, {
    skip: false,
    refetchOnMountOrArgChange: true,
  });
  const { data: rateTypesData } = useGetRateTypesQuery(undefined, {
    skip: false,
    refetchOnMountOrArgChange: true,
  });
  const { data: chargeOnData } = useGetChargeOnOptionsQuery(undefined, {
    skip: false,
    refetchOnMountOrArgChange: true,
  });

  const [createChargeSlab] = useCreateChargeSlabMutation();
  const [updateChargeSlab] = useUpdateChargeSlabMutation();
  const [deleteChargeSlab] = useDeleteChargeSlabMutation();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<LoanSchemeChargeSlabFormData>({
    defaultValues: loanSchemeChargeSlabDefaultFormValues,
    resolver: yupResolver(chargeSlabValidationSchema),
    mode: "onChange",
  });

  // Extract scheme name
  const schemeName = useMemo(() => {
    const schemeResponse = schemeData as SchemeResponse;
    return (
      schemeResponse?.schemeName ||
      schemeResponse?.data?.schemeName ||
      currentSchemeName ||
      ""
    );
  }, [schemeData, currentSchemeName]);

  // Transform API data to dropdown options
  const chargesOptions = chargesData
    ? (Array.isArray(chargesData)
        ? chargesData
        : (chargesData as ApiResponse<ChargeItem>)?.data || []
      ).map((item: ChargeItem) => ({
        value: item.identity || item.id || "",
        label: item.chargeName || item.name || item.displayName || "",
      }))
    : CHARGES_OPTIONS;

  const rateTypesOptions = rateTypesData
    ? (Array.isArray(rateTypesData)
        ? rateTypesData
        : (rateTypesData as ApiResponse<RateTypeItem>)?.data || []
      ).map((item: RateTypeItem) => ({
        value: item.identity || "",
        label: item.rateType || "",
      }))
    : RATE_TYPE_OPTIONS;

  const chargeOnOptions = chargeOnData
    ? (Array.isArray(chargeOnData)
        ? chargeOnData
        : (chargeOnData as ApiResponse<ChargeOnItem>)?.data || []
      ).map((item: ChargeOnItem) => ({
        value: item.identity || item.id || "",
        label: item.calculationBaseName || item.name || item.displayName || "",
      }))
    : CHARGE_ON_OPTIONS;

  // Transform charge slabs data for table
  const tableData = useMemo(() => {
    const chargeSlabsData = chargeSlabsResponse?.content || [];
    if (!chargeSlabsData || !Array.isArray(chargeSlabsData)) return [];

    return chargeSlabsData.map((slab: ChargeSlabItem) => ({
      id: slab.slabIdentity || slab.id || "",
      charge: slab.chargeName || "N/A",
      fromAmount: slab.fromAmount?.toString() || "0",
      toAmount: slab.toAmount?.toString() || "0",
      rateType: slab.rateType || "N/A",
      slabRate: slab.slabRate?.toString() || "0",
      chargeOn: slab.chargeOn || "N/A",
      chargeIdentity: slab.chargeIdentity,
      rateTypeIdentity: slab.rateTypeIdentity,
      chargeOnIdentity: slab.chargeOnIdentity,
    }));
  }, [chargeSlabsResponse]);

  // Load scheme data
  useEffect(() => {
    if (!isEditing) {
      reset({
        ...loanSchemeChargeSlabDefaultFormValues,
        loanScheme: schemeName,
      });
    }
  }, [schemeName, reset, isEditing]);

  const handleEdit = useCallback(
    (item: ChargeSlabEditingItem) => {
      setIsEditing(true);
      setEditingItem(item);

      reset({
        loanScheme: schemeName || currentSchemeName || "",
        charges: item.chargeIdentity,
        fromAmount: item.fromAmount,
        toAmount: item.toAmount,
        rateType: item.rateTypeIdentity,
        slabRate: item.slabRate,
        chargeOn: item.chargeOnIdentity,
      });
    },
    [schemeName, currentSchemeName, reset]
  );

  const handleCancelEdit = useCallback(() => {
    setEditingItem(null);
    setIsEditing(false);
    reset({
      ...loanSchemeChargeSlabDefaultFormValues,
      loanScheme: schemeName,
    });
  }, [schemeName, reset]);

  const handleDelete = useCallback(
    async (item: ChargeSlabEditingItem) => {
      try {
        if (!currentSchemeId) {
          logger.error("No scheme ID available", { toast: true });
          return;
        }

        await deleteChargeSlab({
          schemeId: currentSchemeId,
          slabId: item.id,
        }).unwrap();

        logger.info("Charge slab deleted successfully", { toast: true });
      } catch (error) {
        const apiError = error as ApiError;
        const errorMessage =
          apiError.data?.message || "Failed to delete charge slab";
        logger.error(errorMessage, { toast: true });
      }
    },
    [currentSchemeId, deleteChargeSlab]
  );

  const onSubmit = async (
    data: LoanSchemeChargeSlabFormData,
    onSave?: () => void,
    onComplete?: () => void
  ) => {
    try {
      if (!currentSchemeId) {
        logger.error("Loan scheme is required.", { toast: true });
        return;
      }

      const payload = {
        chargeIdentity: data.charges,
        fromAmount: Number(data.fromAmount),
        toAmount: Number(data.toAmount),
        rateTypeIdentity: data.rateType,
        slabRate: Number(data.slabRate),
        chargeOnIdentity: data.chargeOn,
        active: true,
      };

      if (isEditing && editingItem) {
        await updateChargeSlab({
          schemeId: currentSchemeId,
          slabId: editingItem.id,
          payload,
        }).unwrap();
        logger.info("Charge slab updated successfully!", { toast: true });
      } else {
        await createChargeSlab({
          schemeId: currentSchemeId,
          payload,
        }).unwrap();
        logger.info("Charge slab created successfully!", { toast: true });
      }

      handleCancelEdit();
      if (onSave) onSave();
      if (onComplete) onComplete();
    } catch (error) {
      const apiError = error as ApiError;
      const errorMessage =
        apiError.data?.message || "Failed to save charge slab";
      logger.error(errorMessage, { toast: true });
    }
  };

  return {
    control,
    handleSubmit,
    errors,
    tableData,
    editingItem,
    isEditing,
    chargesOptions,
    rateTypesOptions,
    chargeOnOptions,
    handleEdit,
    handleCancelEdit,
    handleDelete,
    onSubmit,
    hasBeenSaved: tableData.length > 0,
  };
};
