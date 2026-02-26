import { useCallback, useState, useEffect } from "react";
import { useForm ,type Resolver } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import type {
  AdminUnitType,
  AdminUnitRequestDto,
} from "@/types/customer-management/admin-unit-type"

import { 
  useSaveAdminUnitTypeMutation,
  useUpdateAdminUnitTypeMutation
  } from "@/global/service/end-points/customer-management/admin-unit-type.api";

import { toast } from "react-hot-toast";
import { adminUnitTypeSchema } from "@/global/validation/customer-management-master/admin-unit-type"
import { ADMIN_UNIT_TYPE_DEFAULT_VALUES } from "../../constants/AdminUnitTypeDefault"

export const useAdminUnitForm = (editData ?: AdminUnitType) => {
  const [saveAdminUnit] = useSaveAdminUnitTypeMutation();
  const [updateAdminUnit] = useUpdateAdminUnitTypeMutation();
  const [ isEdit, setIsEdit ] = useState<boolean>(!!editData);

  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<AdminUnitType>({
    defaultValues: editData ?? ADMIN_UNIT_TYPE_DEFAULT_VALUES,
    resolver: yupResolver(adminUnitTypeSchema) as Resolver<AdminUnitType>,
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
  async (data: AdminUnitType) => {
    const name = data.adminUnitType.trim().toUpperCase();

    const payload: AdminUnitRequestDto = {
      adminUnitTypeName: name,
      description: data.description?.trim() ?? "",
      isActive: data.isActive,
      adminUnitTypeCode: data.adminUnitCode,
      hierarchyLevel: Number(data.hierarchyLevel)
    };

    try {
      if (isEdit) {
        const res = await updateAdminUnit({
          identity: data.identity,
          payload,
        }).unwrap();
        toast.success(res.message ?? `${name} updated successfully`);
        reset(data);
        setIsEdit(false);
        return;
      } 
      
      const res = await saveAdminUnit(payload).unwrap();
      toast.success(res.message ?? `${name} added successfully`);
      reset(ADMIN_UNIT_TYPE_DEFAULT_VALUES);
      setIsEdit(false);

    } catch (err: any) {
      toast.error( err?.data?.message ?? `Failed to ${isEdit ? "update" : "add"} ${name}`);
    }
  },
  [ isEdit, saveAdminUnit, updateAdminUnit, reset]
);        

  const onReset = useCallback(() => {
    reset(ADMIN_UNIT_TYPE_DEFAULT_VALUES);
    setIsEdit(false);
  },[reset]);

  const onCancel = useCallback(() => {
    reset(ADMIN_UNIT_TYPE_DEFAULT_VALUES);
    setIsEdit(false);
  },[reset])

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