import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { TENANT_DEFAULT_VALUES } from "../../constants/TenantDefault";
import type {
  TenantType,
  TenantRequestDto,
} from "@/types/customer-management/tenant";
import {
  useSaveTenantMutation,
  useUpdateTenantMutation,
  useLazyGetTenantByIdQuery,
} from "@/global/service/end-points/customer-management/tenant";
import { tenantSchema } from "@/global/validation/customer-management-master/tenant";
import toast from "react-hot-toast";
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import {
  POST_OFFICE_OPTIONS,
  SITE_FACTORY_PREMISES_OPTIONS,
  TENANT_ADDRESS_TYPE_OPTIONS,
  TENANT_TYPE_OPTIONS,
  TIME_ZONE_OPTIONS,
} from "@/mocks/customer-management-master/tenant";
import { useKeyValueTable } from "./useKeyValueTable";

export const useTenant = () => {
  const [editId, setEditId] = useState<string | null>(null);
  const keyValueTable = useKeyValueTable();

  const {
    control,
    register,
    handleSubmit,
    reset,
      setValue,
  clearErrors,
    setError,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<TenantType>({
    defaultValues: TENANT_DEFAULT_VALUES,
    resolver: yupResolver(tenantSchema),
    mode: "onChange",
  });

  const [saveTenant] = useSaveTenantMutation();
  const [updateTenant] = useUpdateTenantMutation();
  const [fetchTenantById] = useLazyGetTenantByIdQuery();

  const onSubmit = useCallback(
    async (data: TenantType) => {
      const payload: TenantRequestDto = {
        tenantName: data.tenantName,
        tenantCode: data.tenantCode,
        tenantAddress: "",
        isActive: true,
      };

      try {
        if (editId) {
          await updateTenant({ id: editId, payload }).unwrap();
          toast.success("Tenant updated successfully");
        } else {
          await saveTenant(payload).unwrap();
          toast.success("Tenant saved successfully");
        }

        reset(TENANT_DEFAULT_VALUES);
        setEditId(null);
      } catch (error) {
        let backendMessage = "Operation failed";
        let errorCode: string | undefined;

        if (typeof error === "object" && error !== null) {
          const err = error as FetchBaseQueryError;

          if (
            "data" in err &&
            typeof err.data === "object" &&
            err.data !== null
          ) {
            const data = err.data as {
              errorCode?: string;
              message?: string;
            };

            errorCode = data.errorCode;
            backendMessage = data.message ?? backendMessage;
          }
        }

        if (errorCode === "409") {
          const lowerMessage = backendMessage.toLowerCase();

          if (lowerMessage.includes("code")) {
            setError("tenantCode", {
              type: "manual",
              message: backendMessage,
            });
          } else if (lowerMessage.includes("name")) {
            setError("tenantName", {
              type: "manual",
              message: backendMessage,
            });
          }

          toast.error(backendMessage);
        } else {
          toast.error(backendMessage);
        }
      }
    },
    [editId, reset, saveTenant, updateTenant, setError]
  );
  const handleDeletedTenant = useCallback(
    (id: string) => {
      if (editId === id) {
        reset(TENANT_DEFAULT_VALUES);
        setEditId(null);
      }
    },
    [editId, reset]
  );

  const onEdit = async (tenant: TenantType) => {
    const freshData = await fetchTenantById(tenant.id).unwrap();
    reset(freshData);
    setEditId(freshData.id);
  };

  const onView = async (tenant: TenantType) => {
    const freshData = await fetchTenantById(tenant.id).unwrap();
    reset(freshData);
    setEditId(freshData.id);
  };

  const onCancel = useCallback(() => {
    reset(TENANT_DEFAULT_VALUES);
    keyValueTable.resetTable();
    setEditId(null);
  }, [reset]);

  const onReset = useCallback(() => {
    reset(TENANT_DEFAULT_VALUES);
    keyValueTable.resetTable();
    setEditId(null);
  }, [reset, keyValueTable]);

  return {
    control,
    register,
    handleSubmit,
    errors,
    isSubmitting,
    handleDeletedTenant,
    onSubmit,
      setValue,
  clearErrors,
    onEdit,
    onView,
    tenantTypeOptions: TENANT_TYPE_OPTIONS,
    addressTypeOptions: TENANT_ADDRESS_TYPE_OPTIONS,
    postOfficeOptions: POST_OFFICE_OPTIONS,
    siteFactoryPremiseOptions: SITE_FACTORY_PREMISES_OPTIONS,
    timeZoneOptions: TIME_ZONE_OPTIONS,
    onCancel,
    onReset,
    reset,
    editId,
    watch,
    keyValueTable,
  };
};
