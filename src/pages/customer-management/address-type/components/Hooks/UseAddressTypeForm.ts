import { useCallback } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import toast from "react-hot-toast";

import type { AddressTypeMaster } from "@/types/customer-management/address-type-master";

import { ADDRESS_TYPE_DEFAULT_VALUES } from "../../constants/index";
import { addressTypeSchema } from "@/global/validation/customer-management-master/address-type";

export const useAddressType = () => {
  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<AddressTypeMaster>({
    defaultValues: ADDRESS_TYPE_DEFAULT_VALUES,
    resolver: yupResolver(addressTypeSchema),
    mode: "onBlur",
  });
  const onSubmit = useCallback(
    async (data: AddressTypeMaster) => {
      try {
        console.log("Mock Saved Data:", data);

        await new Promise(resolve => setTimeout(resolve, 500));

        toast.success("Address Type saved successfully");

        reset(ADDRESS_TYPE_DEFAULT_VALUES);
      } catch {
        toast.error("Failed to save Address Type");
      }
    },
    [reset]
  );

  const onCancel = useCallback(() => {
    reset(ADDRESS_TYPE_DEFAULT_VALUES);
  }, [reset]);

  const onReset = useCallback(() => {
    reset(ADDRESS_TYPE_DEFAULT_VALUES);
  }, [reset]);

  return {
    control,
    register,
    handleSubmit,
    errors,
    isSubmitting,
    onSubmit,
    onCancel,
    onReset,
  };
};
