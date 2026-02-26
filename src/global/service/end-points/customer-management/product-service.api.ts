import type {
  ProductServiceRequestDto,
  ProductServiceResponseDto,
} from "@/types/customer-management/product-service";
import { apiInstance } from "../../api-instance";
import { api } from "@/api";

export const productServiceApiService = apiInstance.injectEndpoints({
  endpoints: build => ({
    saveProductService: build.mutation<
      ProductServiceResponseDto,
      ProductServiceRequestDto
    >({
      query: payload => ({
        url: api.productService.save(),
        method: "POST",
        data: payload,
      }),
      invalidatesTags: [{ type: "ProductService", id: "LIST" }],
    }),

    getProductServices: build.query<ProductServiceResponseDto[], void>({
      query: () => ({
        url: api.productService.get(),
        method: "GET",
      }),
      providesTags: result =>
        result
          ? [
              ...result.map(item => ({
                type: "ProductService" as const,
                id: item.identity,
              })),
              { type: "ProductService", id: "LIST" },
            ]
          : [{ type: "ProductService", id: "LIST" }],
    }),
    deleteProductService: build.mutation<void, string>({
      query: identity => ({
        url: `${api.productService.get()}/${identity}`,
        method: "DELETE",
      }),
      invalidatesTags: (_r, _e, identity) => [
        { type: "ProductService", id: identity },
        { type: "ProductService", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useSaveProductServiceMutation,
  useGetProductServicesQuery,
  useDeleteProductServiceMutation,
} = productServiceApiService;
