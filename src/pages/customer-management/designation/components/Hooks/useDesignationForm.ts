import { useCallback, useMemo } from "react";
import { useForm, type Resolver } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import type {
  DesignationType,
  DesignationRequestDto,
} from "@/types/customer-management/designation";
import { useSaveDesignationMutation } from "@/global/service/end-points/customer-management/designation";
import { useGetOccupationsQuery } from "@/global/service/end-points/customer-management/occupation";

import { logger } from "@/global/service";
import { designationSchema } from "@/global/validation/customer-management-master/designation";
import { DEFAULT_VALUES } from "../../constants/DesignationDefault";
import type { OccupationTableRow } from "@/types/customer-management/occupation";

export const useDesignationForm = () => {
  const [saveDesignation] = useSaveDesignationMutation();
  const { data: occupations = [] } = useGetOccupationsQuery();

  const occupationOptions: OccupationTableRow[] = useMemo(
    () =>
      occupations.map(item => ({
        value: item.value,
        label: item.label,
      })),
    [occupations]
  );

  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<DesignationType>({
    defaultValues: DEFAULT_VALUES,
    resolver: yupResolver(designationSchema) as Resolver<DesignationType>,
    mode: "onBlur",
  });

  const onSubmit = useCallback(
    async (data: DesignationType) => {
      const payload: DesignationRequestDto = {
        name: data.designationName.trim(),
        code: data.designationCode.trim(),
        description: data.description?.trim(),
        level: Number(data.level),
        isManagerial: data.managerial,
        occupationIdentity: data.occupation,
      };

      try {
        await saveDesignation(payload).unwrap();
        logger.info("Designation saved successfully", { toast: true });
        reset(DEFAULT_VALUES);
      } catch (error) {
        logger.error(error, { toast: true });
      }
    },
    [saveDesignation, reset]
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
    occupationOptions,
    onSubmit,
    onCancel,
    onReset,
  };
};
