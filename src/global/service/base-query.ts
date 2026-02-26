import { type BaseQueryFn } from "@reduxjs/toolkit/query";
import type { AxiosError } from "axios";
import type {
  AxiosBaseQueryArgs,
  AxiosBaseQueryError,
  AxiosBaseQueryFnArgs,
} from "@/types/customer/common.types";
import { createAxiosInstance } from "./axios-instance";

export const axiosBaseQuery = (
  { baseUrl }: AxiosBaseQueryFnArgs = { baseUrl: "" }
): BaseQueryFn<AxiosBaseQueryArgs, unknown, AxiosBaseQueryError> => {
  const axiosInstance = createAxiosInstance(baseUrl);

  return async ({
    url,
    method = "GET",
    data,
    body, // Add body parameter
    params,
    headers,
    responseType,
  }) => {
    try {
      // Use body if provided (RTK Query uses body), otherwise use data
      const requestData = body || data;

      // Handle FormData conversion to JSON if Content-Type is application/json
      const processedHeaders = { ...headers };
      let processedData = requestData;

      // Special handling for OTP verification - preserve original data structure
      if (url.includes("/otp/") && url.includes("/verify")) {
        // Skip processing for OTP verification
      } else if (
        requestData instanceof FormData &&
        url.includes("/addresses")
      ) {
        const formEntries = Object.fromEntries(requestData.entries());

        // Check if the data is nested under 'request' key as JSON string
        if (formEntries.request && typeof formEntries.request === "string") {
          try {
            processedData = JSON.parse(formEntries.request);
          } catch {
            processedData = formEntries;
          }
        } else {
          processedData = formEntries;
        }

        processedHeaders["Content-Type"] = "application/json";
      } else if (
        requestData instanceof FormData &&
        processedHeaders["Content-Type"] === "application/json"
      ) {
        processedData = Object.fromEntries(requestData.entries());
      } else if (requestData instanceof FormData) {
        // Remove Content-Type to let browser set it with boundary for multipart
        delete processedHeaders["Content-Type"];
        delete processedHeaders["content-type"];
      }

      const result = await axiosInstance({
        url,
        method,
        data: processedData,
        params,
        headers: processedHeaders,
        responseType,
      });

      return { data: result.data };
    } catch (axiosError) {
      const err = axiosError as AxiosError;

      return {
        error: {
          status: err.response?.status,
          data: err.response?.data || err.message,
        },
      };
    }
  };
};
