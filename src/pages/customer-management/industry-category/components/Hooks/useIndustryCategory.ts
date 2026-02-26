import { useCallback } from "react";
import { useAppDispatch } from "@/hooks/store";
import { useForm, type Resolver } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import type { IndustryCategoryType } from "@/types/customer-management/industry-category";
import { industryCategorySchema } from "@/global/validation/customer-management-master/industry-category";
import { DEFAULT_VALUES } from "../../constants/IndustryCategoryDefault";
import { useSaveIndustryCategoryMutation } from "@/global/service/end-points/customer-management/industry-category.api";
import { apiInstance } from "@/global/service/api-instance";
import toast from "react-hot-toast";

export const useIndustryCategory = () => {
  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<IndustryCategoryType>({
    defaultValues: DEFAULT_VALUES,
    resolver: yupResolver(
      industryCategorySchema
    ) as Resolver<IndustryCategoryType>,
    mode: "onBlur",
  });

  const [saveIndustryCategory] = useSaveIndustryCategoryMutation();
  const dispatch = useAppDispatch();

  const onSubmit = useCallback(
    async (data: IndustryCategoryType) => {
      try {
        await saveIndustryCategory(data).unwrap();
        try {
          dispatch(
            apiInstance.util.invalidateTags([
              { type: "IndustryCategory", id: "LIST" },
            ])
          );
        } catch {
          // ignore
        }
        try {
          dispatch(
            apiInstance.endpoints.getIndustryCategories.initiate(undefined, {
              forceRefetch: true,
            })
          );
        } catch {
          // ignore
        }
        reset(DEFAULT_VALUES);
        toast.success("Industry Category saved successfully");
      } catch {
        toast.error("Failed to save Industry Category");
      }
    },
    [reset, saveIndustryCategory]
  );

  const onCancel = useCallback(() => {
    reset(DEFAULT_VALUES);
  }, [reset]);

  const onReset = useCallback(() => {
    reset(DEFAULT_VALUES);
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
