import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { userDelegationValidationSchema } from "@/global/validation/approval-workflow/user-delegation-schema";
import {
  useSearchUserDelegationsQuery,
  useCreateUserDelegationMutation,
  useUpdateUserDelegationMutation,
  useDeleteUserDelegationMutation,
  useGetworkflowUsersQuery,
  useGetAllUsersQuery,
  useGetModulesQuery,
} from "@/global/service/end-points/approval-workflow/user-delegation";

interface UseUserDelegationProps {
  editData?: {
    identity?: string;
    fromUserIdentity: string;
    toUserIdentity: string;
    startDate: string;
    endDate: string;
    moduleIdentity?: string;
    reason?: string;
    active: boolean;
    fromUserName?: string;
    toUserName?: string;
    fromUserCode?: string;
    toUserCode?: string;
  };
  onSuccess?: () => void;
}

export type { UseUserDelegationProps };

export const useUserDelegation = ({
  editData,
  onSuccess,
}: UseUserDelegationProps = {}) => {
  // Form state
  const form = useForm({
    resolver: yupResolver(userDelegationValidationSchema),
    defaultValues: {
      fromUser: "",
      toUser: "",
      startDate: "",
      endDate: "",
      module: "",
      reason: "",
      active: true,
      ...editData,
    },
  });

  const {
    handleSubmit,
    control,
    register,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = form;
  const activeValue = watch("active");

  // UI state
  const [isFormOpen, setIsFormOpen] = useState(true);
  const [showFromUserDropdown, setShowFromUserDropdown] = useState(false);
  const [showToUserDropdown, setShowToUserDropdown] = useState(false);
  const [editingDelegation, setEditingDelegation] = useState<
    UseUserDelegationProps["editData"] | null
  >(null);
  const [filterFromUser, setFilterFromUser] = useState<string>("all");
  const [filterToUser, setFilterToUser] = useState<string>("all");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteIdentity, setDeleteIdentity] = useState<string | null>(null);

  // Edit mode display values
  const [fromUserDisplayValue, setFromUserDisplayValue] = useState("");
  const [toUserDisplayValue, setToUserDisplayValue] = useState("");

  // Filter state
  const [selectedUser, setSelectedUser] = useState<string>("");
  const [selectedModule, setSelectedModule] = useState<string>("");
  const [userSearchTerm, setUserSearchTerm] = useState<string>("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Table state
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [, setSearchParams] = useState<Record<string, unknown>>({});

  // API queries with dynamic search
  const { data, isLoading, refetch } = useSearchUserDelegationsQuery({
    fromUser: filterFromUser !== "all" ? filterFromUser : undefined,
    toUser: filterToUser !== "all" ? filterToUser : undefined,
    page,
    size,
  });
  const {
    data: users,
    isLoading: isLoadingUsers,
    refetch: refetchUsers,
  } = useGetworkflowUsersQuery(
    { user: "" }, // Load all users initially
    { skip: false }
  );
  const { data: searchUsers, isLoading: isLoadingSearchUsers } =
    useGetworkflowUsersQuery(
      { user: userSearchTerm },
      { skip: !userSearchTerm }
    );
  const { data: allUsers, isLoading: isLoadingAllUsers } =
    useGetAllUsersQuery();
  const { data: modules, isLoading: isLoadingModules } = useGetModulesQuery();

  // Use search results if searching, otherwise use all users
  const userOptions = userSearchTerm ? searchUsers || [] : users || [];

  // API mutations
  const [createDelegation, { isLoading: isCreating }] =
    useCreateUserDelegationMutation();
  const [updateDelegation, { isLoading: isUpdating }] =
    useUpdateUserDelegationMutation();
  const [deleteDelegation, { isLoading: isDeleting }] =
    useDeleteUserDelegationMutation();

  // Form handlers
  const onSubmit = async (data: {
    fromUser: string;
    toUser: string;
    startDate: string;
    endDate: string;
    module?: string;
    reason?: string;
    active: boolean;
  }) => {
    try {
      // Validate required fields first
      if (!data.fromUser) {
        alert("Please select a From User");
        return;
      }
      if (!data.toUser) {
        alert("Please select a To User");
        return;
      }

      const payload = {
        fromUserIdentity: data.fromUser,
        toUserIdentity: data.toUser,
        ...(data.module && { moduleIdentity: data.module }),
        startDate: data.startDate,
        endDate: data.endDate,
        reason: data.reason || "",
        active: data.active ?? true,
      };

      if (editingDelegation?.identity) {
        await updateDelegation({
          identity: editingDelegation.identity,
          ...payload,
        }).unwrap();
      } else {
        await createDelegation(payload).unwrap();
      }

      // Reset form and close it
      reset();
      setIsFormOpen(false);
      setEditingDelegation(null);

      // Refetch data
      refetch();

      onSuccess?.();
    } catch (error: unknown) {
      // Log detailed error information
      if (error && typeof error === "object" && "data" in error) {
        const errorWithData = error as { data?: { message?: string } };
        alert(
          `Operation failed: ${errorWithData.data?.message || JSON.stringify(errorWithData.data)}`
        );
      } else {
        alert("Operation failed. Check console for details.");
      }
    }
  };

  const handleEdit = (
    delegation: NonNullable<UseUserDelegationProps["editData"]>
  ) => {
    setEditingDelegation(delegation);
    setIsFormOpen(true);

    setFromUserDisplayValue(
      `${delegation.fromUserName} (${delegation.fromUserCode})`
    );
    setToUserDisplayValue(
      `${delegation.toUserName} (${delegation.toUserCode})`
    );

    // Reset form with delegation data
    reset({
      fromUser: delegation.fromUserIdentity,
      toUser: delegation.toUserIdentity,
      startDate: delegation.startDate,
      endDate: delegation.endDate,
      module: delegation.moduleIdentity,
      reason: delegation.reason,
      active: delegation.active,
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDeleteLocal = (identity: string) => {
    setDeleteIdentity(identity);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (deleteIdentity) {
      await handleDelete(deleteIdentity);
      refetch();
    }
    setShowDeleteModal(false);
    setDeleteIdentity(null);
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setDeleteIdentity(null);
  };

  const handleReset = () => {
    reset();
    setEditingDelegation(null);
    setFromUserDisplayValue("");
    setToUserDisplayValue("");
    setFilterFromUser("all");
    setFilterToUser("all");
    setPage(0); // Reset to first page
  };

  const handleCancel = () => {
    reset();
    setEditingDelegation(null);
    setFromUserDisplayValue("");
    setToUserDisplayValue("");
  };

  // Filter handlers
  const handleUserChange = (userId: string) => {
    setSelectedUser(userId);
  };

  const handleModuleChange = (moduleId: string) => {
    setSelectedModule(moduleId);
  };

  const handleUserSearch = (searchTerm: string) => {
    setUserSearchTerm(searchTerm);
  };

  const handleFilterToggle = () => {
    setIsFilterOpen(!isFilterOpen);
  };

  const resetFilters = () => {
    setSelectedUser("");
    setSelectedModule("");
    setUserSearchTerm("");
  };

  const applyFilters = () => {
    setIsFilterOpen(false);
  };

  // Table handlers
  const handleDelete = async (identity: string) => {
    try {
      await deleteDelegation(identity).unwrap();
      refetch();
    } catch {
      // Silently handle deletion errors
    }
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleSizeChange = (newSize: number) => {
    setSize(newSize);
    setPage(0);
  };

  const handleSearch = (params: Record<string, unknown>) => {
    setSearchParams(params);
    setPage(0);
  };

  return {
    // Form
    form,
    handleSubmit,
    control,
    register,
    reset,
    watch,
    setValue,
    errors,
    activeValue,
    onSubmit,
    handleEdit,
    handleDeleteLocal,
    handleReset,
    handleCancel,

    // UI State
    isFormOpen,
    setIsFormOpen,
    showFromUserDropdown,
    setShowFromUserDropdown,
    showToUserDropdown,
    setShowToUserDropdown,
    editingDelegation,
    setEditingDelegation,
    filterFromUser,
    setFilterFromUser,
    filterToUser,
    setFilterToUser,
    fromUserDisplayValue,
    toUserDisplayValue,
    showDeleteModal,
    confirmDelete,
    cancelDelete,

    // Filter
    selectedUser,
    selectedModule,
    userSearchTerm,
    isFilterOpen,
    handleUserChange,
    handleModuleChange,
    handleUserSearch,
    handleFilterToggle,
    resetFilters,
    applyFilters,

    // Table
    data,
    page,
    size,
    handleDelete,
    handlePageChange,
    handleSizeChange,
    handleSearch,
    refetch,

    // Data - Map API response to expected format
    users: userOptions,
    filterUsers: allUsers || [], // Separate users for filters
    modules: modules || [],
    refetchUsers,

    // Loading states
    isLoading,
    isLoadingUsers: isLoadingUsers || isLoadingSearchUsers,
    isLoadingAllUsers,
    isLoadingModules,
    isCreating,
    isUpdating,
    isDeleting,

    // Utils
    Controller,
  };
};
