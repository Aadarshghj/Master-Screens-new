import { useCallback, useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import toast from "react-hot-toast";
import { subModuleTypeSchema } from "@/global/validation/customer-management-master/sub-module-type";
import type {
  SubModule,
  SubModuleRequestDto,
} from "@/types/customer-management/sub-module-management-type";
import {
  useSaveSubModuleMutation,
  useUpdateSubModuleMutation,
  useGetMasterModulesQuery,
} from "../../../../../global/service/end-points/customer-management/sub-module";

export interface SubModuleFormValues {
  id: string;
  module: string;
  subModuleCode: string;
  subModuleName: string;
  subModuleDescription: string;
  isActive: boolean;
}

const DEFAULT_FORM_VALUES: SubModuleFormValues = {
  id: "",
  module: "",
  subModuleCode: "",
  subModuleName: "",
  subModuleDescription: "",
  isActive: true,
};

export const useSubModuleForm = (
  initialData?: SubModule | null,
  onSuccessCallback?: () => void
) => {
  const isEdit = !!initialData;

  const { data: modules = [], isLoading: isLoadingModules } =
    useGetMasterModulesQuery();
  const moduleOptions = useMemo(() => {
    return modules.map(mod => ({
      label: mod.moduleName,
      value: mod.id,
    }));
  }, [modules]);

  const [saveSubModule] = useSaveSubModuleMutation();
  const [updateSubModule] = useUpdateSubModuleMutation();

  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<SubModuleFormValues>({
    defaultValues: DEFAULT_FORM_VALUES,
    resolver: yupResolver(subModuleTypeSchema),
    mode: "onChange",
  });

  useEffect(() => {
    if (initialData) {
      reset({
        id: initialData.id,
        module: initialData.moduleId || "",
        subModuleCode: initialData.subModuleCode,
        subModuleName: initialData.subModuleName,
        subModuleDescription: initialData.description || "",
        isActive: initialData.isActive,
      });
    } else {
      reset(DEFAULT_FORM_VALUES);
    }
  }, [initialData, reset]);

  const onSubmit = useCallback(
    async (data: SubModuleFormValues) => {
      const payload: SubModuleRequestDto = {
        subModuleName: data.subModuleName.toUpperCase(),
        moduleIdentity: data.module,
        subModuleCode: data.subModuleCode.toUpperCase(),
        description: data.subModuleDescription,
        isActive: String(data.isActive),
      };

      try {
        if (isEdit && data.id) {
          await updateSubModule({ id: data.id, payload }).unwrap();
          toast.success("Sub Module Updated Successfully");
        } else {
          await saveSubModule(payload).unwrap();
          toast.success("Sub Module Added Successfully");
        }

        reset(DEFAULT_FORM_VALUES);
        if (onSuccessCallback) onSuccessCallback();
      } catch {
        toast.error(`Failed to ${isEdit ? "Update" : "Add"} Sub Module`);
      }
    },
    [isEdit, updateSubModule, saveSubModule, reset, onSuccessCallback]
  );

  const onCancel = useCallback(() => {
    reset(DEFAULT_FORM_VALUES);
    if (onSuccessCallback) onSuccessCallback();
  }, [reset, onSuccessCallback]);

  const onReset = useCallback(() => {
    reset(DEFAULT_FORM_VALUES);
  }, [reset]);
  return {
    control,
    register,
    handleSubmit: handleSubmit(onSubmit),
    errors,
    isSubmitting,
    isEdit,
    moduleOptions,
    onCancel,
    onReset,
    isLoadingModules,
  };
};
