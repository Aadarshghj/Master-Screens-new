import type { UserRegType } from "@/types/customer-management/user-reg";

export const DEFAULT_VALUES: UserRegType = {
    id:"",
    userCode: "",
    userName: "",
    email: "",
    fullName:"",
    phoneNumber: "",
    userType: "3",
    isActive: true,
};