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
  
} from "@/global/service/end-points/customer-management/role-management";
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";

export const useRoleManagement = (editData?: RoleManagementType) => {
  const [saveRoleManagement] = useSaveRoleManagementMutation();

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
      
    },
    [reset, saveRoleManagement]
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
