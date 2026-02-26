import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const baseInstance = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({ baseUrl: "" }),
  tagTypes: ["CustomerPhoto", "Customer"],
  endpoints: () => ({}),
});
