import { useCallback } from "react";
import { useForm, type Resolver } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import type {
  ProductServiceRequestDto,
  ProductServiceType,
} from "@/types/customer-management/product-service";
import { ProductServiceSchema } from "@/global/validation/customer-management-master/product-service";
import { DEFAULT_VALUES } from "../../constants/ProdcuctServiceDefault";
import { useSaveProductServiceMutation } from "@/global/service/end-points/customer-management/product-service.api";
import toast from "react-hot-toast";

export const useProductService = () => {
  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProductServiceType>({
    defaultValues: DEFAULT_VALUES,
    resolver: yupResolver(ProductServiceSchema) as Resolver<ProductServiceType>,
    mode: "onBlur",
  });

  const [saveProductService] = useSaveProductServiceMutation();

  const onSubmit = useCallback(
    async (data: ProductServiceType) => {
      const payload: ProductServiceRequestDto = {
        name: data.productServiceName,
        description: data.description,
      };
      try {
        await saveProductService(payload).unwrap();
        reset(DEFAULT_VALUES);
        toast.success("Product Service saved successfully");
      } catch {
        toast.error("Failed to save Product Service");
      }
    },
    [reset, saveProductService]
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
