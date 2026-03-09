import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { UserTypeSchema } from "../../../../../global/validation/customer-management-master/user-type";
import type { UserType } from "@/types/customer-management/user-type";
import {
  DEFAULT_USER_TYPE,
  generateUserTypeCode,
} from "../../constants/UserTypeConstants";
import type { Resolver } from "react-hook-form";
export const useUserTypeMasterForm = (
  existingCodes: string[],
  onSuccess?: (data: UserType) => void
) => {
  const {
    control,
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<UserType>({
    defaultValues: DEFAULT_USER_TYPE,
    resolver: yupResolver(UserTypeSchema) as Resolver<UserType>,
    mode: "onTouched",
    reValidateMode: "onChange",
  });

  const [isEdit, setIsEdit] = useState(false);

  const userTypeCode = watch("userTypeCode");

  const onSubmit = async (data: UserType) => {
    // Simulate async save delay
    await new Promise(res => setTimeout(res, 400));

    const isUpdate = !!data.userTypeIdentity;

    const saved: UserType = {
      ...data,
      userTypeIdentity: isUpdate ? data.userTypeIdentity : String(Date.now()),
      userTypeCode: isUpdate
        ? data.userTypeCode
        : generateUserTypeCode(existingCodes),
      userTypeName: data.userTypeName.trim().toUpperCase(),
      userTypeDesc: data.userTypeDesc?.trim().toUpperCase(),
    };

    onSuccess?.(saved);
    onReset();
  };

  const handleEdit = (data: UserType) => {
    setIsEdit(true);
    reset(data);
  };

  const onCancel = useCallback(() => {
    setIsEdit(false);
    reset(DEFAULT_USER_TYPE);
  }, [reset]);

  const onReset = useCallback(() => {
    setIsEdit(false);
    reset(DEFAULT_USER_TYPE);
  }, [reset]);

  return {
    control,
    register,
    handleSubmit,
    isEdit,
    handleEdit,
    errors,
    isSubmitting,
    onSubmit,
    onCancel,
    onReset,
    reset,
    userTypeCode,
    setIsEdit,
  };
};
