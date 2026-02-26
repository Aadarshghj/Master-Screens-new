import { useCallback } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import type {
  UserRegRequestDto,
  UserRegType,
} from "@/types/customer-management/user-reg";
import { userRegSchema } from "@/global/validation/customer-management-master/user-reg";
import { DEFAULT_VALUES } from "../../constants/UserRegDefault";
import { USER_TYPE_OPTIONS } from "@/mocks/customer-management-master/user-reg";
import { logger } from "@/global/service";
import { useSaveUserRegMutation,useUpdateUserRegMutation } from "@/global/service/end-points/customer-management/user-reg";



export const useUserRegForm = () => {
  const [saveUserReg] = useSaveUserRegMutation();
  const [updateUserReg] = useUpdateUserRegMutation();

  const {
    control,
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<UserRegType>({
  defaultValues: {...DEFAULT_VALUES,
  isActive:true,},
  resolver: yupResolver(userRegSchema),
  mode: "onChange",
});

const onSubmit = useCallback(
  async (data: UserRegType) => {
    const payload: UserRegRequestDto = {
      userCode: data.userCode.toUpperCase(),
      userName: data.userName.toUpperCase(),
      email: data.email,
      phoneNumber: data.phoneNumber,
      userType: Number(data.userType),
      fullName:data.fullName.toUpperCase(),
      isActive: data.isActive,
    };
    console.log(payload);

    try {
      if(data.id){
        await updateUserReg({identity:data.id,payload}).unwrap();
      }
      else{
         await saveUserReg(payload).unwrap();
      }
       logger.info("User saved successfully", { toast: true });
       reset(DEFAULT_VALUES);
    
    } catch (error) {
      logger.error("Failed to save user", { toast: true });
    }
  },
  [reset, saveUserReg,updateUserReg]
);
  const onReset = useCallback(() => {
    reset(DEFAULT_VALUES);
  }, [reset]);

  const onCancel = useCallback(() => {
    reset(DEFAULT_VALUES);
  }, [reset]);



  return {
    control,
    register,
    handleSubmit,
     reset,
     onCancel,
    errors,
    isSubmitting,
    userTypeOptions:USER_TYPE_OPTIONS,
    onSubmit,
    onReset,
    setError
  };
};