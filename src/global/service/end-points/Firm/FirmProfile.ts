import { apiInstance } from "../../api-instance";
import { api } from "@/api";

export interface FirmProfileResponse {
  firmId: string;
  firmName: string;
}

export const firmProfileApiService = apiInstance.injectEndpoints({
  endpoints: build => ({
    getFirmById: build.query<FirmProfileResponse, string>({
      query: firmId => ({
        url: api.firm.getFirmById({ firmId }),
        method: "GET",
      }),
    }),

    updateFirm: build.mutation<
      FirmProfileResponse,
      {
        firmId: string;
        data: Record<string, unknown>;
        existingData?: Record<string, unknown>;
      }
    >({
      query: ({ firmId, data, existingData }) => {
        // Use exact structure from working payload
        const payload = {
          firmTypeIdentity: data.typeOfFirm,
          branchIdentity: "5a97dec0-c7e8-4fc2-8ec9-11c9a680479a",
          tenatIdentity: "1563455e-fb89-4049-9cbe-02148017e1e6",
          firmName: data.firmName,
          industryCategoryIdentity: data.productIndustryCategory,
          registrationNo: data.registrationNo,
          registrationDate: data.registrationDate,
          canvassedTypeIdentity: data.canvassedType,
          canvassorId: 101,
          firmCode: existingData?.firmCode,
          status: existingData?.status,
          associatedPersons: (
            (data.associatedPersons as Record<string, unknown>[]) || []
          ).map((person: Record<string, unknown>) => {
            const existingPerson = (
              (existingData?.associatedPersons as Record<string, unknown>[]) ||
              []
            ).find(
              (existing: Record<string, unknown>) =>
                existing.customerCode === person.customerCode
            );

            const result: Record<string, unknown> = {
              customerCode: person.customerCode,
              customerName: person.customerName,
              roleInFirmIdentity: person.roleInFirm,
              authorizedSignatory: Boolean(person.authorizedSignatory),
              durationWithCompany: Number(person.durationWithCompany),
            };

            // Add proper customerIdentity (UUID, not code)
            if (existingPerson?.customerIdentity) {
              result.customerIdentity = existingPerson.customerIdentity;
            } else if (
              person.customerIdentity &&
              person.customerIdentity !== person.customerCode
            ) {
              result.customerIdentity = person.customerIdentity;
            }

            // CRITICAL: Include identity for existing records
            if (existingPerson?.identity) {
              result.identity = existingPerson.identity;
            }

            return result;
          }),
        };

        return {
          url: api.firm.updateFirm({ firmId }),
          method: "PUT",
          data: payload,
        };
      },
      transformErrorResponse: (response: { data?: unknown }) => {
        return response.data;
      },
    }),
  }),
});

export const { useGetFirmByIdQuery, useUpdateFirmMutation } =
  firmProfileApiService;
