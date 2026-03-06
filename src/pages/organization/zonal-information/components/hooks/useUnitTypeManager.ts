import {
  useAdminUnitManagerBase,
  type UnitTypeCode,
} from "./useAdminUnitManagerBase";

export const useUnitTypeManager = (
  unitTypeCode: UnitTypeCode,
  editIdentity?: string
) =>
  useAdminUnitManagerBase({
    lockedUnitTypeCode: unitTypeCode,
    editIdentity,
  });
