import  type { UserRegType }  from "@/types/customer-management/user-reg";

export const USER_REG_SAMPLE_DATA: UserRegType[] =[
     {
    userCode:"",
    userName: "ADMIN",
    email: "rahul.sharma@example.com",
    phoneNumber: "-- --",
    fullName:"Admin Rahul",
    userType: "3",
    isActive: true,
  },
  {
    userCode:"",
    userName: "SUPER ADMIN",
    email: "priya.varma@example.com",
     phoneNumber: "-- --",
    fullName:"Priya Varma",
    userType: "3",
    isActive: true,
  }
]

export const USER_TYPE_OPTIONS = [
  { value: "1", label: "SYSTEM USER" },
  { value: "2", label: "CUSTOMER" },
  { value: "3", label: "STAFF" },
];