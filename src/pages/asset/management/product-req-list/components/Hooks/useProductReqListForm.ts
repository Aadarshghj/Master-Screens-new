import { useCallback } from "react";
import { useForm, type Resolver } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import type { ProductReqList } from "../../../../../../types/asset-mgmt/product-req-list";
import { logger } from "../../../../../../global/service";
import { productReqSchema } from "../../../../../../global/validation/asset-mgmt/product-req-list";
import { PRODUCT_REQ_DEFAULT_FILTER } from '../../constants/ProductReqListDefault';

export const useProductReqListForm = () => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProductReqList>({
    resolver: yupResolver(productReqSchema) as Resolver<ProductReqList>,
    defaultValues: PRODUCT_REQ_DEFAULT_FILTER,
    mode: "onBlur",
    reValidateMode: "onChange",
  });

  const onSubmit = useCallback(
    async (data: ProductReqList) => {
      const payload: ProductReqList = {
        product: data.product,
        status: data.status,
      };

      try {
        // Replace this with actual API call later
        await Promise.resolve(payload);

        logger.info("Product saved successfully", { toast: true });

        reset(PRODUCT_REQ_DEFAULT_FILTER);
      } catch (error) {
        logger.error(error, { toast: true });
      }
    },
    [reset]
  );

  const onCancel = useCallback(() => {
    reset(PRODUCT_REQ_DEFAULT_FILTER);
  }, [reset]);

  const onReset = useCallback(() => {
    reset(PRODUCT_REQ_DEFAULT_FILTER);
  }, [reset]);

  return {
    control,
    handleSubmit,
    errors,
    isSubmitting,
    onSubmit,
    onCancel,
    onReset,
  };
};