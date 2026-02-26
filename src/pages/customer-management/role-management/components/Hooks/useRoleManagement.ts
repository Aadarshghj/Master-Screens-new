import { useCallback } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { roleManagementSchema } from "@/global/validation/customer-management-master/role-management";
import { ROLE_MANAGEMENT_DEFAULT_VALUES } from "../../constants/RoleManagementDefault";
import type {
  RoleManagementRequestDto,
  RoleManagementType,
} from "@/types/customer-management/role-management";
import toast from "react-hot-toast";
import {
  useSaveRoleManagementMutation,
  useUpdateRoleManagementMutation,
} from "@/global/service/end-points/customer-management/role-management";
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";

export const useRoleManagement = (editData?: RoleManagementType) => {
  const [saveRoleManagement] = useSaveRoleManagementMutation();
  const [updateRoleManagement] = useUpdateRoleManagementMutation();

  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<RoleManagementType>({
    defaultValues: editData ?? ROLE_MANAGEMENT_DEFAULT_VALUES,
    resolver: yupResolver(roleManagementSchema),
    mode: "onChange",
  });

  const onSubmit = useCallback(
    async (data: RoleManagementType) => {
      const payload: RoleManagementRequestDto = {
        roleName: data.roleName.toUpperCase(),
        roleShortDesc: data.roleShortDesc,
        isActive: data.isActive,
      };
      try {
        if (data.identity) {
          await updateRoleManagement({
            identity: data.identity.toString(),
            payload,
          }).unwrap();
          toast.success("Role Updated Succesfully");
        } else {
          await saveRoleManagement(payload).unwrap();
          toast.success("Role Added Succesfully");
        }
        reset(ROLE_MANAGEMENT_DEFAULT_VALUES);
      } catch (error) {
        const err = error as FetchBaseQueryError;
        const message =
          typeof err?.data === "object" && err?.data !== null
            ? (err.data as { message?: string }).message
            : undefined;
        toast.error(message ?? "Failed to Savr Role");
      }
    },
    [reset, saveRoleManagement, updateRoleManagement]
  );

  const onCancel = useCallback(() => {
    reset(ROLE_MANAGEMENT_DEFAULT_VALUES);
  }, [reset]);

  const onReset = useCallback(() => {
    reset(ROLE_MANAGEMENT_DEFAULT_VALUES);
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
    reset,
  };
};
