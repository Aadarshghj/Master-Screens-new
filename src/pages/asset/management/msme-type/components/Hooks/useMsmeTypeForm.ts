import { useCallback, useState } from "react";
// import { useAppDispatch } from "@/hooks/store";
// import toast from "react-hot-toast";
import { useForm, type Resolver } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
// import { apiInstance } from "@/global/service/api-instance";
import type { MsmeType } from "../../../../../../types/asset-mgmt/msme-type";
import { logger } from "../../../../../../global/service";
import { msmeTypeSchema } from '../../../../../../global/validation/asset-mgmt/msme-type';
import { MSME_TYPE_DEFAULT_VALUES } from '../../constants/MsmeTypeDefault';

export const useMsmeTypeForm = () => {
  // const dispatch = useAppDispatch();

  // const [counter, setCounter] = useState(1);

  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<MsmeType>({
    resolver: yupResolver(msmeTypeSchema) as Resolver<MsmeType>,
    mode: "onBlur",
    reValidateMode: "onChange",
  });

  // const [saveDocumentType] = useSaveAssetCategoryMutation();

  const onSubmit = useCallback(
    async (data: MsmeType) => {
      const payload: MsmeType = {
        msmeType: data.msmeType.toUpperCase(),
        msmeTypeDesc: data.msmeTypeDesc,
        status: data.status,
      };
      try {
        await payload;
        logger.info("Saved", { toast: true });
        reset(MSME_TYPE_DEFAULT_VALUES);
      } catch (error) {
        logger.error(error, { toast: true });
      }
    },
    [reset]
  );

  const onCancel = useCallback(() => {
    reset(MSME_TYPE_DEFAULT_VALUES);
  }, [reset]);

  const onReset = useCallback(() => {
    reset(MSME_TYPE_DEFAULT_VALUES);
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
