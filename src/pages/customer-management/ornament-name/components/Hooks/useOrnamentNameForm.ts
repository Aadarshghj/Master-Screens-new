import { useCallback, useEffect, useMemo } from "react";
import { useForm, type Resolver } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import type { 
  OrnamentNameData, 
  OrnamentNameRequestDto,
  Option,
  // OrnamentType,
  
 } from "@/types/customer-management/ornament-name";

 import {
  useSaveOrnamentNameMutation,
  useUpdateOrnamentNameMutation,
  useGetOrnamentTypeQuery
} from "@/global/service/end-points/customer-management/ornament-name.api";

import toast from "react-hot-toast";
import { OrnamentNameSchema } from "@/global/validation/customer-management-master/ornament-name";
import { ORNAMENT_NAME_DEFAULT_VALUES } from "../../constants/OrnamentNameDefault";

export const useOrnamentNameForm = (editData?: OrnamentNameData) => {
  const [ saveOrnamentName ] = useSaveOrnamentNameMutation();
  const [ updateOrnamentName ] = useUpdateOrnamentNameMutation();
  const { data: oTypes = [] } = useGetOrnamentTypeQuery();
  
  const isEdit = !!editData;

 const oTypesOption: Option[]  = useMemo(() => {
    return oTypes.map(item => ({
      value: item.identity,
      label: item.name,
    }));
  }, [oTypes]);

  console.log(oTypesOption);
  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<OrnamentNameData>({
    defaultValues: editData ?? ORNAMENT_NAME_DEFAULT_VALUES,
    resolver: yupResolver(OrnamentNameSchema) as Resolver<OrnamentNameData>,
    mode: "onChange",
  });

  useEffect(() => {
    if (editData) {
      reset(editData);
    } else {
      reset(ORNAMENT_NAME_DEFAULT_VALUES);
    }
  }, [editData, reset]);

  const onSubmit = useCallback(
    async (data: OrnamentNameData) => {
      const name=data.ornamentName.trim().toUpperCase();
      const payload: OrnamentNameRequestDto = {
      name: name,
      ornamentTypeIdentity: data.ornamentTypeIdentity,
      description: data.description,
      isActive: data.isActive,
      code: data.ornamentCode.trim().toUpperCase(),
    };

    try {
      if (isEdit) {
        const res = await updateOrnamentName({
          identity: data.identity,
          payload,
        }).unwrap();
        toast.success(res.message ?? `${name} updated successfully`);
        reset(data);
        return;
      } 
      
      const res = await saveOrnamentName(payload).unwrap();
      toast.success(res.message ?? `${name} added successfully`);
      reset(ORNAMENT_NAME_DEFAULT_VALUES);

    } catch (err: any) {
      toast.error(err?.data?.message ?? `Failed to ${isEdit ? "Update" : "Add"} ${name}`);
    }
  },
  [ isEdit, saveOrnamentName, updateOrnamentName, reset ]
);        

  const onReset = useCallback(() => {
    reset(ORNAMENT_NAME_DEFAULT_VALUES);
  }, [reset]);

  const onCancel = useCallback(() => {
    reset(ORNAMENT_NAME_DEFAULT_VALUES);
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
    oTypesOption
  };
};