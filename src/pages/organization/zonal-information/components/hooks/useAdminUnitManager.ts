import { useAdminUnitManagerBase } from "./useAdminUnitManagerBase";

export const useAdminUnitManager = (editIdentity?: string) =>
  useAdminUnitManagerBase({ editIdentity });
