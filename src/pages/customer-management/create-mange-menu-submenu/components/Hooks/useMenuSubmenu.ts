import { useCallback } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import toast from "react-hot-toast";
import { MENU_SUBMENU_DEFAULT_VALUES } from "../../constants/menuSubmenuDefault";
import type { menuSubmenu, menuSubmenuDto } from "@/types/customer-management/create-manage-menus-submenu.type";
import { MenuSubmenuSchema } from "@/global/validation/customer-management-master/create-manage-menu-submenu";
import { useSaveMenuSubmenuMutation, useUpdateMenuSubmenuMutation } from "@/global/service/end-points/customer-management/create-update-menu-submenu";
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { useEffect } from "react";

export const useMenuSubMenu = (editData?: menuSubmenu) => {

  const [saveMenuSubmenu] = useSaveMenuSubmenuMutation();
  const [updateMenuSubmenu] = useUpdateMenuSubmenuMutation();
  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<menuSubmenu>({
   defaultValues: MENU_SUBMENU_DEFAULT_VALUES,
    resolver: yupResolver(MenuSubmenuSchema),
    mode: "onChange",
  });

useEffect(() => {
  if (editData) {
    reset(editData);
  }
}, [editData, reset]);

  const onSubmit = useCallback(
    async (data: menuSubmenu) => {
      const payload: menuSubmenuDto = {
        menuName: data.menuName.toUpperCase(),
        menuCode: data.menuCode.toUpperCase(),
        description: data.description.toUpperCase(),
        menuOrder: data.menuOrder,
        parent: data.parent.toUpperCase(),
        isActive: data.isActive,
        pageUrl: data.pageUrl.toUpperCase(),
        isUrl: data.isUrl
      };

      try {
        if (data.identity) {
          await updateMenuSubmenu({
            identity: data.identity.toString(),
            payload,
          }).unwrap();
          toast.success("Menu Updated Succesfully");
        } else {
          await saveMenuSubmenu(payload).unwrap();
          toast.success("Menu Added Succesfully");
        }
        reset(MENU_SUBMENU_DEFAULT_VALUES);
      } catch (error) {
        const err = error as FetchBaseQueryError;
        const message =
          typeof err?.data === "object" && err?.data !== null
            ? (err.data as { message?: string }).message
            : undefined;
        toast.error(message ?? "Failed to Save Menu ");
      }
    },
    [reset, saveMenuSubmenu, updateMenuSubmenu]
  );


  const onReset = useCallback(() => {
    reset(MENU_SUBMENU_DEFAULT_VALUES);
  }, [reset]); 
  return {
    control,
    register,
    handleSubmit,
    errors,
    isSubmitting,
    onSubmit,
    onReset,
    reset
  };
};

