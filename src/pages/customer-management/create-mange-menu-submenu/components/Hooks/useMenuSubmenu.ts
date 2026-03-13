import { useCallback, useEffect } from "react";
import { useForm, type Resolver } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import { MENU_SUBMENU_DEFAULT_VALUES } from "../../constants/menuSubmenuDefault";
import type { menuSubmenu, menuSubmenuDto, ParentMenu } from "@/types/customer-management/create-manage-menus-submenu.type";
import { MenuSubmenuSchema } from "@/global/validation/customer-management-master/create-manage-menu-submenu";
import { useSaveMenuSubmenuMutation, useUpdateMenuSubmenuMutation } from "@/global/service/end-points/customer-management/create-update-menu-submenu";
import { useGetParentMenusQuery } from "@/global/service/end-points/customer-management/menu-tree";
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";

export const useMenuSubMenu = (editData?: menuSubmenu) => {
  const location = useLocation();
  const [saveMenuSubmenu] = useSaveMenuSubmenuMutation();
  const [updateMenuSubmenu] = useUpdateMenuSubmenuMutation();
  
  const { data: parentMenus = [], isLoading: isParentsLoading } = useGetParentMenusQuery<{ data: ParentMenu[], isLoading: boolean }>();

  const {
    control,
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<menuSubmenu>({
    defaultValues: editData ?? MENU_SUBMENU_DEFAULT_VALUES,
    resolver: yupResolver(MenuSubmenuSchema) as unknown as Resolver <menuSubmenu>,
    mode: "onChange",
  });

  useEffect(() => {
    const state = location.state as { parentId?: string } | null;
    if (state?.parentId && parentMenus.length > 0) {
      const exists = parentMenus.some((p) => p.identity === state.parentId);
      if (exists) {
        setValue("parentMenu", state.parentId);
      }
    }
  }, [location.state, parentMenus, setValue]);

  const onSubmit = useCallback(
    async (data: menuSubmenu) => {
       console.log("FORM DATA", data)
      const payload: menuSubmenuDto = {
  menuName: data.menuName,
  menuCode: data.menuCode,
  description: data.description,
  menuOrder: Number(data.menuOrder),
  parentMenu: data.parentMenu,
  isActive: data.isActive,
  isUrl: data.isUrl,
  pageUrl: data.pageUrl
}

      try {
        if (data.identity) {
          await updateMenuSubmenu({
            menuIdentity: data.identity.toString(),
            payload,
          }).unwrap();
          toast.success("Menu Updated Successfully");
        } else {
          await saveMenuSubmenu(payload).unwrap();
          toast.success("Menu Added Successfully");
        }
        reset(MENU_SUBMENU_DEFAULT_VALUES);
      } catch (error) {
        const err = error as FetchBaseQueryError;
        const message = (err?.data as { message?: string })?.message;
        toast.error(message ?? "Failed to Save Menu");
      }
    },
    [reset, saveMenuSubmenu, updateMenuSubmenu]
  );

  return {
    control,
    register,
    handleSubmit,
    errors,
    reset,
    isSubmitting,
    onSubmit,
    onCancel: () => reset(MENU_SUBMENU_DEFAULT_VALUES),
    onReset: () => reset(MENU_SUBMENU_DEFAULT_VALUES),
    parentMenus,
    isParentsLoading,
    setValue
  };
};