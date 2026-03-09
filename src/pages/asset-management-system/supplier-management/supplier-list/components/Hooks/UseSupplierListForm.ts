import { useState } from "react";
import { useForm } from "react-hook-form";
import type { SupplierFormType } from "@/types/asset-management-system/supplier-management/supplier-list";

export const useSupplierForm = (initialData?: SupplierFormType) => {
  const [isEdit, setIsEdit] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<SupplierFormType>({
    defaultValues: initialData || {
      supplierName: "",
      tradeName: "",
      panNumber: "",
      gstin: "",
      msmeNo: "",
      status: "",
    },
  });

  const onSubmit = (data: SupplierFormType) => {
    console.log("Form Data:", data);
  };

  const onReset = () => {
    reset();
  };

  const onCancel = () => {
    reset();
  };

  return {
    register,
    handleSubmit,
    control,
    reset,
    errors,
    isSubmitting,
    onSubmit,
    onReset,
    onCancel,
    isEdit,
    setIsEdit, // 👈 THIS WAS MISSING
  };
};