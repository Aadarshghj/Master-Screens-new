import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { logger } from "@/global/service";
import {
  useCreateUserLeaveStatusMutation,
  useDeleteUserLeaveStatusMutation,
  useFilterUserLeaveStatusQuery,
  useGetBranchDetailsQuery,
  useGetUserDetailsQuery,
  useGetUserStatusQuery,
  useUpdateUserLeaveStatusMutation,
} from "@/global/service/end-points/approval-workflow/user-leave-status";
import { userLeaveStatusValidationSchema } from "@/global/validation/approval-workflow/user-leave-status";
import { handleApiError } from "@/utils/error-handler";
import type { UserLeaveStatusFormData } from "@/types/approval-workflow/user-leave-status.types";
import { useTemplateDownload } from "@/hooks/useTemplateDownload";
import {
  leaveTemplateDownloadPath,
  userLeaveStatusDefaultValues,
} from "../constants/form.constants";

export const useUserLeaveStatusForm = () => {
  const size = 10;

  const [page, setPage] = useState(0);
  const [branchSearch, setBranchSearch] = useState("");
  const [userSearch, setUserSearch] = useState("");
  const [delegateSearch, setDelegateSearch] = useState("");
  const [userCode, setUserCode] = useState("");
  const [delegateUserCode, setDelegateUserCode] = useState("");
  const [identity, setIdentity] = useState("");
  const [leaveIdenity, setLeaveIdenity] = useState("");
  const [pendingEditData, setPendingEditData] =
    useState<UserLeaveStatusFormData | null>(null);

  const [showBranchDropdown, setShowBranchDropdown] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showDelegateDropdown, setShowDelegateDropdown] = useState(false);
  const [editUserLeaveStatus, setEditUserLeaveStatus] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isImportHistoryModalOpen, setIsImportHistoryModalOpen] =
    useState(false);

  const [deleteUserLeaveStatus] = useDeleteUserLeaveStatusMutation();
  const [createUserLeaveStatus] = useCreateUserLeaveStatusMutation();
  const [updateUserLeaveStatus] = useUpdateUserLeaveStatusMutation();

  const { data: statusData } = useGetUserStatusQuery();
  const { downloadTemplate, isDownloading } = useTemplateDownload(
    leaveTemplateDownloadPath
  );

  const { data, isLoading, refetch } = useFilterUserLeaveStatusQuery({
    userCode,
    delegateUserCode,
    page,
    size,
  });

  const {
    data: userData,
    isFetching: isUserLoading,
    error: userError,
  } = useGetUserDetailsQuery({ userCode: userSearch }, { skip: !userSearch });

  const {
    data: delegateData,
    isFetching: isDelegateLoading,
    error: delegateError,
  } = useGetUserDetailsQuery(
    { userCode: delegateSearch },
    { skip: !delegateSearch }
  );

  const { data: branchData, isFetching: isBranchLoading } =
    useGetBranchDetailsQuery(
      { branchCode: branchSearch },
      { skip: !branchSearch }
    );

  const methods = useForm<UserLeaveStatusFormData>({
    resolver: yupResolver(userLeaveStatusValidationSchema),
    shouldUnregister: true,
    mode: "onBlur",
    reValidateMode: "onChange",
    defaultValues: {
      ...userLeaveStatusDefaultValues,
      status: statusData?.[0]?.value ?? "",
      statusIdentity: statusData?.[0]?.identity ?? "",
    },
  });

  const {
    handleSubmit,
    control,
    register,
    setValue,
    reset,
    trigger,
    watch,
    getValues,
    formState: { errors },
  } = methods;

  const branchOptions =
    branchData?.content?.map(branch => ({
      label: `${branch.branchCode} - ${branch.branchName}`,
      value: branch.branchCode,
      identity: branch.identity,
    })) || [];

  const userOptions =
    userData?.content?.map(user => ({
      label: `${user.userCode} - ${user.userName}`,
      value: user.userCode,
      identity: user.identity,
    })) || [];

  const delegateOptions =
    delegateData?.content?.map(user => ({
      label: `${user.userCode} - ${user.userName}`,
      value: user.userCode,
      identity: user.identity,
    })) || [];

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleSetUserCode = (code: string) => {
    setUserCode(code);
  };

  const handleSetDelegateUserCode = (code: string) => {
    setDelegateUserCode(code);
  };

  const handleDownloadTemplate = useCallback(async () => {
    await downloadTemplate();
  }, [downloadTemplate]);

  const handleOpenHistoryModal = () => {
    setIsImportHistoryModalOpen(true);
  };

  const handleCloseHistoryModal = () => {
    setIsImportHistoryModalOpen(false);
  };

  const handleRefetchData = () => {
    refetch();
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteUserLeaveStatus(identity).unwrap();
      logger.info("Leave status deleted successfully", { toast: true });
      refetch();
    } catch (error) {
      setShowDeleteModal(false);
      setIdentity("");
      logger.error(error, { toast: true });
    } finally {
      setShowDeleteModal(false);
      setIdentity("");
    }
  };

  const handleDelete = (identity: string) => {
    setIdentity(identity);
    setShowDeleteModal(true);
  };

  const handleCancelDelete = () => {
    setIdentity("");
    setShowDeleteModal(false);
  };

  const onSubmit = async (data: UserLeaveStatusFormData) => {
    try {
      const statusIdentity = statusData?.find(
        item => item.label === data.status
      );
      const payload: UserLeaveStatusFormData = {
        branchIdentity: data.branchIdentity ?? "",
        userIdentity: data.userIdentity ?? "",
        leaveFrom: data.leaveFrom,
        leaveTo: data.leaveTo,
        statusIdentity: statusIdentity?.identity ?? "",
        remarks: data.remarks,
        delegateUserIdentity: data.delegateUserIdentity ?? "",
      };

      if (editUserLeaveStatus) {
        await updateUserLeaveStatus({
          identity: leaveIdenity,
          data: payload,
        }).unwrap();
        setEditUserLeaveStatus(false);
        setPendingEditData(null);
        logger.info("User leave status updated successfully", { toast: true });
      } else {
        await createUserLeaveStatus(payload).unwrap();
        logger.info("User leave status created successfully", { toast: true });
      }
      reset({
        ...userLeaveStatusDefaultValues,
        status: getValues("status"),
        statusIdentity: getValues("statusIdentity"),
      });

      setBranchSearch("");
      setUserSearch("");
      setDelegateSearch("");
      refetch();
    } catch (error: unknown) {
      const errorMessage = handleApiError(error);
      logger.error(errorMessage, {
        toast: true,
        pushLog: false,
      });
    }
  };

  const handleShowAddForm = () => {
    setShowAddForm(prev => !prev);
    if (showAddForm) {
      setPendingEditData(null);
      setEditUserLeaveStatus(false);
    }
  };

  const handleResetForm = () => {
    reset({
      ...userLeaveStatusDefaultValues,
      status: getValues("status"),
      statusIdentity: getValues("statusIdentity"),
    });

    setPendingEditData(null);
    setBranchSearch("");
    setUserSearch("");
    setDelegateSearch("");
  };

  const handleEdit = useCallback(
    (data: UserLeaveStatusFormData) => {
      setShowAddForm(true);
      setEditUserLeaveStatus(true);
      setLeaveIdenity(data.identity ?? "");

      setShowBranchDropdown(false);
      setShowUserDropdown(false);
      setShowDelegateDropdown(false);

      setPendingEditData(data);

      setBranchSearch(data.branchCode ?? "");
      setUserSearch(data.userCode ?? "");
      setDelegateSearch(data.delegateUserCode ?? "");

      const statusIdentity = statusData?.find(
        item => item.label === data.status
      );

      reset({
        branchIdentity: data.branchIdentity ?? "",
        branchCode: data.branchCode ?? "",
        userIdentity: data.userIdentity ?? "",
        userCode: data.userCode ?? "",
        leaveFrom: data.leaveFrom,
        leaveTo: data.leaveTo,
        status: data.status ?? "",
        statusIdentity: statusIdentity?.value ?? "",
        remarks: data.remarks,
        delegateUserIdentity: data.delegateUserIdentity ?? "",
        delegateUserCode: data.delegateUserCode ?? "",
      });

      window.scrollTo({ top: 0, behavior: "smooth" });
    },
    [reset, statusData]
  );

  const handleBranchSelect = (option: { value: string; identity?: string }) => {
    setValue("branchCode", option.value);
    setValue("branchIdentity", option?.identity ?? "");
    setShowBranchDropdown(false);
    setBranchSearch("");
  };

  const handleUserSelect = (option: { value: string; identity?: string }) => {
    setValue("userCode", option.value);
    setValue("userIdentity", option.identity ?? "");
    setShowUserDropdown(false);
    setUserSearch("");
  };

  const handleDelegateSelect = (option: {
    value: string;
    identity?: string;
  }) => {
    setValue("delegateUserCode", option.value);
    setValue("delegateUserIdentity", option.identity ?? "");
    setShowDelegateDropdown(false);
    setDelegateSearch("");
  };

  useEffect(() => {
    if (pendingEditData && editUserLeaveStatus) {
      const userDataReady =
        !pendingEditData.userCode || (userData !== undefined && !isUserLoading);
      const delegateDataReady =
        !pendingEditData.delegateUserCode ||
        (delegateData !== undefined && !isDelegateLoading);
      const branchDataReady =
        !pendingEditData.branchCode ||
        (branchData !== undefined && !isBranchLoading);

      if (userDataReady && delegateDataReady && branchDataReady) {
        setValue("userCode", pendingEditData.userCode ?? "", {
          shouldValidate: false,
          shouldDirty: false,
        });
        setValue("statusIdentity", pendingEditData.statusIdentity ?? "", {
          shouldValidate: false,
          shouldDirty: false,
        });
        setValue("status", pendingEditData.status ?? "", {
          shouldValidate: false,
          shouldDirty: false,
        });
        setValue("userIdentity", pendingEditData.userIdentity ?? "", {
          shouldValidate: false,
          shouldDirty: false,
        });
        setValue("delegateUserCode", pendingEditData.delegateUserCode ?? "", {
          shouldValidate: false,
          shouldDirty: false,
        });
        setValue(
          "delegateUserIdentity",
          pendingEditData.delegateUserIdentity ?? "",
          { shouldValidate: false, shouldDirty: false }
        );
        setValue("branchCode", pendingEditData.branchCode ?? "", {
          shouldValidate: false,
          shouldDirty: false,
        });
        setValue("branchIdentity", pendingEditData.branchIdentity ?? "", {
          shouldValidate: false,
          shouldDirty: false,
        });
        setValue("leaveFrom", pendingEditData.leaveFrom ?? "", {
          shouldValidate: false,
          shouldDirty: false,
        });
        setValue("leaveTo", pendingEditData.leaveTo ?? "", {
          shouldValidate: false,
          shouldDirty: false,
        });
        setValue("remarks", pendingEditData.remarks ?? "", {
          shouldValidate: false,
          shouldDirty: false,
        });
        setPendingEditData(null);
      }
    }
  }, [
    userData,
    delegateData,
    branchData,
    isUserLoading,
    isDelegateLoading,
    isBranchLoading,
    pendingEditData,
    editUserLeaveStatus,
    setValue,
  ]);

  return {
    methods,
    control,
    register,
    handleSubmit,
    setValue,
    reset,
    trigger,
    watch,
    errors,

    page,
    size,
    showAddForm,
    editUserLeaveStatus,
    showDeleteModal,
    isImportModalOpen,
    isImportHistoryModalOpen,
    isDownloading,

    showBranchDropdown,
    showUserDropdown,
    showDelegateDropdown,
    branchSearch,
    userSearch,
    delegateSearch,

    data,
    isLoading,
    statusData,
    branchOptions,
    userOptions,
    delegateOptions,

    isBranchLoading,
    isUserLoading,
    isDelegateLoading,

    userError,
    delegateError,

    handlePageChange,
    handleSetUserCode,
    handleSetDelegateUserCode,

    onSubmit,
    handleShowAddForm,
    handleResetForm,
    handleEdit,

    handleDelete,
    handleConfirmDelete,
    handleCancelDelete,

    handleDownloadTemplate,
    handleOpenHistoryModal,
    handleCloseHistoryModal,
    handleRefetchData,
    setIsImportModalOpen,

    handleBranchSelect,
    handleUserSelect,
    handleDelegateSelect,
    setBranchSearch,
    setUserSearch,
    setDelegateSearch,
    setShowBranchDropdown,
    setShowUserDropdown,
    setShowDelegateDropdown,
  };
};
