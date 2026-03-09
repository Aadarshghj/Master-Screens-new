import {
  useCallback, 
  useEffect,
} from "react";
import { useForm, type Resolver } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import type { 
  ModuleType, 
  ModuleMgmtRequestDto 
} from "@/types/customer-management/module-management";

import {
  useSaveModuleMutation,
  useUpdateModuleMutation
} from "@/global/service/end-points/customer-management/module-management.api";

import toast from "react-hot-toast";
import { MODULE_TYPE_DEFAULT_VALUES } from "../../constants/ModuleMgmtDefault";
import { moduleTypeSchema } from "@/global/validation/customer-management-master/module-management";

export const useModuleMgmtForm = (editData ?: ModuleType) => {
  const [ saveModule ] = useSaveModuleMutation();
  const [ updateModule ] = useUpdateModuleMutation();
  const isEdit = !!editData;

  const {
    control,
    reset,
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ModuleType>({
    defaultValues: MODULE_TYPE_DEFAULT_VALUES,
    resolver: yupResolver(moduleTypeSchema) as Resolver<ModuleType>,
    mode: "onChange",
  });

  useEffect(() => {
  if (editData) {
    reset(editData);
  } else {
    reset(MODULE_TYPE_DEFAULT_VALUES);
  }
}, [editData, reset]);

  const onSubmit = useCallback(
  async (data: ModuleType) => {
    const name = data.moduleName.trim().toUpperCase();

    const payload: ModuleMgmtRequestDto = {
      moduleName: name,
      description: data.description,
      isActive: data.isActive,
      moduleCode: data.moduleCode.trim().toUpperCase(),
    };

    try {
      if (isEdit) {
        const res = await updateModule({
          identity: data.identity,
          payload,
        }).unwrap();
        toast.success(res.message ?? `${name} updated successfully`);
        reset(data);
        return;
      } 
      
      const res = await saveModule(payload).unwrap();
      toast.success(res.message ?? `${name} added successfully`);
      reset(MODULE_TYPE_DEFAULT_VALUES);

    } catch (err: any) {
      toast.error(err?.data?.message ?? `Failed to ${isEdit ? "Update" : "Add"} ${name}`);
    }
  },
  [ isEdit, saveModule, updateModule, reset ]
);        

  const onReset = useCallback(() => {
    reset(MODULE_TYPE_DEFAULT_VALUES);
  },[reset]);

  const onCancel = useCallback(() => {
    reset(MODULE_TYPE_DEFAULT_VALUES);
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
  };
};
