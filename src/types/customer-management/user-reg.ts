export interface UserRegType  {
    id?:string;
    userCode: string;
    userName: string;
    email: string;
    phoneNumber: string;
    userType: string;
    fullName:string;
    isActive: boolean;

}

export interface UserRegRequestDto
  extends Record<string, unknown> {

    userCode: string;
    userName: string;
    email: string;
    phoneNumber: string;
    userType: number;
    fullName:string;
  isActive: boolean;
}
export interface UserRegResponseDto{
    identity:string,
    userCode: string;
    userName: string;
    email: string;
    phoneNumber: string;
    userType: string;
    fullName:string;
    isActive: boolean;
}

export interface Option {
  value: string;
  label: string;
}

export interface UserSearchResponseDto {
  content: UserRegResponseDto[];
}