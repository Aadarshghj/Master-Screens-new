import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { logger } from "../../../../../global/service";
import { DEFAULT_ORNAMENT_TYPE } from "../../constants/OrnamentTypeMasterDefaults";
import { ornamentTypeSchema } from "@/global/validation/customer-management-master/ornament-type";
import type { OrnamentType } from "@/types/customer-management/ornament-type";

export const useOrnamentTypeMasterForm = (onSuccess?: () => void) => {

  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<OrnamentType>({
    defaultValues: DEFAULT_ORNAMENT_TYPE,
    resolver: yupResolver(ornamentTypeSchema),
    mode: "onTouched",
    reValidateMode: "onChange",
  });

  const [isEdit, setIsEdit] = useState(false);

  const onSubmit = async (data: OrnamentType) => {
    try {

      if (isEdit) {
        logger.info("Ornament Type Updated Successfully", { toast: true });
      } else {
        logger.info("Ornament Type Saved Successfully", { toast: true });
      }

      console.log("Submitted Data:", data);

      onReset();
      onSuccess?.();

    } catch (err) {
      logger.error("Something went wrong", { toast: true });
    }
  };

  const handleEdit = useCallback((data: OrnamentType) => {
    setIsEdit(true);

    reset({
      ornamentTypeIdentity: data.ornamentTypeIdentity,
      ornamentTypeCode: data.ornamentTypeCode,
      ornamentTypeName: data.ornamentTypeName,
      ornamentTypeDesc: data.ornamentTypeDesc,
      isActive: data.isActive,
    });

  }, [reset]);

  const onCancel = useCallback(() => {
    reset(DEFAULT_ORNAMENT_TYPE);
    setIsEdit(false);
  }, [reset]);

  const onReset = useCallback(() => {
    reset(DEFAULT_ORNAMENT_TYPE);
    setIsEdit(false);
  }, [reset]);

  return {
    control,
    register,
    handleSubmit,
    errors,
    isSubmitting,
    isEdit,

    handleEdit,
    onSubmit,
    onCancel,
    onReset,
    reset,
  };
};