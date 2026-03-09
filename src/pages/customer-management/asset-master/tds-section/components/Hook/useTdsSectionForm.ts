import { useCallback } from "react";
import { useForm ,type Resolver } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import toast from "react-hot-toast";
import type { TdsSectionRequestDto, TdsSectionTypes } from "@/types/customer-management/asset-master/tds-section";
import { TDS_SECTION_DEFAULT_VALUES } from "../../constants/TdsSectionDefault";
import { tdsSectionSchema } from "@/global/validation/customer-management-master/asset-master/tds-section";

export const useTdsSectionForm = (editData ?:TdsSectionTypes) => {

  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<TdsSectionTypes>({
    defaultValues: editData?? TDS_SECTION_DEFAULT_VALUES,
    resolver: yupResolver(tdsSectionSchema) as Resolver<TdsSectionTypes>,
    mode: "onChange",
  });

  
 const onSubmit = useCallback(
  async (data: TdsSectionTypes) => {
    const name = data.tdsSectionType.toUpperCase();

    const payload: TdsSectionRequestDto = {
      tdsSectionType: name,
      description: data.description,
      isActive: data.isActive,
    };
    try {
            await payload;
            reset(TDS_SECTION_DEFAULT_VALUES);
            toast.success("TDS Section saved successfully");
          } catch {
            toast.error("Failed to save TDS Section");
          }
        },
        [reset]
    );
    
   
const onCancel = useCallback( () => {
    reset(TDS_SECTION_DEFAULT_VALUES);
  },[reset]);

  const onReset = useCallback( () => {
    reset(TDS_SECTION_DEFAULT_VALUES);
  },[reset]);

  return {
    control,
    register,
    handleSubmit,
    errors,
    isSubmitting,
    onSubmit,
    onReset,
    reset,
    onCancel,
    
  };
};
