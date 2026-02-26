import { useForm } from "react-hook-form";
import type { UserLeaveStatusSearchFormData } from "@/types/approval-workflow/user-leave-status.types";
import { leaveStatusFilterDefaultValue } from "../constants/form.constants";

interface UseUserLeaveStatusFilterProps {
  handleSetUserCode: (code: string) => void;
  handleSetDelegateUserCode: (code: string) => void;
  handlePageChange: (newPage: number) => void;
}

export const useUserLeaveStatusFilter = ({
  handleSetUserCode,
  handleSetDelegateUserCode,
  handlePageChange,
}: UseUserLeaveStatusFilterProps) => {
  const { control, register, handleSubmit, reset, watch, setValue } =
    useForm<UserLeaveStatusSearchFormData>({
      defaultValues: leaveStatusFilterDefaultValue,
    });

  const formValues = watch();

  const onSubmit = (data: UserLeaveStatusSearchFormData) => {
    handlePageChange(0);
    handleSetUserCode(data.userCode ?? "");
    handleSetDelegateUserCode(data.delegateUserCode ?? "");
  };

  const handleReset = () => {
    reset(leaveStatusFilterDefaultValue);
    handlePageChange(0);
    handleSetUserCode("");
    handleSetDelegateUserCode("");
  };

  const clearField = (fieldName: keyof UserLeaveStatusSearchFormData) => {
    setValue(fieldName, "");
  };

  return {
    control,
    register,
    handleSubmit,
    reset,
    formValues,

    onSubmit,
    handleReset,
    clearField,
  };
};
