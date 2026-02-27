import { useCallback, useState } from "react";
// import { useAppDispatch } from "@/hooks/store";
// import toast from "react-hot-toast";
import { useForm, type Resolver } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
// import { apiInstance } from "@/global/service/api-instance";
import { logger } from "../../../../../../global/service";
import { CONTACT_TYPE_DEFAULT_VALUES } from '../../constants/ContactTypeDefault';
import type { ContactType } from "../../../../../../types/asset-mgmt/contact-type";
import { contactTypeSchema } from "../../../../../../global/validation/asset-mgmt/contact-type";

export const useContactTypeForm = () => {
  // const dispatch = useAppDispatch();

  // const [counter, setCounter] = useState(1);

  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactType>({
    resolver: yupResolver(contactTypeSchema) as Resolver<ContactType>,
    mode: "onBlur",
    reValidateMode: "onChange",
  });

  // const [saveDocumentType] = useSaveAssetCategoryMutation();

  const onSubmit = useCallback(
    async (data: ContactType) => {
      const payload: ContactType = {
        contactType: data.contactType.toUpperCase(),
        contactTypeDesc: data.contactTypeDesc,
        status: data.status,
      };
      try {
        await payload;
        logger.info("Saved", { toast: true });
        reset(CONTACT_TYPE_DEFAULT_VALUES);
      } catch (error) {
        logger.error(error, { toast: true });
      }
    },
    [reset]
  );

  const onCancel = useCallback(() => {
    reset(CONTACT_TYPE_DEFAULT_VALUES);
  }, [reset]);

  const onReset = useCallback(() => {
    reset(CONTACT_TYPE_DEFAULT_VALUES);
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
