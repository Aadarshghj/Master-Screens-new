import { useCallback } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { roleManagementSchema } from "@/global/validation/customer-management-master/role-management";
import { ROLE_MANAGEMENT_DEFAULT_VALUES } from "../../constants/RoleManagementDefault";
import type {
  RoleManagementRequestDto,
  RoleManagementType,
} from "@/types/customer-management/role-management";
import {
  useSaveRoleManagementMutation,
  useUpdateRoleManagementMutation,
} from "@/global/service/end-points/customer-management/role-management";
import { logger } from "@/global/service";

export const useRoleManagement = (editData?: RoleManagementType) => {
  const [saveRoleManagement] = useSaveRoleManagementMutation();
  const[updateRoleManagement]=useUpdateRoleManagementMutation()

  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<RoleManagementType>({
    defaultValues: editData ?? ROLE_MANAGEMENT_DEFAULT_VALUES,
    resolver: yupResolver(roleManagementSchema) ,
    mode: "onChange",
  });

const onSubmit = useCallback(
  async (data: RoleManagementType) => {
    const payload: RoleManagementRequestDto = {
      roleCode: data.roleCode,
      roleName: data.roleName.toUpperCase(),
      roleShortDesc: data.roleShortDesc,
      isActive: data.isActive,
      accesslevel:data.accesslevel
    };

    try {
      console.log("Payload:", payload);

      if (data.identity) {
        // UPDATE
        await updateRoleManagement({
          identity: data.identity,
          payload: payload
        }).unwrap();

        logger.info("Role Updated Successfully", { toast: true });

      } else {
        // CREATE
        await saveRoleManagement(payload).unwrap();

        logger.info("Role Saved Successfully", { toast: true });
      }

      reset(ROLE_MANAGEMENT_DEFAULT_VALUES);

    } catch (error) {
      logger.error("Save Failed", { toast: true });
      console.error("Save failed:", error);
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
