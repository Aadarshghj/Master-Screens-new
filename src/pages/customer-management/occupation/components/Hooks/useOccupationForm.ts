import { useCallback } from "react";
import { useForm, type Resolver } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import type { Occupation } from "@/types/customer-management/occupation";
import { OCCUPATION_DEFAULT_VALUES } from "../../constants/OccupationDefault";
import { OccupationSchema } from "@/global/validation/customer-management-master/occupation";
import {
  useGetOccupationsQuery,
  useSaveOccupationMutation,
} from "@/global/service/end-points/customer-management/occupation";
import { logger } from "@/global/service";

export const useOccupationForm = () => {
  const [saveOccupation] = useSaveOccupationMutation();
  const { refetch } = useGetOccupationsQuery();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<Occupation>({
    defaultValues: OCCUPATION_DEFAULT_VALUES,
    resolver: yupResolver(OccupationSchema) as Resolver<Occupation>,
    mode: "onBlur",
  });

  const onSubmit = useCallback(
    async (data: Occupation) => {
      try {
        const payload = {
          occupationName: data.occupationType.toUpperCase(),
        };
        await saveOccupation(payload).unwrap();
        refetch();
        reset(OCCUPATION_DEFAULT_VALUES);
        logger.info("Occupation Created Successfully", { toast: true });
      } catch (error) {
        logger.error(error, { toast: true });
      }
    },
    [reset, refetch, saveOccupation]
  );

  const onCancel = () => reset(OCCUPATION_DEFAULT_VALUES);
  const onReset = () => reset(OCCUPATION_DEFAULT_VALUES);

  return {
    register,
    handleSubmit,
    errors,
    isSubmitting,
    onSubmit,
    onCancel,
    onReset,
  };
};
