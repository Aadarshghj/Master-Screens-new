import { useCallback } from "react";
import { useForm, type Resolver } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import type { SitePRemiseType } from "@/types/customer-management/site-premise";
import { SitePremiseSchema } from "@/global/validation/customer-management-master/site-premise";
import { DEFAULT_VALUES } from "../../constants/SitePremiseDefault";
import { useSaveSitePremiseMutation } from "@/global/service/end-points/customer-management/site-premise.api";
import toast from "react-hot-toast";

export const useSitePremise = () => {
  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<SitePRemiseType>({
    defaultValues: DEFAULT_VALUES,
    resolver: yupResolver(SitePremiseSchema) as Resolver<SitePRemiseType>,
    mode: "onBlur",
  });

  const [saveSitePremise] = useSaveSitePremiseMutation();

  const onSubmit = useCallback(
    async (data: SitePRemiseType) => {
      try {
        await saveSitePremise(data).unwrap();
        reset(DEFAULT_VALUES);
        toast.success("Site Premise saved successfully");
      } catch {
        toast.error("Failed to save Site Premise");
      }
    },
    [reset, saveSitePremise]
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
