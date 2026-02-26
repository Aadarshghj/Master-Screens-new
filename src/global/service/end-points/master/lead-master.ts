import { api } from "@/api";
import { apiInstance } from "../../api-instance";

export interface ConfigOption {
  value: string;
  label: string;
}

interface GenderItem {
  gender: string;
  identity: string;
  isActive: boolean;
}

interface LeadSourceItem {
  name: string;
  description: string;
  identity: string;
  isActive: boolean;
}

interface LeadStageItem {
  name: string;
  description: string;
  identity: string;
  isActive: boolean;
}
interface LeadFollowupTypeItem {
  name: string;
  identity: string;
  isActive: boolean;
}

interface LeadStatusItem {
  name: string;
  description: string;
  identity: string;
  isActive: boolean;
}

interface ProductItem {
  name: string;
  description: string;
  identity: string;
  isActive: boolean;
}
interface userItem {
  userName: string;
  identity: string;
}

interface AddressTypeItem {
  identity: string;
  isActive: boolean;
  addressTypeName: string;
}

interface AddressProofTypeItem {
  name: string;
  identity: string;
  code: string;
  conciseDescription: string;
}

export interface IFSCCodeResponse {
  ifscCode: string;
  bankName: string;
  branchName: string;
  branchPlace: string;
  pincodes: number;
  rbiFlag: boolean;
  isActive: boolean;
  identity: string;
}

// interface MasterItem {
//   id?: string;
//   value?: string;
//   name?: string;
//   label?: string;
//   identity?: string;
//   gender?: string;
//   isActive?: boolean;
// }

// interface MasterResponse {
//   data?: MasterItem[];
//   status?: string;
//   message?: string;
// }

