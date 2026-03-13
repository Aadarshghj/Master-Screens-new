import { useCallback, useState, useEffect } from "react";
import { useForm, type Resolver } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import type { GstRegistrationType } from "@/types/customer-management/asset-master/gst-registration";
import { gstRegistrationSchema } from "@/global/validation/customer-management-master/asset-master/gst-registration";
import { GST_REGISTRATION_DEFAULT_VALUES } from "../../constants/GstRegistrationDefault";

export const useGstRegistrationForm = (editData?: GstRegistrationType) => {
  const [isEdit, setIsEdit] = useState<boolean>(!!editData);

  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<GstRegistrationType>({
    defaultValues: editData ?? GST_REGISTRATION_DEFAULT_VALUES,
    resolver: yupResolver(gstRegistrationSchema) as Resolver<GstRegistrationType>,
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
    (data: GstRegistrationType) => {
      const name = data.gstRegType.trim().toUpperCase();

      console.log("Form Submitted:", data);

      alert(`${name} submitted successfully!`);
      reset(GST_REGISTRATION_DEFAULT_VALUES);
      setIsEdit(false);
    },
    [reset]
  );

  const onReset = useCallback(() => {
    reset(GST_REGISTRATION_DEFAULT_VALUES);
    setIsEdit(false);
  }, [reset]);

  const onCancel = useCallback(() => {
    reset(GST_REGISTRATION_DEFAULT_VALUES);
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