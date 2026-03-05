import { useCallback, useMemo } from "react";
import { useForm, type Resolver } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import type {
  MenuModuleMappingRequestDto,
  MenuModuleMappingType,
} from "@/types/customer-management/menu-module-mapping";
import {
  useGetMenusQuery,
  useGetModulesQuery,
  useSaveMenuModuleMappingMutation,
} from "@/global/service/end-points/customer-management/menu-module-mapping";
import { menuModuleMappingSchema } from "@/global/validation/customer-management-master/menu-module-mapping";
import { DEFAULT_VALUES } from "../../constants/MenuModuleMappingDefaults";
import { logger } from "@/global/service";

export const useMenuModuleMappingForm = () => {
  const [saveMenuModuleMapping] = useSaveMenuModuleMappingMutation();
  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<MenuModuleMappingType>({
    defaultValues: DEFAULT_VALUES,
    resolver: yupResolver(menuModuleMappingSchema) as Resolver<MenuModuleMappingType>,
    mode: "onBlur",
  });

  const onSubmit = useCallback(
    async (data: MenuModuleMappingType) => {
       const payload: MenuModuleMappingRequestDto = {
               menuIdentity: data.menuName,
              moduleIdentity: data.moduleName,
              isActive: data.isActive,
             
            };
      // console.log("Form Data:", data);
      try {
              await saveMenuModuleMapping(payload).unwrap();
              logger.info("Saved successfully", { toast: true });
              reset(DEFAULT_VALUES);
            } catch (error) {
              logger.error(error, { toast: true });
            }
    },
    [saveMenuModuleMapping,reset]
  );

  const onCancel = useCallback(() => {
    reset(DEFAULT_VALUES);
  }, [reset]);

  const onReset = useCallback(() => {
    reset(DEFAULT_VALUES);
  }, [reset]);
const { data: menus = [] } = useGetMenusQuery();
const { data: modules = [] } = useGetModulesQuery();

const menuNameOptions = useMemo(
  () =>
    menus.map(menu => ({
      value: menu.identity,
      label: menu.menuName,
    })),
  [menus]
);

const moduleNameOptions = useMemo(
  () =>
    modules.map(mod => ({
      value: mod.identity,
      label: mod.label,
    })),
  [modules]
  
);

  return {
    control,
    register,
    handleSubmit,
    errors,
    isSubmitting,
    onSubmit,
    onCancel,
    onReset,
    menuNameOptions,
    moduleNameOptions,
    reset,
  };
};