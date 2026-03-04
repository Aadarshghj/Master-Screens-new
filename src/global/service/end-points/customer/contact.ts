// src/global/service/end-points/customer/contact.ts
import { apiInstance } from "../../api-instance";
import type {
  ContactCaptureResponse,
  SaveContactRequest,
  NotificationPreferences,
} from "@/types/customer/contact.types";
import { api } from "@/api";

// Helper types for API responses
type ApiResponse<T> = {
  data?: T;
  contacts?: T;
  contactTypes?: T;
};

// Updated interface to match the form usage
interface OtpSendPayload {
  tenantId: number;
  branchCode: string;
  templateCatalogIdentity: string;
  templateContentIdentity: string;
  target: string;
  customerIdentity: number;
  length: number;
  ttlSeconds: number;
}

interface OtpSendResponse {
  requestId: string;
  expiresAt: string;
  status: string;
}

interface VerifyOtpResponse {
  result: string;
  success: boolean;
  message?: string;
}
interface ContactUpdate {
  contactType: string;
  contactDetails: string;
  isPrimary: boolean;
  isActive: boolean;
  isVerified: boolean;
  isOptOutPromotionalNotification: boolean;
}
export const contactApiService = apiInstance.injectEndpoints({
  endpoints: build => ({
    getContacts: build.query<ContactCaptureResponse[], string>({
      query: customerId => ({
        url: api.customer.getContacts({ customerId }),
        method: "GET",
      }),
      providesTags: (_result, _error, customerId) => [
        { type: "Customer", id: customerId },
        "CustomerContacts",
      ],
      keepUnusedDataFor: 60, // Keep data for 60 seconds
      transformResponse: (response: unknown) => {
        if (Array.isArray(response)) {
          return response;
        }
        if (
          response &&
          typeof response === "object" &&
          "data" in response &&
          Array.isArray(
            (response as ApiResponse<ContactCaptureResponse[]>).data
          )
        ) {
          return (response as ApiResponse<ContactCaptureResponse[]>).data!;
        }
        if (
          response &&
          typeof response === "object" &&
          "contacts" in response
        ) {
          return (
            (response as ApiResponse<ContactCaptureResponse[]>).contacts || []
          );
        }
        return [];
      },
    }),

    saveContact: build.mutation<
      { message: string; data: ContactCaptureResponse },
      { customerId: string; payload: SaveContactRequest }
    >({
      query: ({ customerId, payload }) => {
        const { ...data } = payload;
        const updatedPayload = {
          contactType: data.contactType,
          contactDetails: data.contactDetails,
          isPrimary: data.isPrimary,
          isActive: data.isActive,
          isOptOutPromotionalNotification: data.isOptOutPromotionalNotification,
          isVerified: data.isVerified,
        };
        return {
          url: api.customer.createContact({ customerId }),
          method: "POST",
          data: updatedPayload,
        };
      },
      invalidatesTags: (_result, _error, { customerId }) => [
        { type: "Customer", id: customerId },
        "CustomerContacts",
      ],
      transformResponse: (response: unknown) => {
        if (response && typeof response === "object" && "data" in response) {
          return response as { message: string; data: ContactCaptureResponse };
        }
        return {
          message: "Contact details saved successfully",
          data: response as ContactCaptureResponse,
        };
      },
    }),
    updateContact: build.mutation<
      { message: string; data: ContactCaptureResponse },
      { customerId: string; contactId: string; payload: ContactUpdate }
    >({
      query: ({ customerId, contactId, payload }) => {
        const { ...data } = payload;
        const updatedPayload = {
          contactType: data.contactType,
          contactDetails: data.contactDetails,
          isPrimary: data.isPrimary,
          isActive: data.isActive,
          isOptOutPromotionalNotification: data.isOptOutPromotionalNotification,
          isVerified: data.isVerified,
        };
        return {
          url: api.customer.updateContact({ customerId, contactId }),
          method: "PUT",
          data: updatedPayload,
        };
      },
      invalidatesTags: (_result, _error, { customerId }) => [
        { type: "Customer", id: customerId },
        "CustomerContacts",
      ],
      transformResponse: (response: unknown) => {
        if (response && typeof response === "object" && "data" in response) {
          return response as { message: string; data: ContactCaptureResponse };
        }
        return {
          message: "Contact details saved successfully",
          data: response as ContactCaptureResponse,
        };
      },
    }),
    deleteContact: build.mutation<
      { message: string },
      { customerId: string; contactId: string }
    >({
      query: ({ customerId, contactId }) => ({
        url: api.customer.updateContact({ customerId, contactId }),
        method: "PUT",
        data: { isActive: false },
      }),
      invalidatesTags: ["Customer"],
    }),

    getContactTypesDetailed: build.query<
      Array<{ contactType: string; identity: string; isActive: boolean }>,
      void
    >({
      query: () => ({
        url: api.master.getContactTypes(),
        method: "GET",
      }),
      keepUnusedDataFor: 65,
      transformResponse: (response: unknown) => {
        if (Array.isArray(response)) {
          return response;
        }
        if (
          response &&
          typeof response === "object" &&
          "data" in response &&
          Array.isArray(
            (
              response as ApiResponse<
                Array<{
                  contactType: string;
                  identity: string;
                  isActive: boolean;
                }>
              >
            ).data
          )
        ) {
          return (
            response as ApiResponse<
              Array<{
                contactType: string;
                identity: string;
                isActive: boolean;
              }>
            >
          ).data!;
        }
        if (
          response &&
          typeof response === "object" &&
          "contactTypes" in response
        ) {
          return (
            (
              response as ApiResponse<
                Array<{
                  contactType: string;
                  identity: string;
                  isActive: boolean;
                }>
              >
            ).contactTypes || []
          );
        }
        return [];
      },
    }),

    // OPTION 1: If your API should return both preference AND consent values
    // Use this if the backend is supposed to send sms/email/whatsapp fields but isn't

    // Update the transform to map consent values to switch state
    getNotificationPreferences: build.query<NotificationPreferences, string>({
      query: customerId => ({
        url: api.customer.getNotificationPreferences({ customerId }),
        method: "GET",
      }),
      providesTags: ["Customer"],
      transformResponse: (response: unknown) => {
        if (response && typeof response === "object") {
          if ("notificationPreference" in response) {
            const nested = (response as Record<string, unknown>)
              .notificationPreference as Record<string, unknown>;

            // Map consent values to both preference AND consent fields
            const result: NotificationPreferences = {
              // Use consent values as the switch states
              sms: (nested.consentSms as boolean) ?? false,
              email: (nested.consentEmail as boolean) ?? false,
              whatsapp: (nested.consentWhatsapp as boolean) ?? false,
              // Keep consent values separate
              consentSms: (nested.consentSms as boolean) ?? false,
              consentEmail: (nested.consentEmail as boolean) ?? false,
              consentWhatsapp: (nested.consentWhatsapp as boolean) ?? false,
              isOptOutPromotionalNotification:
                (nested.isOptedOutPromotional as boolean) ?? false,
            };

            return result;
          }
        }

        return {
          sms: false,
          email: false,
          whatsapp: false,
          consentSms: false,
          consentEmail: false,
          consentWhatsapp: false,
          isOptedOutPromotional: false,
        };
      },
    }),

    // Create notification preferences (POST for first time)
    createNotificationPreferences: build.mutation<
      { message: string; data: NotificationPreferences },
      { customerId: string; payload: NotificationPreferences }
    >({
      query: ({ customerId, payload }) => ({
        url: api.customer.createNotificationPreferences({ customerId }),
        method: "POST",
        data: {
          // Send only consent fields - map the switch states back to consent
          consentSms: payload.sms,
          consentEmail: payload.email,
          consentWhatsapp: payload.whatsapp,
        },
      }),
      invalidatesTags: ["Customer"],
      transformResponse: (response: unknown) => {
        if (response && typeof response === "object" && "data" in response) {
          return response as {
            message: string;
            data: NotificationPreferences;
          };
        }
        return {
          message: "Preferences created successfully",
          data: response as NotificationPreferences,
        };
      },
    }),

    // Update notification preferences (PUT for updates)
    updateNotificationPreferences: build.mutation<
      { message: string; data: NotificationPreferences },
      { customerId: string; payload: NotificationPreferences }
    >({
      query: ({ customerId, payload }) => ({
        url: api.customer.setNotificationPreferences({ customerId }),
        method: "PUT",
        data: {
          // Send only consent fields - map the switch states back to consent
          consentSms: payload.sms,
          consentEmail: payload.email,
          consentWhatsapp: payload.whatsapp,
        },
      }),
      invalidatesTags: ["Customer"],
      transformResponse: (response: unknown) => {
        if (response && typeof response === "object" && "data" in response) {
          return response as {
            message: string;
            data: NotificationPreferences;
          };
        }
        return {
          message: "Preferences updated successfully",
          data: response as NotificationPreferences,
        };
      },
    }),
    sendOtp: build.mutation<OtpSendResponse, OtpSendPayload>({
      query: payload => {
        const idempotencyKey = `${Date.now()}-${Math.random()
          .toString(36)
          .substr(2, 9)}`;

        return {
          url: api.customer.sendOtp(),
          method: "POST",
          data: payload as unknown as Record<string, unknown>,
          headers: {
            "Idempotency-Key": idempotencyKey,
            "Content-Type": "application/json",
          },
        };
      },
    }),

    verifyOtp: build.mutation<
      VerifyOtpResponse,
      { requestId: string; otp: string }
    >({
      query: ({ requestId, otp }) => ({
        url: `/api/v1/otp/${requestId}/verify`,
        method: "POST",
        data: { code: otp },
      }),
    }),

    updatePromotionalOptOut: build.mutation<
      { message: string },
      { customerId: string; isOptedOut: boolean }
    >({
      query: ({ customerId, isOptedOut }) => ({
        url: api.customer.updatePromotionalOptOut({ customerId }),
        method: "PUT",
        data: { isOptOutPromotionalNotification: isOptedOut },
      }),
      invalidatesTags: ["Customer", "CustomerContacts"],
    }),
  }),
});

export const {
  useGetContactsQuery,
  useSaveContactMutation,
  useDeleteContactMutation,
  useGetContactTypesDetailedQuery,
  useGetNotificationPreferencesQuery,
  useCreateNotificationPreferencesMutation,
  useUpdateNotificationPreferencesMutation,
  useSendOtpMutation,
  useVerifyOtpMutation,
  useUpdatePromotionalOptOutMutation,
  useUpdateContactMutation,
} = contactApiService;
