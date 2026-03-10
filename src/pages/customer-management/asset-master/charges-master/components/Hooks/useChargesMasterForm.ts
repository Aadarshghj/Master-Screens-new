import { useCallback, useState, useEffect } from "react";
import { useForm, type Resolver } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import type { ChargesMasterType } from "@/types/customer-management/asset-master/charges-master";
import { chargesMasterSchema } from "@/global/validation/customer-management-master/asset-master/charges-master";
import { CHARGE_MASTER_DEFAULT_VALUES } from "../../constants/ChargesMasterDefault";

export const useChargesMasterForm = (editData?: ChargesMasterType) => {
  const [isEdit, setIsEdit] = useState<boolean>(!!editData);

  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ChargesMasterType>({
    defaultValues: editData ?? CHARGE_MASTER_DEFAULT_VALUES,
    resolver: yupResolver(chargesMasterSchema) as Resolver<ChargesMasterType>,
    mode: "onChange",
  });

  useEffect(() => {
    if (editData) {
      setIsEdit(true);
      reset(editData);
    } else {
      setIsEdit(false);
    }
  }, [editData, reset]);

  const onSubmit = useCallback(
    (data: ChargesMasterType) => {
      const name = data.chargeName.trim().toUpperCase();
      alert(`${name} submitted successfully!`);
      reset(CHARGE_MASTER_DEFAULT_VALUES);
      setIsEdit(false);
    },
    [reset]
  );

  const onReset = useCallback(() => {
    reset(CHARGE_MASTER_DEFAULT_VALUES);
    setIsEdit(false);
  }, [reset]);

  const onCancel = useCallback(() => {
    reset(CHARGE_MASTER_DEFAULT_VALUES);
    setIsEdit(false);
  }, [reset]);

  return {
    control,
    reset,
    onSubmit,
    onCancel,
    handleSubmit,
    onReset,
    register,
    errors,
    isEdit,
    isSubmitting,
    setIsEdit
  };
};