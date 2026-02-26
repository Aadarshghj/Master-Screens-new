import type {
  AgentMasterRequestDto,
  AgentMasterResponeDto,
} from "@/types/customer-management/agent-master";
import { apiInstance } from "../../api-instance";
import { api } from "@/api";

export const agentMasterApiService = apiInstance.injectEndpoints({
  endpoints: build => ({
    saveAgentMaster: build.mutation<
      AgentMasterResponeDto,
      AgentMasterRequestDto
    >({
      query: payload => ({
        url: api.agentMaster.save(),
        method: "POST",
        data: payload,
      }),
      invalidatesTags: ["AgentMaster"],
    }),

    getAgentMasters: build.query<AgentMasterResponeDto[], void>({
      query: () => ({
        url: api.agentMaster.get(),
        method: "GET",
      }),
      providesTags: ["AgentMaster"],
    }),
    deleteAgentMaster: build.mutation<void, string>({
      query: identity => ({
        url: `${api.agentMaster.get()}/${identity}`,
        method: "DELETE",
      }),
      invalidatesTags: ["AgentMaster"],
    }),
  }),
});

export const {
  useSaveAgentMasterMutation,
  useGetAgentMastersQuery,
  useDeleteAgentMasterMutation,
} = agentMasterApiService;
