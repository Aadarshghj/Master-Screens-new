import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { logger } from "../../../../../global/service";
import { branchTypeSchema } from "../../../../../global/validation/customer-management-master/branch-type";
import {
  BranchType,
  BranchTypeRequestDto,
} from "../../../../../types/customer-management/branch-type";
import { DEFAULT_BRANCH_TYPE } from "../../constants/BranchTypeMasterDefaults";
import { getErrorMessage } from '../../../../../utils/error.utils';
import {
  useSaveBranchTypeMutation,
  useUpdateBranchTypeMutation,
  useLazyGetBranchTypeByIdQuery,
} from "../../../../../global/service/end-points/customer-management/branch-type";

export const useBranchTypeMasterForm = (onSuccess?: () => void) => {
  const {
    control,
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<BranchType>({
    defaultValues: DEFAULT_BRANCH_TYPE,
    resolver: yupResolver(branchTypeSchema),
    mode: "onTouched",
    reValidateMode: "onChange",
  });

  const [saveBranchType] = useSaveBranchTypeMutation();
  const[updateBranchType] = useUpdateBranchTypeMutation();
  const [getBranchTypeById] = useLazyGetBranchTypeByIdQuery();
  const [isEdit, setIsEdit] = useState(false);
  

const onSubmit = async (data: BranchType) => {

  try {
    const payload: BranchTypeRequestDto = {
      branchTypeCode: data.branchTypeCode.trim(),
      branchTypeName: data.branchTypeName.trim(),
      description: data.branchTypeDesc?.trim(),
    };

    if (data.branchTypeIdentity) {
      await updateBranchType({
        branchTypeId: data.branchTypeIdentity,
        payload,
      }).unwrap();
      logger.info("Branch Type Updated Successfully", { toast: true });
    } else {
      await saveBranchType(payload).unwrap();
      logger.info("Branch Type Saved Successfully", { toast: true });
    }

    onReset();
    onSuccess?.();
  } catch (err) {
  const errorObj = err as {
    data?: { message?: string; error?: string };
    message?: string;
  };

  const message =
    errorObj?.data?.message ||
    errorObj?.data?.error ||
    errorObj?.message ||
    "Something went wrong";

  logger.error(message, { toast: true });
}
};
    const loadBranchType = async (id: string) => {
      try {
        const res = await getBranchTypeById(id).unwrap();

        reset({
          branchTypeIdentity: res.branchTypeIdentity,
          branchTypeCode: res.code,
          branchTypeName: res.name,
          branchTypeDesc: res.description,
          isActive: res.isActive,
        });
      } catch (err){
        logger.error(getErrorMessage(err), {toast: true});
      }
    };

  const handleEdit = async (data: BranchType) => {
    setIsEdit(true);
    
    if (data.branchTypeIdentity) {
    await loadBranchType(data.branchTypeIdentity);
  }
  }

  const onCancel = useCallback(() => {
    reset(DEFAULT_BRANCH_TYPE);
  }, [reset]);

  const onReset = useCallback(() => {
    reset(DEFAULT_BRANCH_TYPE);
  }, [reset]);

  return {
    control,
    register,
    handleSubmit,
    isEdit,
    handleEdit,
    errors,
    isSubmitting,
    loadBranchType,
    onSubmit,
    onCancel,
    onReset,
    reset,
  };
};
