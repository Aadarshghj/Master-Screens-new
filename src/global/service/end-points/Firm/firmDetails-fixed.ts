import type { FirmProfile } from "@/types/firm/firm-details.types";
import { apiInstance } from "../../api-instance";
import { api } from "@/api";

export const firmApiServiceFixed = apiInstance.injectEndpoints({
  endpoints: build => ({
    // Create firm with fixed customerIdentity logic
    createFirmFixed: build.mutation<FirmProfile, Partial<FirmProfile>>({
      query: firmData => {
        const payload = {
          firmTypeIdentity:
            firmData.typeOfFirm || "6a308a25-2cfe-4024-be28-49fbb5cb4ee6",
          branchIdentity: "5a97dec0-c7e8-4fc2-8ec9-11c9a680479a",
          tenatIdentity: "1563455e-fb89-4049-9cbe-02148017e1e6",
          firmName: firmData.firmName?.trim(),
          industryCategoryIdentity: firmData.productIndustryCategory,
          registrationNo: firmData.registrationNo?.trim(),
          registrationDate: firmData.registrationDate,
          canvassedTypeIdentity:
            firmData.canvassedType || "f79ed553-edf5-4b65-8550-b67306406b4b",
          canvasserIdentity: firmData.canvasserIdentity
            ? parseInt(firmData.canvasserIdentity)
            : 101,
          firmCode: `FIRM-${Date.now().toString().slice(-7)}`,
          status: "DRAFT",
          associatedPersons: (firmData.associatedPersons || [])
            .filter(
              person =>
                person.customerCode && person.customerName && person.roleInFirm
            )
            .map(person => {
              let durationValue = 1;
              if (person.durationWithCompany) {
                const duration = person.durationWithCompany.toString();
                if (duration.includes("< 1")) durationValue = 1;
                else if (duration.includes("1-3")) durationValue = 2;
                else if (duration.includes("3-5")) durationValue = 3;
                else if (duration.includes("5-10")) durationValue = 4;
                else if (duration.includes("> 10")) durationValue = 5;
              }

              // FIXED: Only include customerIdentity if it's a valid UUID
              const isValidUUID = (str: string) => {
                const uuidRegex =
                  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
                return uuidRegex.test(str);
              };

              const hasValidCustomerIdentity =
                person.customerIdentity &&
                person.customerIdentity.trim() !== "" &&
                isValidUUID(person.customerIdentity);

              const result: Record<string, unknown> = {
                customerCode: person.customerCode,
                customerName: person.customerName,
                roleInFirmIdentity: person.roleInFirm,
                authorizedSignatory: person.authorizedSignatory || false,
                durationWithCompany: durationValue,
              };

              // ONLY include customerIdentity if it's a valid UUID
              if (hasValidCustomerIdentity) {
                result.customerIdentity = person.customerIdentity;
              }

              return result;
            }),
        };

        return {
          url: api.firm.createFirm(),
          method: "POST",
          data: payload,
        };
      },
      invalidatesTags: ["FirmDetails"],
    }),
  }),
});

export const { useCreateFirmFixedMutation } = firmApiServiceFixed;
