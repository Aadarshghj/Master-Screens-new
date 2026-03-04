import { apiInstance } from "../../api-instance";
import { api } from "@/api";
import type {
  LeadSearchParams,
  LeadSearchResponse,
  BulkAssignPayload,
  UpdateAssignmentPayload,
  AssignmentHistory,
} from "@/types/lead/lead-assignment.types";

interface UserResponse {
  identity: string;
  userName: string;
}

interface AssignedUser {
  identity: string;
  userId: number;
  userCode: string;
  userName: string;
}

interface AssignmentHistoryResponse {
  leadResponseDto: {
    leadIdentity: string;
    leadCode: string;
    status: string;
    leadDetails: {
      fullName: string;
    };
  };
  assignedTo?: AssignedUser;
  assignedBy?: AssignedUser;
  assignedOn: string;
  status: string;
  remarks?: string;
  leadAssignIdentity: string;
}

interface LeadWithAssignmentHistory {
  assignmentHistory: AssignmentHistoryResponse[];
}

export const leadAssignmentApiService = apiInstance.injectEndpoints({
  endpoints: build => ({
    searchLeadAssignments: build.query<LeadSearchResponse, LeadSearchParams>({
      query: params => {
        const queryParams = new URLSearchParams();

        queryParams.append("page", params.page.toString());
        queryParams.append("size", params.size.toString());

        if (params.leadDate) queryParams.append("leadDate", params.leadDate);
        if (params.leadProduct && params.leadProduct !== "all") {
          queryParams.append("leadProduct", params.leadProduct);
        }
        if (params.leadSource && params.leadSource !== "all") {
          queryParams.append("leadSource", params.leadSource);
        }
        if (params.leadStage && params.leadStage !== "all") {
          queryParams.append("leadStage", params.leadStage);
        }
        if (params.gender && params.gender !== "all") {
          queryParams.append("gender", params.gender);
        }

        return {
          url: `${api.lead.searchLeadAssignments()}?${queryParams.toString()}`,
          method: "GET",
        };
      },
    }),
    bulkAssignLeads: build.mutation<{ message: string }, BulkAssignPayload>({
      query: payload => {
        return {
          url: api.lead.bulkAssignLeads(),
          method: "PUT",
          data: {
            leadIdentities: payload.leadIdentitys,
            assignedToUserIdentity: payload.assignToUserIdentity,
            assignedOn: payload.assignmentDate,
            // remarks: "Bulk assignment",
          },
        };
      },
    }),

    updateLeadAssignment: build.mutation<
      { message: string },
      {
        leadIdentity: string;
        payload: UpdateAssignmentPayload;
        assignedByIdentity: string;
      }
    >({
      query: ({ leadIdentity, payload, assignedByIdentity }) => ({
        url: api.lead.updateLeadAssignment({ leadIdentity }),
        method: "PUT",
        params: {
          assignedToIdentity: payload.assignToUserIdentity,
          assignedByIdentity: assignedByIdentity,
          assignedOn: payload.assignmentDate,
        },
      }),
    }),

    getAssignmentHistory: build.query<AssignmentHistory[], string>({
      query: leadIdentity => {
        return {
          url: api.lead.getAssignmentHistory({ leadId: leadIdentity }),
          method: "GET",
        };
      },

      transformResponse: (
        response:
          | AssignmentHistoryResponse[]
          | { content: LeadWithAssignmentHistory[] }
      ): AssignmentHistory[] => {
        if (Array.isArray(response)) {
          if (response.length > 0) {
            // empty block
          }

          const transformedData = response.map(
            (item: AssignmentHistoryResponse) => {
              const transformed = {
                leadIdentity: item.leadResponseDto?.leadIdentity || "",
                leadCode: item.leadResponseDto?.leadCode || "",
                fullName: item.leadResponseDto?.leadDetails?.fullName || "",
                assignedTo: item.assignedTo?.userName || "-",
                assignedBy: item.assignedBy?.userName || "-",
                assignedOn: item.assignedOn || "",
                status: item.status || "",
                remarks: item.remarks || "-",
              };

              return transformed;
            }
          );

          const sortedData = transformedData.sort((a, b) => {
            if (a.status === "ACTIVE" && b.status !== "ACTIVE") return -1;
            if (b.status === "ACTIVE" && a.status !== "ACTIVE") return 1;
            const dateA = new Date(a.assignedOn);
            const dateB = new Date(b.assignedOn);
            return dateB.getTime() - dateA.getTime();
          });

          return sortedData;
        }

        if (response?.content && Array.isArray(response.content)) {
          const lead = response.content[0];

          if (!lead?.assignmentHistory) {
            return [];
          }

          const transformedData = lead.assignmentHistory.map(
            (item: AssignmentHistoryResponse) => ({
              leadIdentity: item.leadResponseDto?.leadIdentity || "",
              leadCode: item.leadResponseDto?.leadCode || "",
              fullName: item.leadResponseDto?.leadDetails?.fullName || "",
              assignedTo: item.assignedTo?.userName || "-",
              assignedBy: item.assignedBy?.userName || "-",
              assignedOn: item.assignedOn || "",
              status: item.status || "",
              remarks: item.remarks || "-",
            })
          );

          return transformedData.sort(
            (a: AssignmentHistory, b: AssignmentHistory) => {
              if (a.status === "ACTIVE" && b.status !== "ACTIVE") return -1;
              if (b.status === "ACTIVE" && a.status !== "ACTIVE") return 1;
              const dateA = new Date(a.assignedOn);
              const dateB = new Date(b.assignedOn);
              return dateB.getTime() - dateA.getTime();
            }
          );
        }

        return [];
      },
    }),

    getStaff: build.query<Array<{ value: string; label: string }>, void>({
      query: () => ({
        url: api.lead.getUsers(),
        method: "GET",
      }),
      transformResponse: (response: UserResponse[]) => {
        if (Array.isArray(response)) {
          return response.map((item: UserResponse) => ({
            value: item.identity || "",
            label: item.userName || "",
          }));
        }
        return [];
      },
    }),
  }),
});

export const {
  useSearchLeadAssignmentsQuery,
  useBulkAssignLeadsMutation,
  useUpdateLeadAssignmentMutation,
  useGetAssignmentHistoryQuery,
  useGetStaffQuery,
} = leadAssignmentApiService;
