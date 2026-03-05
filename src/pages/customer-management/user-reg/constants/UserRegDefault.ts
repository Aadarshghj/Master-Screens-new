import type { UserRegType } from "@/types/customer-management/user-reg";

export const DEFAULT_VALUES: UserRegType = {
    id:undefined,
    userCode: "",
    userName: "",
    email: "",
    fullName:"",
    phoneNumber: "",
    userType: "STAFF",
    isActive: true,
};