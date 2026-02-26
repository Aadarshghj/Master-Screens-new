import { apiInstance } from "../../api-instance";
import { api } from "@/api";

export interface PreSignedUrlRequestDto {
  module: string;
  referenceId: string;
  documentCategory: string;
  documentType: string;
  fileName: string;
  contentType: string;
  [key: string]: string;
}

export interface PreSignedResponseDto {
  preSignedUrl: string;
  filePath: string;
  fileName: string;
}

export interface FileViewRequestDto {
  filePath: string;
  accessType?: string;
}

export interface FileViewResponseDto {
  preSignedUrl: string;
  filePath: string;
  fileName: string | null;
}

export const dmsApiService = apiInstance.injectEndpoints({
  endpoints: build => ({
    getPreSignedUrl: build.mutation<
      PreSignedResponseDto,
      PreSignedUrlRequestDto
    >({
      query: payload => ({
        url: api.dms.getPreSignedUrl(),
        method: "POST",
        data: payload,
        headers: {
          "Content-Type": "application/json",
        },
      }),
    }),
    fileView: build.query<FileViewResponseDto, FileViewRequestDto>({
      query: ({ filePath }) => ({
        url: api.dms.fileView(),
        method: "GET",
        params: {
          filePath,
        },
      }),
    }),
  }),
});

export const {
  useGetPreSignedUrlMutation: useGetDMSPreSignedUrlMutation,
  useFileViewQuery: useDMSFileViewQuery,
  useLazyFileViewQuery: useDMSLazyFileViewQuery,
} = dmsApiService;
