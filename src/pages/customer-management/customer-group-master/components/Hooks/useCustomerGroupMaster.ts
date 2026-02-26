import { useCallback } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import type {
  CustomerGroupRequestDto,
  CustomerGroupFormType,
} from "@/types/customer-management/customer-group-master";
import { CUSTOMER_GROUP_DEFAULT_VALUES } from "../../constants/CustomerGroupMasterDefault";
import { customerGroupSchema } from "@/global/validation/customer-management-master/customer-group-master";
import { useSaveCustomerGroupMutation } from "@/global/service/end-points/customer-management/customer-group.api";
import { logger } from "@/global/service";
import toast from "react-hot-toast";

export const useCustomerGroup = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CustomerGroupFormType>({
    defaultValues: CUSTOMER_GROUP_DEFAULT_VALUES,
    resolver: yupResolver(customerGroupSchema),
    mode: "onBlur",
  });

  const [saveCustomerGroup] = useSaveCustomerGroupMutation();

  const onSubmit = useCallback(
    async (data: CustomerGroupFormType) => {
      const payload: CustomerGroupRequestDto = {
        customerGroup: data.customerGroupName,
        code: data.customerGroupCode,
      };
      try {
        await saveCustomerGroup(payload).unwrap();
        reset(CUSTOMER_GROUP_DEFAULT_VALUES);
        toast.success("Customer group saved successfully");
      } catch {
        logger.error("Save customer group failed");
      }
    },
    [reset, saveCustomerGroup]
  );

  const onCancel = useCallback(() => {
    reset(CUSTOMER_GROUP_DEFAULT_VALUES);
  }, [reset]);

  const onReset = useCallback(() => {
    reset(CUSTOMER_GROUP_DEFAULT_VALUES);
  }, [reset]);

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
