// service/endpoints/user/user-delegation.ts

import { api } from "@/api";
import { apiInstance } from "../../api-instance";
import type {
  UserDelegationResponse,
  UserDelegationSearchParams,
  UserDelegation,
  OptionType,
} from "@/types/approval-workflow/user-delegation.types";

export const userDelegationApi = apiInstance.injectEndpoints({
  endpoints: builder => ({
    // Get all users for filter dropdowns
    getAllUsers: builder.query<OptionType[], void>({
      query: () => ({
        url: api.workflow.getAllUsers(),
        method: "GET",
      }),
      transformResponse: (
        response:
          | {
              content?: {
                identity: string;
                userName: string;
                userCode: string;
              }[];
            }
          | { identity: string; userName: string; userCode: string }[]
      ) => {
        const users = Array.isArray(response)
          ? response
          : response.content || [];
        return users.map(item => ({
          value: item.identity || item.userCode,
          label: `${item.userName || item.userCode} (${item.userCode || item.identity})`,
        }));
      },
      providesTags: ["Users"],
    }),

    // Get all users for dropdown with search
    getworkflowUsers: builder.query<OptionType[], { user?: string }>({
      query: (params = {}) => ({
        url: api.workflow.getworkflowUsers({ user: params.user || "" }),
        method: "GET",
      }),
      transformResponse: (
        response:
          | {
              content?: {
                identity: string;
                userName: string;
                userCode: string;
              }[];
            }
          | { identity: string; userName: string; userCode: string }[]
      ) => {
        // Handle both array and paginated response
        const users = Array.isArray(response)
          ? response
          : response.content || [];
        return users.map(item => ({
          value: item.identity || item.userCode,
          label: `${item.userName || item.userCode} (${item.userCode || item.identity})`,
        }));
      },
      providesTags: ["Users"],
    }),

    // Get all modules for dropdown
    getModules: builder.query<OptionType[], void>({
      query: () => ({
        url: api.workflow.getModulesForDelegation(),
        method: "GET",
      }),
      transformResponse: (
        response: { moduleIdentity: string; moduleName: string }[]
      ) =>
        response.map(item => ({
          value: item.moduleIdentity,
          label: item.moduleName,
        })),
      providesTags: ["Modules"],
    }),

    // Search user delegations with filters
    searchUserDelegations: builder.query<
      UserDelegationResponse,
      UserDelegationSearchParams
    >({
      query: params => {
        const queryParams = new URLSearchParams();

        if (params.fromUser && params.fromUser !== "all") {
          queryParams.append("fromUserIdentity", params.fromUser);
        }
        if (params.toUser && params.toUser !== "all") {
          queryParams.append("toUserIdentity", params.toUser);
        }
        if (params.page !== undefined) {
          queryParams.append("page", params.page.toString());
        }
        if (params.size !== undefined) {
          queryParams.append("size", params.size.toString());
        }
        queryParams.append("active", "true");

        const queryString = queryParams.toString();
        return {
          url: queryString
            ? `${api.workflow.searchUserDelegations()}?${queryString}`
            : api.workflow.searchUserDelegations(),
          method: "GET",
        };
      },
      providesTags: ["UserDelegations"],
    }),

    // Create user delegation
    createUserDelegation: builder.mutation<
      UserDelegation,
      Omit<UserDelegation, "identity">
    >({
      query: data => {
        return {
          url: api.workflow.createUserDelegation(),
          method: "POST",
          body: data,
        };
      },
      invalidatesTags: ["UserDelegations"],
    }),

    // Update user delegation
    updateUserDelegation: builder.mutation<
      UserDelegation,
      { identity: string } & Partial<UserDelegation>
    >({
      query: ({ identity, ...data }) => {
        return {
          url: api.workflow.updateUserDelegation({ identity }),
          method: "PUT",
          body: data,
        };
      },
      invalidatesTags: ["UserDelegations"],
    }),

    // Delete user delegation
    deleteUserDelegation: builder.mutation<void, string>({
      query: identity => ({
        url: api.workflow.deleteUserDelegation({ identity }),
        method: "DELETE",
      }),
      invalidatesTags: ["UserDelegations"],
    }),

    // Toggle active status
    toggleUserDelegationStatus: builder.mutation<
      UserDelegation,
      { identity: string; active: boolean }
    >({
      query: ({ identity, active }) => ({
        url: `/api/v1/workflows/delegations/${identity}/status`,
        method: "PATCH",
        body: { active },
      }),
      invalidatesTags: ["UserDelegations"],
    }),
  }),
});

export const {
  useGetAllUsersQuery,
  useGetworkflowUsersQuery,
  useGetModulesQuery,
  useSearchUserDelegationsQuery,
  useCreateUserDelegationMutation,
  useUpdateUserDelegationMutation,
  useDeleteUserDelegationMutation,
  useToggleUserDelegationStatusMutation,
} = userDelegationApi;

export const useGetUsersQuery = useGetworkflowUsersQuery;
