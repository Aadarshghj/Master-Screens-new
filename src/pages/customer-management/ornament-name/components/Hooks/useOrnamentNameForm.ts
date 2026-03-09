import { useCallback, useState, useEffect } from "react";
import { useForm, type Resolver } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import type { OrnamentNameData } from "@/types/customer-management/ornament-name";
import { OrnamentNameSchema } from "@/global/validation/customer-management-master/ornament-name";
import { ORNAMENT_NAME_DEFAULT_VALUES } from "../../constants/OrnamentNameDefault";

export const useOrnamentNameForm = (editData?: OrnamentNameData) => {
  const [isEdit, setIsEdit] = useState<boolean>(!!editData);

  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<OrnamentNameData>({
    defaultValues: editData ?? ORNAMENT_NAME_DEFAULT_VALUES,
    resolver: yupResolver(OrnamentNameSchema) as Resolver<OrnamentNameData>,
    mode: "onBlur",
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
    (data: OrnamentNameData) => {
      const name = data.ornamentName.trim().toUpperCase();

      console.log("Form Submitted:", data);

      alert(`${name} submitted successfully!`);
      reset(ORNAMENT_NAME_DEFAULT_VALUES);
      setIsEdit(false);
    },
    [reset]
  );

  const onReset = useCallback(() => {
    reset(ORNAMENT_NAME_DEFAULT_VALUES);
    setIsEdit(false);
  }, [reset]);

  const onCancel = useCallback(() => {
    reset(ORNAMENT_NAME_DEFAULT_VALUES);
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