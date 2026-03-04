import { api } from "@/api";
import { apiInstance } from "../../api-instance";

export interface CanvasserResponseDto {
  canvasserIdentity: string;
  canvasserName: string;
  canvasserCode: string;
}

export const canvasserApi = apiInstance.injectEndpoints({
  endpoints: build => ({
    searchCanvasser: build.query<
      CanvasserResponseDto[],
      {
        canvassedTypeId: string;
        canvasserName: string;
      }
    >({
      query: ({ canvassedTypeId, canvasserName }) => ({
        url: api.customer.searchCanvasser({ canvassedTypeId, canvasserName }),
        method: "GET",
      }),
      providesTags: ["Canvasser"],
    }),
    getCanvasserById: build.query<
      CanvasserResponseDto[],
      {
        canvassedTypeId: string;
        canvasserStaffId: string;
      }
    >({
      query: ({ canvassedTypeId, canvasserStaffId }) => ({
        url: api.customer.getCanvasserById({
          canvassedTypeId,
          canvasserStaffId,
        }),
        method: "GET",
      }),
      providesTags: ["Canvasser"],
    }),
  }),
});

export const { useSearchCanvasserQuery, useGetCanvasserByIdQuery } =
  canvasserApi;
