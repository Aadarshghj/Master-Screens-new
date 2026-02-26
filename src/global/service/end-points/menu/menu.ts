import type { MenuResponse } from "@/types";
import { menu } from "@/const/menu.const";
import { apiInstance } from "../../api-instance";
import { logger } from "../../logger";

export const menuService = apiInstance.injectEndpoints({
  endpoints: build => ({
    getMenuItems: build.query<MenuResponse, void>({
      queryFn: async () => {
        try {
          const menuResponse: MenuResponse = { menu } as MenuResponse;
          return { data: menuResponse };
        } catch (error) {
          logger.error(error, {
            toast: false,
            pushLog: true,
          });

          return {
            error: {
              status: 500,
              data: "Failed to load menu data",
            },
          };
        }
      },
    }),
  }),
});

export const { useGetMenuItemsQuery } = menuService;
