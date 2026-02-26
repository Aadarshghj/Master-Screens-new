import type {
  UserRegType,
  UserRegRequestDto,
  UserRegResponseDto,
  UserSearchResponseDto,
} from "@/types/customer-management/user-reg";
import { apiInstance } from "../../api-instance";
import { api } from "@/api";
import { userReg } from "@/api/customer-management/user-reg";

export const userRegistrationApiService = apiInstance.injectEndpoints({
  endpoints: build => ({
    saveUserReg: build.mutation<
      UserRegResponseDto,
      UserRegRequestDto
    >({
      query: payload => ({
        url: api.userReg.save(),
        method: "POST",
        data: payload as unknown as Record<string, unknown>,
      }),
      invalidatesTags: ["UserReg"],
    }),

    getMasterUserReg: build.query<UserRegType[], void>({
      query: () => ({
        url: api.userReg.get(),
        method: "GET",
      }),
      providesTags: ["UserReg"],

      transformResponse: (
        response: UserRegResponseDto[]
      ): UserRegType[] =>
        response.map(item => ({
          id:item.identity,
          userCode: item.userCode,
          userName: item.userName,
          fullName: item.fullName,
          email: item.email,
          phoneNumber: item.phoneNumber,
          userType: item.userType,
          isActive:item.isActive
        })),
    }),

  updateUserReg: build.mutation<
  UserRegResponseDto,
  { identity: string; payload: UserRegRequestDto }
>({
  query: ({ identity, payload }) => ({
    url: api.userReg.update(identity),
    method: "PUT",
    data: payload as unknown as Record<string, unknown>,
  }),
  invalidatesTags: ["UserReg"],
}),

getUserById: build.query<UserRegType, string>({
  query: identity => ({
    url: api.userReg.getById(identity),
    method: "GET",
  }),
  transformResponse: (item: UserRegResponseDto): UserRegType => ({
    id: item.identity,
    userCode: item.userCode,
    userName: item.userName,
    fullName: item.fullName,
    email: item.email,
    phoneNumber: item.phoneNumber,
    userType: item.userType,
    isActive: item.isActive
  }),
}),

searchUsers: build.query<UserRegType[], { userCode?: string; userName?: string; page?: number }>({
  query: params => ({
    url: api.userReg.search(params),
    method: "GET",
  }),
  providesTags: ["UserReg"],
}),

searchUserReg: build.query<UserSearchResponseDto, string>({
  query: (userName) => ({
    url: userReg.search({ userName }),
    method: "GET",
  }),
}),


    deleteUserReg: build.mutation<void, string>({
      query: userRegId => ({
        url: api.userReg.delete(userRegId),
        method: "DELETE",
      }),
      invalidatesTags: ["UserReg"],
    }),
  }),
});

export const {
  useSaveUserRegMutation,
  useUpdateUserRegMutation,
  useGetMasterUserRegQuery,

  useLazyGetUserByIdQuery,
  
  useLazyGetMasterUserRegQuery,
  useDeleteUserRegMutation,
  useSearchUserRegQuery,
  useLazySearchUserRegQuery
} = userRegistrationApiService;