export const masterApiService = apiInstance.injectEndpoints({
  endpoints: build => ({
    getLeadSource: build.query<ConfigOption[], void>({
      query: () => ({
        url: api.leadMaster.getLeadSource(),
        method: "GET",
      }),
      transformResponse: (response: LeadSourceItem[]) => {
        return response
          .filter(item => item.name && item.name !== "")
          .map(item => ({
            value: item.identity,
            label: item.name,
          }));
      },
    }),

    //     getLeadSource: build.query<ConfigOption[], void>({
    //       query: () => ({
    //         url: api.leadmaster.getLeadSource(),
    //         method: "GET",
    //       }),
    //       transformResponse: (response: MasterResponse | MasterItem[]) => {
    //         if (
    //           typeof response === "object" &&
    //           response !== null &&
    //           "data" in response &&
    //           Array.isArray(response.data)
    //         ) {
    //           return response.data
    //             .filter(
    //               item => (item.identity || item.id || item.value) && item.name
    //             )
    //             .map((item: MasterItem) => ({
    //               value: item.identity || item.id || item.value || "",
    //               label: item.name || item.label || "",
    //             }));
    //         }
    //         if (Array.isArray(response)) {
    //           return response
    //             .filter(
    //               item => (item.identity || item.id || item.value) && item.name
    //             )
    //             .map((item: MasterItem) => ({
    //               value: item.identity || item.id || item.value || "",
    //               label: item.name || item.label || "",
    //             }));
    //         }
    //         return [];
    //       },
    //     }),

    getLeadStage: build.query<ConfigOption[], void>({
      query: () => ({
        url: api.leadMaster.getLeadStage(),
        method: "GET",
      }),
      transformResponse: (response: LeadStageItem[]) => {
        return response
          .filter(item => item.name && item.name !== "")
          .map(item => ({
            value: item.identity,
            label: item.name,
          }));
      },
    }),

    //     getLeadStage: build.query<ConfigOption[], void>({
    //       query: () => ({
    //         url: api.leadmaster.getLeadStage(),
    //         method: "GET",
    //       }),
    //       transformResponse: (response: MasterResponse | MasterItem[]) => {
    //         if (
    //           typeof response === "object" &&
    //           response !== null &&
    //           "data" in response &&
    //           Array.isArray(response.data)
    //         ) {
    //           return response.data
    //             .filter(
    //               item => (item.identity || item.id || item.value) && item.name
    //             )
    //             .map((item: MasterItem) => ({
    //               value: item.identity || item.id || item.value || "",
    //               label: item.name || item.label || "",
    //             }));
    //         }
    //         if (Array.isArray(response)) {
    //           return response
    //             .filter(
    //               item => (item.identity || item.id || item.value) && item.name
    //             )
    //             .map((item: MasterItem) => ({
    //               value: item.identity || item.id || item.value || "",
    //               label: item.name || item.label || "",
    //             }));
    //         }
    //         return [];
    //       },
    //     }),

    getLeadStatus: build.query<ConfigOption[], void>({
      query: () => ({
        url: api.leadMaster.getLeadStatus(),
        method: "GET",
      }),
      transformResponse: (response: LeadStatusItem[]) => {
        return response
          .filter(item => item.name && item.name !== "")
          .map(item => ({
            value: item.identity,
            label: item.name,
          }));
      },
    }),

    //     getLeadStatus: build.query<ConfigOption[], void>({
    //       query: () => ({
    //         url: api.leadmaster.getLeadStatus(),
    //         method: "GET",
    //       }),
    //       transformResponse: (response: MasterResponse | MasterItem[]) => {
    //         if (
    //           typeof response === "object" &&
    //           response !== null &&
    //           "data" in response &&
    //           Array.isArray(response.data)
    //         ) {
    //           return response.data
    //             .filter(
    //               item => (item.identity || item.id || item.value) && item.name
    //             )
    //             .map((item: MasterItem) => ({
    //               value: item.identity || item.id || item.value || "",
    //               label: item.name || item.label || "",
    //             }));
    //         }
    //         if (Array.isArray(response)) {
    //           return response
    //             .filter(
    //               item => (item.identity || item.id || item.value) && item.name
    //             )
    //             .map((item: MasterItem) => ({
    //               value: item.identity || item.id || item.value || "",
    //               label: item.name || item.label || "",
    //             }));
    //         }
    //         return [];
    //       },
    //     }),

    getProducts: build.query<ConfigOption[], void>({
      query: () => ({
        url: api.leadMaster.getProductServices(),
        method: "GET",
      }),
      transformResponse: (response: ProductItem[]) => {
        return response
          .filter(item => item.name && item.name !== "")
          .map(item => ({
            value: item.identity,
            label: item.name,
          }));
      },
    }),

    //     getProducts: build.query<ConfigOption[], void>({
    //       query: () => ({
    //         url: api.leadmaster.getProductServices(),
    //         method: "GET",
    //       }),
    //       transformResponse: (response: MasterResponse | MasterItem[]) => {
    //         if (
    //           typeof response === "object" &&
    //           response !== null &&
    //           "data" in response &&
    //           Array.isArray(response.data)
    //         ) {
    //           return response.data
    //             .filter(
    //               item => (item.identity || item.id || item.value) && item.name
    //             )
    //             .map((item: MasterItem) => ({
    //               value: item.identity || item.id || item.value || "",
    //               label: item.name || item.label || "",
    //             }));
    //         }
    //         if (Array.isArray(response)) {
    //           return response
    //             .filter(
    //               item => (item.identity || item.id || item.value) && item.name
    //             )
    //             .map((item: MasterItem) => ({
    //               value: item.identity || item.id || item.value || "",
    //               label: item.name || item.label || "",
    //             }));
    //         }
    //         return [];
    //       },
    //     }),

    getAllGenders: build.query<ConfigOption[], void>({
      query: () => ({
        url: api.master.getGenders(),
        method: "GET",
      }),
      transformResponse: (response: GenderItem[]) => {
        return response
          .filter(item => item.gender && item.gender !== "")
          .map(item => ({
            value: item.identity,
            label: item.gender,
          }));
      },
    }),
    //     getAllGenders: build.query<ConfigOption[], void>({
    //       query: () => ({
    //         url: api.master.getGenders(),
    //         method: "GET",
    //       }),
    //       transformResponse: (response: MasterResponse | MasterItem[]) => {
    //         if (
    //           typeof response === "object" &&
    //           response !== null &&
    //           "data" in response &&
    //           Array.isArray(response.data)
    //         ) {
    //           return response.data
    //             .filter(
    //               item =>
    //                 (item.identity || item.id || item.value) &&
    //                 (item.gender || item.name)
    //             )
    //             .map((item: MasterItem) => ({
    //               value: item.identity || item.id || item.value || "",
    //               label: item.gender || item.name || item.label || "",
    //             }));
    //         }
    //         if (Array.isArray(response)) {
    //           return response
    //             .filter(
    //               item =>
    //                 (item.identity || item.id || item.value) &&
    //                 (item.gender || item.name)
    //             )
    //             .map((item: MasterItem) => ({
    //               value: item.identity || item.id || item.value || "",
    //               label: item.gender || item.name || item.label || "",
    //             }));
    //         }
    //         return [];
    //       },
    //     }),

    //   }),
    // });

    getAllAddressTypes: build.query<ConfigOption[], void>({
      query: () => ({
        url: api.master.getAddressTypes(),
        method: "GET",
      }),
      transformResponse: (response: AddressTypeItem[]) => {
        return response
          .filter(item => item.addressTypeName && item.addressTypeName !== "")
          .map(item => ({
            value: item.identity,
            label: item.addressTypeName,
          }));
      },
    }),
    //     getAllAddressTypes: build.query<ConfigOption[], void>({
    //       query: () => ({
    //         url: api.master.getAddressTypes(),
    //         method: "GET",
    //       }),
    //     }),

    getUsers: build.query<ConfigOption[], void>({
      query: () => ({
        url: api.leadMaster.getUsers(),
        method: "GET",
      }),
      transformResponse: (response: userItem[]) => {
        return response
          .filter(item => item.userName && item.userName !== "")
          .map(item => ({
            value: item.identity,
            label: item.userName,
          }));
      },
    }),

    getAllAddressProofTypes: build.query<ConfigOption[], void>({
      query: () => ({
        url: api.master.getAddressProofTypes(),
        method: "GET",
      }),
      transformResponse: (response: AddressProofTypeItem[]) => {
        return response
          .filter(item => item.name && item.name !== "")
          .map(item => ({
            value: item.identity,
            label: item.name,
          }));
      },
    }),

    //     getAllAddressProofTypes: build.query<ConfigOption[], void>({
    //       query: () => ({
    //         url: api.master.getAddressProofTypes(),
    //         method: "GET",
    //       }),
    //     }),
    getFollowupType: build.query<ConfigOption[], void>({
      query: () => ({
        url: api.leadMaster.getFollowupTypes(),
        method: "GET",
      }),
      transformResponse: (response: LeadFollowupTypeItem[]) => {
        return response
          .filter(item => item.name && item.name !== "")
          .map(item => ({
            value: item.identity,
            label: item.name,
          }));
      },
    }),
  }),
});

export const {
  useGetLeadStageQuery,
  useGetLeadStatusQuery,
  useGetProductsQuery,
  useGetAllGendersQuery,
  useGetAllAddressTypesQuery,
  useGetAllAddressProofTypesQuery,
  useGetLeadSourceQuery,
  useGetUsersQuery,
  useGetFollowupTypeQuery,
} = masterApiService;
